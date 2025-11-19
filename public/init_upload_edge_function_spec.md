# FCC File Upload Edge Functions – v1.1 (Post-Cursor Review)

This doc replaces the previous `init_upload` spec and addresses Cursor's review:

- ✅ Adds **`is_latest` update logic** for plan set files
- ✅ Fixes **project_files object_key path** to include `project_file_id`
- ✅ Adds a **`complete_upload`** edge function to flip `status` → `READY`
- ✅ Confirms usage of `uploadToSignedUrl`
- ✅ Keeps everything aligned with the current schema + architecture

---

## 1. Overview

We now have **two** upload-related edge functions:

1. **`init_upload`**
   - Validates auth + metadata + context
   - Creates:
     - `files` row (`status = 'UPLOADING'`)
     - Domain row:
       - `plan_sets__files` for plan set uploads
       - `project_files` (and `inspection_sessions__project_files`) for project/inspection uploads
   - Returns a **signed upload token** & `object_key` for the client to call `uploadToSignedUrl`.

2. **`complete_upload`**
   - Called by the client **after** successful upload to Storage
   - Sets `files.status = 'READY'` and updates `updated_at`/`updated_by`
   - Can be extended later to trigger background jobs (thumbnails, AI, etc.)

---

## 2. Request/Response Contracts

### 2.1 `init_upload` – Request (JSON)

```jsonc
{
  "kind": "PLAN_SET_FILE" | "PROJECT_FILE" | "INSPECTION_FILE",
  "filename": "plans.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 123456,

  "plan_set": {
    "project_id": "uuid",
    "plan_set_id": "uuid",
    "file_type_code": "CONST_PLANS"
  },

  "project_file": {
    "project_id": "uuid",
    "type_code": "CLIENT_PHOTO",
    "upload_method_code": "CLIENT_PWA"
  },

  "inspection_file": {
    "project_id": "uuid",
    "inspection_session_id": "uuid",
    "type_code": "INSPECTION_PHOTO",
    "upload_method_code": "INSPECTOR_APP"
  }
}
```

- Exactly one of `plan_set`, `project_file`, or `inspection_file` must be present depending on `kind`.

### 2.2 `init_upload` – Response (success)

```jsonc
{
  "success": true,
  "kind": "PLAN_SET_FILE",
  "file": {
    "id": "uuid",
    "bucket": "project-files",
    "object_key": "projects/{project_id}/plan-sets/{plan_set_id}/{file_type_code}/{file_id}_{filename}",
    "filename": "plans.pdf",
    "mime_type": "application/pdf",
    "size_bytes": 123456
  },
  "upload": {
    "method": "uploadToSignedUrl",
    "bucket": "project-files",
    "object_key": "projects/{project_id}/plan-sets/{plan_set_id}/{file_type_code}/{file_id}_{filename}",
    "signed_upload_token": "token-string",
    "expires_in": 3600
  },
  "domain": {
    // For PLAN_SET_FILE
    "plan_sets_file_id": "uuid",
    "plan_set_id": "uuid",
    "file_type_code": "CONST_PLANS"
    // For PROJECT_FILE
    // "project_file_id": "uuid"
    // For INSPECTION_FILE
    // "project_file_id": "uuid",
    // "inspection_session_id": "uuid"
  }
}
```

Other `kind` values return analogous domain objects (`project_file_id`, `inspection_session_id`, etc.).

⸻

### 2.3 `complete_upload` – Request

```jsonc
{
  "file_id": "uuid"
}
```

Optional future extensions:
- Validate bucket/object_key existence
- Accept `context_kind` for extra safety

### 2.4 `complete_upload` – Response

```jsonc
{
  "success": true,
  "file_id": "uuid",
  "status": "READY"
}
```

⸻

## 3. `init_upload` Edge Function (Final Version)

**File path:** `supabase/functions/init_upload/index.ts`

```typescript
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

// ----------------------------
// Request types
// ----------------------------

interface BaseUploadRequest {
  kind: UploadKind;
  filename: string;
  mime_type: string;
  size_bytes: number;
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

    // Auth client to resolve user from token (RLS bypassed only with service role)
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

    // FCC convention: auth.users.id == user_profiles.id
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

    const { kind, filename, mime_type, size_bytes } = payload;

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
      return await handlePlanSetFileUpload(sb, payload, safeFilename, userProfileId);
    }

    if (kind === "PROJECT_FILE") {
      return await handleProjectFileUpload(sb, payload, safeFilename, userProfileId);
    }

    if (kind === "INSPECTION_FILE") {
      return await handleInspectionFileUpload(sb, payload, safeFilename, userProfileId);
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

  // Future: check document_review_status_id to enforce client edit rules here if needed.

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
// PROJECT_FILE handler
// ----------------------------

async function handleProjectFileUpload(
  sb: ReturnType<typeof createClient>,
  payload: InitUploadRequest,
  safeFilename: string,
  userProfileId: string,
): Promise<Response> {
  const ctx = payload.project_file;

  if (!ctx) {
    return jsonResponse(
      {
        success: false,
        error:
          "project_file context is required for kind = 'PROJECT_FILE'. Expected { project_id, type_code, upload_method_code }.",
      },
      400,
    );
  }

  const { project_id, type_code, upload_method_code } = ctx;

  // Project must exist
  const { data: project, error: projectError } = await sb
    .from("projects")
    .select("id")
    .eq("id", project_id)
    .maybeSingle();

  if (projectError) {
    return jsonResponse(
      {
        success: false,
        error: "Failed to load project.",
        details: projectError.message,
      },
      500,
    );
  }

  if (!project) {
    return jsonResponse(
      { success: false, error: "Project not found." },
      404,
    );
  }

  // Type lookup
  const { data: typeRow, error: typeError } = await sb
    .from("project_files_type_field")
    .select("id, code")
    .eq("code", type_code)
    .maybeSingle();

  if (typeError) {
    return jsonResponse(
      {
        success: false,
        error: "Failed to load project_files_type_field.",
        details: typeError.message,
      },
      500,
    );
  }

  if (!typeRow) {
    return jsonResponse(
      {
        success: false,
        error: `Unknown project_files_type_field.code '${type_code}'.`,
      },
      400,
    );
  }

  // Upload method lookup
  const { data: uploadMethodRow, error: uploadMethodError } = await sb
    .from("project_files_upload_method_field")
    .select("id, code")
    .eq("code", upload_method_code)
    .maybeSingle();

  if (uploadMethodError) {
    return jsonResponse(
      {
        success: false,
        error: "Failed to load project_files_upload_method_field.",
        details: uploadMethodError.message,
      },
      500,
    );
  }

  if (!uploadMethodRow) {
    return jsonResponse(
      {
        success: false,
        error:
          `Unknown project_files_upload_method_field.code '${upload_method_code}'.`,
      },
      400,
    );
  }

  const bucket = "project-files";
  const fileId = crypto.randomUUID();
  const projectFileId = crypto.randomUUID(); // pre-generate PK for project_files

  // PATH FIX: include project_file_id in the path per architecture
  const objectKey =
    `projects/${project_id}/files/${projectFileId}/${fileId}_${safeFilename}`;

  // Insert file
  const { data: fileRecord, error: fileError } = await sb
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

  if (fileError) {
    return jsonResponse(
      {
        success: false,
        error: "Failed to create file record.",
        details: fileError.message,
      },
      500,
    );
  }

  // Insert project_files using explicit id
  const { data: projectFile, error: projectFileError } = await sb
    .from("project_files")
    .insert({
      id: projectFileId,
      project_id,
      file_id: fileRecord.id,
      type_id: typeRow.id,
      upload_method_id: uploadMethodRow.id,
      is_internal_only: false,
      is_visible_to_client: true,
      created_by: userProfileId,
    })
    .select("id")
    .single();

  if (projectFileError) {
    await sb.from("files").delete().eq("id", fileRecord.id);
    return jsonResponse(
      {
        success: false,
        error: "Failed to create project_files record.",
        details: projectFileError.message,
      },
      500,
    );
  }

  // Signed upload URL
  const { data: signedUploadData, error: signedUploadError } = await sb.storage
    .from(bucket)
    .createSignedUploadUrl(objectKey, { upsert: true });

  if (signedUploadError) {
    await sb.from("project_files").delete().eq("id", projectFile.id);
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
      kind: "PROJECT_FILE",
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
        project_file_id: projectFile.id,
        project_id,
        type_code,
        upload_method_code,
      },
    },
    200,
  );
}

// ----------------------------
// INSPECTION_FILE handler
// ----------------------------

async function handleInspectionFileUpload(
  sb: ReturnType<typeof createClient>,
  payload: InitUploadRequest,
  safeFilename: string,
  userProfileId: string,
): Promise<Response> {
  const ctx = payload.inspection_file;

  if (!ctx) {
    return jsonResponse(
      {
        success: false,
        error:
          "inspection_file context is required for kind = 'INSPECTION_FILE'. Expected { project_id, inspection_session_id, type_code, upload_method_code }.",
      },
      400,
    );
  }

  const { project_id, inspection_session_id, type_code, upload_method_code } =
    ctx;

  // Inspection session must exist and belong to project
  const { data: session, error: sessionError } = await sb
    .from("inspection_sessions")
    .select("id, project_id")
    .eq("id", inspection_session_id)
    .maybeSingle();

  if (sessionError) {
    return jsonResponse(
      {
        success: false,
        error: "Failed to load inspection session.",
        details: sessionError.message,
      },
      500,
    );
  }

  if (!session) {
    return jsonResponse(
      { success: false, error: "Inspection session not found." },
      404,
    );
  }

  if (session.project_id !== project_id) {
    return jsonResponse(
      {
        success: false,
        error: "Inspection session does not belong to the specified project.",
      },
      400,
    );
  }

  // Type lookup
  const { data: typeRow, error: typeError } = await sb
    .from("project_files_type_field")
    .select("id, code")
    .eq("code", type_code)
    .maybeSingle();

  if (typeError) {
    return jsonResponse(
      {
        success: false,
        error: "Failed to load project_files_type_field.",
        details: typeError.message,
      },
      500,
    );
  }

  if (!typeRow) {
    return jsonResponse(
      {
        success: false,
        error: `Unknown project_files_type_field.code '${type_code}'.`,
      },
      400,
    );
  }

  // Upload method lookup
  const { data: uploadMethodRow, error: uploadMethodError } = await sb
    .from("project_files_upload_method_field")
    .select("id, code")
    .eq("code", upload_method_code)
    .maybeSingle();

  if (uploadMethodError) {
    return jsonResponse(
      {
        success: false,
        error: "Failed to load project_files_upload_method_field.",
        details: uploadMethodError.message,
      },
      500,
    );
  }

  if (!uploadMethodRow) {
    return jsonResponse(
      {
        success: false,
        error:
          `Unknown project_files_upload_method_field.code '${upload_method_code}'.`,
      },
      400,
    );
  }

  const bucket = "inspection-files";
  const fileId = crypto.randomUUID();
  const projectFileId = crypto.randomUUID(); // also give inspection media its own project_files row

  const objectKey =
    `projects/${project_id}/sessions/${inspection_session_id}/${type_code}/${fileId}_${safeFilename}`;

  // Insert file
  const { data: fileRecord, error: fileError } = await sb
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

  if (fileError) {
    return jsonResponse(
      {
        success: false,
        error: "Failed to create file record.",
        details: fileError.message,
      },
      500,
    );
  }

  // Insert project_files
  const { data: projectFile, error: projectFileError } = await sb
    .from("project_files")
    .insert({
      id: projectFileId,
      project_id,
      file_id: fileRecord.id,
      type_id: typeRow.id,
      upload_method_id: uploadMethodRow.id,
      is_internal_only: false,
      is_visible_to_client: true,
      created_by: userProfileId,
    })
    .select("id")
    .single();

  if (projectFileError) {
    await sb.from("files").delete().eq("id", fileRecord.id);
    return jsonResponse(
      {
        success: false,
        error: "Failed to create project_files record for inspection.",
        details: projectFileError.message,
      },
      500,
    );
  }

  // Link to inspection session
  const { data: inspectionLink, error: linkError } = await sb
    .from("inspection_sessions__project_files")
    .insert({
      inspection_session_id,
      project_file_id: projectFile.id,
      created_by: userProfileId,
    })
    .select("id")
    .single();

  if (linkError) {
    await sb.from("inspection_sessions__project_files")
      .delete()
      .eq("project_file_id", projectFile.id);
    await sb.from("project_files").delete().eq("id", projectFile.id);
    await sb.from("files").delete().eq("id", fileRecord.id);

    return jsonResponse(
      {
        success: false,
        error:
          "Failed to create inspection_sessions__project_files link record.",
        details: linkError.message,
      },
      500,
    );
  }

  // Signed upload URL
  const { data: signedUploadData, error: signedUploadError } = await sb.storage
    .from(bucket)
    .createSignedUploadUrl(objectKey, { upsert: true });

  if (signedUploadError) {
    await sb.from("inspection_sessions__project_files")
      .delete()
      .eq("id", inspectionLink.id);
    await sb.from("project_files").delete().eq("id", projectFile.id);
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
      kind: "INSPECTION_FILE",
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
        project_file_id: projectFile.id,
        inspection_session_id,
        type_code,
        upload_method_code,
      },
    },
    200,
  );
}
```

⸻

## 4. `complete_upload` Edge Function

**File path:** `supabase/functions/complete_upload/index.ts`

**Purpose:**
- Flip `files.status` from `UPLOADING` → `READY`
- Optionally, you can call this from the client after `uploadToSignedUrl` succeeds

```typescript
// deno-lint-ignore-file no-explicit-any
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.1";

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

    const { file_id } = payload;

    if (!file_id || typeof file_id !== "string") {
      return jsonResponse(
        { success: false, error: "file_id is required." },
        400,
      );
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
```

⸻

## 5. Client Flow (Summary)

1. Call `init_upload` with metadata + context.
2. Receive:
   - `file.id`
   - `upload.bucket`
   - `upload.object_key`
   - `upload.signed_upload_token`
3. Upload directly to Storage:

```typescript
const { bucket, object_key, signed_upload_token } = initResponse.upload;

const { data, error } = await supabase.storage
  .from(bucket)
  .uploadToSignedUrl(object_key, signed_upload_token, file);
```

4. Call `complete_upload` with `file_id` once upload succeeds.

⸻

This resolves Cursor's review items and gives you a clean, production-worthy starting point for file handling in myFCC and fccOPS.
