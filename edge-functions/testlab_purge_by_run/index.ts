import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type PurgeRequestBody = {
  runIds: string[];
  reason: string;
  actorId: string; // auth.users.id of the person doing the purge
};

const DELETE_PRIORITY: Record<string, number> = {
  // Child junction tables first
  services__deals: 10,
  deals__contacts: 10,
  companies__contacts: 10,
  companies__professional_licenses: 10,
  projects__services: 10,
  companies__project_types: 10,  // NEW - must be deleted before companies
  // Other child tables
  plan_sets__files: 20,
  plan_sets: 25,
  // Core domain objects next
  deals: 30,
  projects: 30,
  contacts: 40,
  companies: 50,
  // Fallback for anything not listed
  default: 100,
};

function getDeletePriority(tableName: string): number {
  return DELETE_PRIORITY[tableName] ?? DELETE_PRIORITY.default;
}

Deno.serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Method not allowed',
      }),
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      },
    );
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[testlab_purge_by_run] Missing Supabase env vars');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing Supabase configuration',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = (await req.json()) as PurgeRequestBody;
    const runIds = body.runIds;
    const reason = body.reason?.trim();
    const actorId = body.actorId;

    if (!Array.isArray(runIds) || runIds.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'runIds must be a non-empty array of UUIDs',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        },
      );
    }

    if (!reason) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Purge reason is required',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        },
      );
    }

    if (!actorId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'actorId (auth.users.id) is required',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        },
      );
    }

    console.log('[testlab_purge_by_run] Starting purge', {
      runIds,
      actorId,
    });

    // 1) Fetch all test_records for these runs
    const { data: records, error: recordsError } = await supabase
      .from('test_records')
      .select('id, run_id, table_name, record_id')
      .in('run_id', runIds);

    if (recordsError) {
      console.error('[testlab_purge_by_run] Failed to fetch test_records', recordsError);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Failed to fetch test_records: ${recordsError.message}`,
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        },
      );
    }

    if (!records || records.length === 0) {
      console.log('[testlab_purge_by_run] No test_records found for runs', runIds);

      // Still update test_runs + activity_log so we have an audit trail
      const nowIso = new Date().toISOString();
      const { error: updateRunsError } = await supabase
        .from('test_runs')
        .update({
          purged_at: nowIso,
          purged_by: actorId,
          purge_reason: reason,
        })
        .in('id', runIds);

      if (updateRunsError) {
        console.error('[testlab_purge_by_run] Failed to update empty runs', updateRunsError);
      }

      const activityRows = runIds.map((runId) => ({
        actor_id: actorId,
        actor_type: 'internal',
        action: 'test_records_purged',
        target_table: 'test_runs',
        target_id: runId,
        context: {
          run_id: runId,
          records_deleted: 0,
          reason,
          note: 'No test_records found for run',
        },
      }));

      const { error: activityError } = await supabase
        .from('activity_log')
        .insert(activityRows);

      if (activityError) {
        console.error('[testlab_purge_by_run] Failed to write activity logs for empty runs', activityError);
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'No test_records found for the given runs. Runs marked as purged.',
          data: {
            deletedCounts: {},
          },
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        },
      );
    }

    // 2) Group record_ids by table_name
    const tableMap = new Map<string, Set<string>>();
    for (const rec of records) {
      if (!rec.table_name || !rec.record_id) continue;

      if (!tableMap.has(rec.table_name)) {
        tableMap.set(rec.table_name, new Set<string>());
      }
      tableMap.get(rec.table_name)!.add(rec.record_id);
    }

    // 3) Determine delete order based on priority
    const tableNames = Array.from(tableMap.keys()).sort(
      (a, b) => getDeletePriority(a) - getDeletePriority(b),
    );

    const deletedCounts: Record<string, number> = {};

    // 4) Delete rows table by table
    for (const tableName of tableNames) {
      const ids = Array.from(tableMap.get(tableName)!);
      if (ids.length === 0) continue;

      console.log('[testlab_purge_by_run] Deleting from table', tableName, {
        count: ids.length,
      });

      // @ts-ignore dynamic table name is allowed at runtime
      const { error: deleteError, count } = await supabase
        .from(tableName)
        .delete({ count: 'exact' })
        .in('id', ids);

      if (deleteError) {
        console.error(
          `[testlab_purge_by_run] Failed to delete from ${tableName}`,
          deleteError,
        );
        return new Response(
          JSON.stringify({
            success: false,
            error: `Failed to delete from ${tableName}: ${deleteError.message}`,
          }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          },
        );
      }

      deletedCounts[tableName] = count ?? ids.length;
    }

    // 5) Delete from test_records themselves
    const { error: deleteRecordsError } = await supabase
      .from('test_records')
      .delete()
      .in('run_id', runIds);

    if (deleteRecordsError) {
      console.error(
        '[testlab_purge_by_run] Failed to delete from test_records',
        deleteRecordsError,
      );
      // Not fatal for data safety, but log it
    }

    // 6) Update test_runs (purged_at, purged_by, purge_reason)
    const nowIso = new Date().toISOString();
    const { error: updateRunsError } = await supabase
      .from('test_runs')
      .update({
        purged_at: nowIso,
        purged_by: actorId,
        purge_reason: reason,
      })
      .in('id', runIds);

    if (updateRunsError) {
      console.error('[testlab_purge_by_run] Failed to update test_runs', updateRunsError);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Failed to update test_runs: ${updateRunsError.message}`,
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        },
      );
    }

    // 7) Write activity_log entries (one per run)
    const totalDeleted = Object.values(deletedCounts).reduce(
      (sum, n) => sum + (n ?? 0),
      0,
    );

    const activityRows = runIds.map((runId) => ({
      actor_id: actorId,
      actor_type: 'internal',
      action: 'test_records_purged',
      target_table: 'test_runs',
      target_id: runId,
      context: {
        run_id: runId,
        deleted_counts: deletedCounts,
        total_deleted: totalDeleted,
        reason,
      },
    }));

    const { error: activityError } = await supabase
      .from('activity_log')
      .insert(activityRows);

    if (activityError) {
      console.error('[testlab_purge_by_run] Failed to write activity_log', activityError);
      // Not fatal to the purge itself
    }

    console.log('[testlab_purge_by_run] Purge complete', {
      runIds,
      deletedCounts,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Test data purged successfully.',
        data: {
          deletedCounts,
          totalDeleted,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      },
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : JSON.stringify(err);
    console.error('[testlab_purge_by_run] Unhandled error', message, err);
    return new Response(
      JSON.stringify({
        success: false,
        error: message,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      },
    );
  }
});

