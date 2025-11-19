// deno-lint-ignore-file no-explicit-any
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.1";

/**
 * FCC init_upload
 *
 * - Validates metadata, auth, and context
 * - Creates:
 *    - files row (status = 'UPLOADING')
 *    - plan_sets__files OR project_files (+ inspection_sessions__project_files)
 * - Returns signed upload token for direct upload via:
 *   supabase.storage.from(bucket).uploadToSignedUrl(object_key, token, file)
 * - TestLab logging: logs files and plan_sets__files records when created
 */

const MAX_FILE_SIZE_BYTES = 1024 * 1024 * 1024; // 1GB
const SIGNED_URL_EXPIRY_SECONDS = 3600; // 1 hour

// Allowed file types (MIME types)
const ALLOWED_MIME_TYPES = [
  // Images
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  // Videos
  "video/mp4",
  "video/mpeg",
  "video/quicktime",
  "video/x-msvideo",
  "video/webm",
  // PDFs and Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/csv",
];

type UploadKind = "PLAN_SET_FILE" | "PROJECT_FILE" | "INSPECTION_FILE";

// ----------------------------
// Helpers
// ----------------------------

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

function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[\/\\]/g, "_")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .substring(0, 255);
}

function validateMimeType(mimeType: string | null | undefined): boolean {
  if (!mimeType) return false;
  return ALLOWED_MIME_TYPES.includes(mimeType.toLowerCase());
}

function ensureEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Helper: log a test record if run_id and scenario_id are provided
async function logTestRecord(
  sb: ReturnType<typeof createClient>,
  runId: string | null | undefined,
  scenarioId: string | null | undefined,
  tableName: string,
  recordId: string,
  createdBy: string | null,
): Promise<void> {
  if (!runId || !scenarioId) {
    // Not a TestLab run, skip logging
    return;
  }

  try {
    const { error } = await sb.rpc("testlab_log_record", {
      p_run_id: runId,
      p_scenario_id: scenarioId,
      p_table_name: tableName,
      p_record_id: recordId,
      p_created_by: createdBy,
      p_table_id: null,
    });

    if (error) {
      console.error(`Failed to log test record for ${tableName}:`, error);
      // Don't throw - logging failure shouldn't break the flow
    }
  } catch (err) {
    console.error(`Error logging test record for ${tableName}:`, err);
    // Don't throw - logging failure shouldn't break the flow
  }
}

// ----------------------------
// Request types
// ----------------------------

interface BaseUploadRequest {
  kind: UploadKind;
  filename: string;
  mime_type: string;
  size_bytes: number;
  run_id?: string; // Optional: for TestLab logging
  scenario_id?: string; // Optional: for TestLab logging
}

interface PlanSetUploadContext {
  project_id: string;
  plan_set_id: string;
  file_type_code: string; // plan_sets_file_types.code
}

interface ProjectFileUploadContext {
  project_id: string;
  type_code: string; // project_files_type_field.code
  upload_method_code: string; // project_files_upload_method_field.code
}

interface InspectionFileUploadContext {
  project_id: string;
  inspection_session_id: string;
  type_code: string; // project_files_type_field.code
  upload_method_code: string; // project_files_upload_method_field.code
}

interface InitUploadRequest extends BaseUploadRequest {
  plan_set?: PlanSetUploadContext;
  project_file?: ProjectFileUploadContext;
  inspection_file?: InspectionFileUploadContext;
}

// ----------------------------
// Main handler
// ----------------------------

Deno.serve(async (req) => {
  // CORS preflight
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

    // ----------------------
    // Auth
    // ----------------------
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

    // Auth client to resolve user from token
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

    // Service-role client for DB + Storage
    const sb = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // ----------------------
    // Parse and validate body
    // ----------------------
    let payload: InitUploadRequest;
    try {
      payload = (await req.json()) as InitUploadRequest;
    } catch {
      return jsonResponse(
        { success: false, error: "Invalid JSON payload." },
        400,
      );
    }

    const { kind, filename, mime_type, size_bytes, run_id, scenario_id } = payload;

    if (!kind || !["PLAN_SET_FILE", "PROJECT_FILE", "INSPECTION_FILE"].includes(kind)) {
      return jsonResponse(
        {
          success: false,
          error: "Invalid or missing 'kind'.",
          allowed_kinds: ["PLAN_SET_FILE", "PROJECT_FILE", "INSPECTION_FILE"],
        },
        400,
      );
    }

    if (!filename || typeof filename !== "string") {
      return jsonResponse(
        { success: false, error: "filename is required." },
        400,
      );
    }

    if (!validateMimeType(mime_type)) {
      return jsonResponse(
        {
          success: false,
          error: "Invalid or missing mime_type.",
          allowed: ALLOWED_MIME_TYPES,
        },
        400,
      );
    }

    if (
      typeof size_bytes !== "number" ||
      !Number.isFinite(size_bytes) ||
      size_bytes <= 0
    ) {
      return jsonResponse(
        { success: false, error: "size_bytes must be a positive number." },
        400,
      );
    }

    if (size_bytes > MAX_FILE_SIZE_BYTES) {
      return jsonResponse(
        {
          success: false,
          error: `File too large. Max size is ${
            MAX_FILE_SIZE_BYTES / (1024 * 1024)
          } MB.`,
        },
        400,
      );
    }

    const safeFilename = sanitizeFilename(filename);

    // ----------------------
    // Dispatch by kind
    // ----------------------
    if (kind === "PLAN_SET_FILE") {
      return await handlePlanSetFileUpload(sb, payload, safeFilename, userProfileId, run_id, scenario_id);
    }

    if (kind === "PROJECT_FILE") {
      return await handleProjectFileUpload(sb, payload, safeFilename, userProfileId, run_id, scenario_id);
    }

    if (kind === "INSPECTION_FILE") {
      return await handleInspectionFileUpload(sb, payload, safeFilename, userProfileId, run_id, scenario_id);
    }

    // Should never reach here
    return jsonResponse(
      {
        success: false,
        error: `Upload kind '${kind}' is not implemented.`,
      },
      400,
    );
  } catch (err) {
    console.error("init_upload error:", err);
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

// ----------------------------
// PLAN_SET_FILE handler
// ----------------------------

async function handlePlanSetFileUpload(
  sb: ReturnType<typeof createClient>,
  payload: InitUploadRequest,
  safeFilename: string,
  userProfileId: string,
  runId: string | null | undefined,
  scenarioId: string | null | undefined,
): Promise<Response> {
  const ctx = payload.plan_set;

  if (!ctx) {
    return jsonResponse(
      {
        success: false,
        error:
          "plan_set context is required for kind = 'PLAN_SET_FILE'. Expected { project_id, plan_set_id, file_type_code }.",
      },
      400,
    );
  }

  const { project_id, plan_set_id, file_type_code } = ctx;

  // plan_set must exist and belong to project
  const { data: planSet, error: planSetError } = await sb
    .from("plan_sets")
    .select("id, project_id, type, document_review_status_id")
    .eq("id", plan_set_id)
    .maybeSingle();

  if (planSetError) {
    return jsonResponse(
      {
        success: false,
        error: "Failed to load plan set.",
        details: planSetError.message,
      },
      500,
    );
  }

  if (!planSet) {
    return jsonResponse(
      { success: false, error: "Plan set not found." },
      404,
    );
  }

  if (planSet.project_id !== project_id) {
    return jsonResponse(
      {
        success: false,
        error: "Plan set does not belong to the specified project.",
      },
      400,
    );
  }

  // Look up file type by code
  const { data: fileType, error: fileTypeError } = await sb
    .from("plan_sets_file_types")
    .select("id, code")
    .eq("code", file_type_code)
    .maybeSingle();

  if (fileTypeError) {
    return jsonResponse(
      {
        success: false,
        error: "Failed to load plan set file type.",
        details: fileTypeError.message,
      },
      500,
    );
  }

  if (!fileType) {
    return jsonResponse(
      {
        success: false,
        error: `Unknown plan_sets_file_types.code '${file_type_code}'.`,
      },
      400,
    );
  }

  const bucket = "project-files";
  const fileId = crypto.randomUUID();
  const objectKey =
    `projects/${project_id}/plan-sets/${plan_set_id}/${file_type_code}/${fileId}_${safeFilename}`;

  // Determine previous version (if any) for this (plan_set_id, file_type_id)
  const { data: previousFiles, error: prevError } = await sb
    .from("plan_sets__files")
    .select("id, file_id, version")
    .eq("plan_set_id", plan_set_id)
    .eq("file_type_id", fileType.id)
    .is("deleted_at", null)
    .order("version", { ascending: false })
    .limit(1);

  if (prevError) {
    return jsonResponse(
      {
        success: false,
        error: "Failed to load previous plan set file versions.",
        details: prevError.message,
      },
      500,
    );
  }

  const previous = previousFiles && previousFiles.length > 0 ? previousFiles[0] : null;
  const nextVersion = previous?.version ? Number(previous.version) + 1 : 1;
  const previousVersionFileId = previous?.file_id ?? null;

  // Insert into files
  const { data: fileRecord, error: fileInsertError } = await sb
    .from("files")
    .insert({
      id: fileId,
      filename: safeFilename,
      mime_type: payload.mime_type,
      size_bytes: payload.size_bytes,
      bucket,
      object_key: objectKey,
      metadata: {},
      status: "UPLOADING",
      created_by: userProfileId,
      updated_by: userProfileId,
    })
    .select("id")
    .single();

  if (fileInsertError) {
    return jsonResponse(
      {
        success: false,
        error: "Failed to create file record.",
        details: fileInsertError.message,
      },
      500,
    );
  }

  // TestLab logging: log files record immediately
  await logTestRecord(sb, runId, scenarioId, "files", fileRecord.id, userProfileId);

  // Insert into plan_sets__files with is_latest = true, previous_version_file_id set
  const { data: planSetFile, error: planSetFileError } = await sb
    .from("plan_sets__files")
    .insert({
      plan_set_id,
      file_id: fileRecord.id,
      file_type_id: fileType.id,
      version: nextVersion,
      previous_version_file_id: previousVersionFileId,
      is_latest: true,
      created_by: userProfileId,
    })
    .select("id")
    .single();

  if (planSetFileError) {
    await sb.from("files").delete().eq("id", fileRecord.id);
    return jsonResponse(
      {
        success: false,
        error: "Failed to create plan_sets__files record.",
        details: planSetFileError.message,
      },
      500,
    );
  }

  // TestLab logging: log plan_sets__files record immediately
  await logTestRecord(sb, runId, scenarioId, "plan_sets__files", planSetFile.id, userProfileId);

  // IMPORTANT: ensure only this row is is_latest = true
  if (previous) {
    const { error: updatePrevError } = await sb
      .from("plan_sets__files")
      .update({ is_latest: false })
      .eq("plan_set_id", plan_set_id)
      .eq("file_type_id", fileType.id)
      .neq("id", planSetFile.id)
      .is("deleted_at", null);

    if (updatePrevError) {
      // Strict: rollback to avoid two "latest" versions
      await sb.from("plan_sets__files").delete().eq("id", planSetFile.id);
      await sb.from("files").delete().eq("id", fileRecord.id);

      return jsonResponse(
        {
          success: false,
          error: "Failed to update previous versions' is_latest flag.",
          details: updatePrevError.message,
        },
        500,
      );
    }
  }

  // Generate signed upload URL (v2 API supports uploadToSignedUrl)
  const { data: signedUploadData, error: signedUploadError } = await sb.storage
    .from(bucket)
    .createSignedUploadUrl(objectKey, { upsert: true });

  if (signedUploadError) {
    await sb.from("plan_sets__files").delete().eq("id", planSetFile.id);
    await sb.from("files").delete().eq("id", fileRecord.id);

    return jsonResponse(
      {
        success: false,
        error: "Failed to generate signed upload URL.",
        details: signedUploadError.message,
      },
      500,
    );
  }

  return jsonResponse(
    {
      success: true,
      kind: "PLAN_SET_FILE",
      file: {
        id: fileRecord.id,
        bucket,
        object_key: objectKey,
        filename: safeFilename,
        mime_type: payload.mime_type,
        size_bytes: payload.size_bytes,
      },
      upload: {
        method: "uploadToSignedUrl",
        bucket,
        object_key: objectKey,
        signed_upload_token: signedUploadData?.token,
        expires_in: SIGNED_URL_EXPIRY_SECONDS,
      },
      domain: {
        plan_sets_file_id: planSetFile.id,
        plan_set_id,
        file_type_code,
      },
    },
    200,
  );
}

// ----------------------------
// PROJECT_FILE handler (stub - not needed for Scenario 3)
// ----------------------------

async function handleProjectFileUpload(
  sb: ReturnType<typeof createClient>,
  payload: InitUploadRequest,
  safeFilename: string,
  userProfileId: string,
  runId: string | null | undefined,
  scenarioId: string | null | undefined,
): Promise<Response> {
  return jsonResponse(
    {
      success: false,
      error: "PROJECT_FILE upload not yet implemented.",
    },
    501,
  );
}

// ----------------------------
// INSPECTION_FILE handler (stub - not needed for Scenario 3)
// ----------------------------

async function handleInspectionFileUpload(
  sb: ReturnType<typeof createClient>,
  payload: InitUploadRequest,
  safeFilename: string,
  userProfileId: string,
  runId: string | null | undefined,
  scenarioId: string | null | undefined,
): Promise<Response> {
  return jsonResponse(
    {
      success: false,
      error: "INSPECTION_FILE upload not yet implemented.",
    },
    501,
  );
}

