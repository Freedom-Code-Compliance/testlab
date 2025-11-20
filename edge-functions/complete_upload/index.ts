// deno-lint-ignore-file no-explicit-any
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.1";

/**
 * FCC complete_upload
 *
 * - Called by client after successful upload to Storage
 * - Sets files.status = 'READY' and updates updated_at/updated_by
 * - Guardrail: For Scenario 3, checks if project already has Initial plan set
 *   (Note: Plan sets are created in frontend PlanSetPanel, but this provides
 *    additional backend safety check if plan set creation is moved to backend)
 */

function jsonResponse(body: any, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
    },
  });
}

function ensureEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

interface CompleteUploadRequest {
  file_id: string;
  // Optional: for guardrail check (if plan set creation moves to backend)
  project_id?: string;
  run_id?: string;
  scenario_id?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return jsonResponse({}, 200);
  }

  if (req.method !== "POST") {
    return jsonResponse(
      { success: false, error: "Method not allowed. Use POST." },
      405,
    );
  }

  try {
    const supabaseUrl = ensureEnv("SUPABASE_URL");
    const anonKey = ensureEnv("SUPABASE_ANON_KEY");
    const serviceKey = ensureEnv("SUPABASE_SERVICE_ROLE_KEY");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return jsonResponse(
        {
          success: false,
          error: "Authorization header with Bearer token is required.",
        },
        401,
      );
    }
    const token = authHeader.replace("Bearer ", "").trim();

    // Auth client (used to resolve user)
    const authClient = createClient(supabaseUrl, anonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const {
      data: { user: authUser },
      error: authError,
    } = await authClient.auth.getUser();

    if (authError || !authUser) {
      return jsonResponse(
        {
          success: false,
          error: "Invalid or expired token.",
          details: authError?.message ?? null,
        },
        401,
      );
    }

    const userProfileId = authUser.id;

    // Service role client
    const sb = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    let payload: CompleteUploadRequest;
    try {
      payload = (await req.json()) as CompleteUploadRequest;
    } catch {
      return jsonResponse(
        { success: false, error: "Invalid JSON payload." },
        400,
      );
    }

    const { file_id, project_id, run_id, scenario_id } = payload;

    if (!file_id || typeof file_id !== "string") {
      return jsonResponse(
        { success: false, error: "file_id is required." },
        400,
      );
    }

    // Guardrail: If this is for Scenario 3 and project_id is provided,
    // check if project already has an Initial plan set
    // (This is a safety check - plan sets are currently created in frontend,
    //  but this provides backend protection if creation moves to backend)
    // Note: The primary guardrail is in PlanSetPanel.ensurePlanSet before creating plan sets.
    // This is an additional backend safety check.
    if (project_id && run_id && scenario_id) {
      const { data: existingPlanSet, error: guardrailError } = await sb
        .rpc('check_initial_plan_set_exists', { p_project_id: project_id })
        .single();
      
      // Use direct query with enum cast
      const { data: existingPlanSetDirect, error: guardrailErrorDirect } = await sb
        .from("plan_sets")
        .select("id")
        .eq("project_id", project_id)
        .eq("type", "INITIAL")
        .is("deleted_at", null)
        .maybeSingle();
      
      if (guardrailErrorDirect) {
        console.error("Guardrail check error:", guardrailErrorDirect);
        // Don't fail the upload, just log the error
      } else if (existingPlanSetDirect?.id) {
        // Project already has Initial plan set - this shouldn't happen if view filtering works,
        // but provide backend safety
        return jsonResponse(
          {
            success: false,
            error: "This project already has an Initial plan set.",
          },
          400,
        );
      }

      if (guardrailError) {
        console.error("Guardrail check error:", guardrailError);
        // Don't fail the upload, just log the error
      } else if (existingPlanSet?.id) {
        // Project already has Initial plan set - this shouldn't happen if view filtering works,
        // but provide backend safety
        return jsonResponse(
          {
            success: false,
            error: "This project already has an Initial plan set.",
          },
          400,
        );
      }
    }

    // Verify file exists
    const { data: fileRow, error: fileError } = await sb
      .from("files")
      .select("id, status")
      .eq("id", file_id)
      .maybeSingle();

    if (fileError) {
      return jsonResponse(
        {
          success: false,
          error: "Failed to load file record.",
          details: fileError.message,
        },
        500,
      );
    }

    if (!fileRow) {
      return jsonResponse(
        { success: false, error: "File not found." },
        404,
      );
    }

    // Update status to READY
    const { error: updateError } = await sb
      .from("files")
      .update({
        status: "READY",
        updated_by: userProfileId,
      })
      .eq("id", file_id);

    if (updateError) {
      return jsonResponse(
        {
          success: false,
          error: "Failed to update file status to READY.",
          details: updateError.message,
        },
        500,
      );
    }

    return jsonResponse(
      {
        success: true,
        file_id,
        status: "READY",
      },
      200,
    );
  } catch (err) {
    console.error("complete_upload error:", err);
    return jsonResponse(
      {
        success: false,
        error: "Internal server error.",
        details: err instanceof Error ? err.message : String(err),
      },
      500,
    );
  }
});

