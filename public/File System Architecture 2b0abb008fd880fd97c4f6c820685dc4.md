# File System Architecture

Author: Josh Barry
Description: This document outlines a scalable file storage architecture designed for Freedom Code Compliance and Paradigm Labs, focusing on a unified approach to managing various file types such as project documents, inspection media, and templates. It details a multi-layered structure with strict data handling rules, supports large file uploads, and incorporates access control measures for secure file management. The architecture aims to enhance efficiency and facilitate future automation while maintaining an audit trail.
Last edited by: Josh Barry
Last edited time: November 18, 2025 9:46 PM
Status: Draft
TL;DR: This PRD outlines a scalable, AI-ready file storage architecture for managing diverse project files, including plan sets and inspection media. It emphasizes a unified representation, robust support for large files, and strict access controls, facilitating efficient document handling and automation.

```
# **FCC File & Media Architecture v2 (Final)**

A unified, scalable, AI-ready file storage architecture for Freedom Code Compliance and Paradigm Labs.

---

# **1. Goals**

- Single, consistent representation of **every file** in the system
- Robust support for:
  - Plan sets (initial, quote, revisions, stamped, provider docs)
  - Inspection media (photos, videos, logs, certs)
  - Project-level documents (daily logs, uploads, notes)
  - Building Code Professional documents
  - Document templates (NTBO, PCA, DAR, etc.)
- Safe handling of **large files (100MB+ videos)**
- Strict, simple RLS boundaries
- Flexible for future automation and AI enrichment
- Stable audit trail using `user_profiles.id` (never deleted, only deactivated)

---

# **2. Architecture Overview**

Three-layer model:

## **2.1 Storage layer**
Supabase Storage buckets + object paths (pure file blobs).

## **2.2 Canonical file record (`files`)**
One row per stored object containing bucket/path, size, metadata, status.

## **2.3 Domain context tables**
Associate files to business meaning:
- plan_sets__files
- project_files
- inspection_sessions__project_files
- professional_licenses
- fccpro_config
- document_templates

Storage never embeds business rules.
Domain tables never embed bucket or path details.

---

# **3. Storage Layout**

## **3.1 Buckets**

Use a minimal set:

- `project-files` — plan sets, project docs, gallery/daily log files
- `inspection-files` — inspection media + inspection logs
- `templates` — NTBO / PCA / DAR / PP documents / letters / reports
- `user-assets` — BCP signatures, photos, resumes

## **3.2 Path Conventions (Consistent, Deterministic)**

### **Plan sets**
```

project-files/projects/{project_id}/plan-sets/{plan_set_id}/{file_type_code}/{file_id}_{original_filename}

```
### **Project files / gallery**
```

project-files/projects/{project_id}/files/{project_file_id}/{file_id}_{original_filename}

```
### **Inspection sessions**
```

inspection-files/projects/{project_id}/sessions/{inspection_session_id}/{media_type_code}/{file_id}_{original_filename}

```
### **Document templates**
```

templates/{template_category}/{template_code}/v{version}/{file_id}_{original_filename}

```
### **BCP assets**
```

user-assets/bcp/{fccpro_config_id}/{file_type_code}/{file_id}_{original_filename}

```
All paths built by a shared backend utility.

---

# **4. Core Table: `files`**

Canonical representation of any stored blob.

### **Columns**
- `id` uuid (use `uuid_generate_v7()`)
- `filename` text (original client name)
- `mime_type` text
- `size_bytes` bigint
- `bucket` text
- `object_key` text
- `metadata` jsonb
  (page_count, AI summary, EXIF, text hash, detected disciplines, etc.)
- `status` text/enum
  (`UPLOADING`, `READY`, `FAILED`)
- `created_at`, `created_by` (user_profiles.id)
- `updated_at`, `updated_by` (user_profiles.id)
- `deleted_at`, `deleted_by` (user_profiles.id)

### **Rules**
- One `files` row per object in storage
- Domain tables attach meaning via FKs
- Soft delete only
- Normal queries: `WHERE deleted_at IS NULL`

---

# **5. Plan Sets**

## **5.1 plan_sets**

### **Plan set type (enum)**
Replace the lookup table — use enum:
- `QUOTE`
- `INITIAL`
- `REVISION`

### **Fields**
- `id` uuid
- `project_id` uuid
- `type` plan_set_type enum (QUOTE / INITIAL / REVISION)
- `document_review_status_id` → `plan_sets_document_review_field`
- `submit_count` integer DEFAULT 1
- `created_at`, `created_by` (user_profiles.id)
- `updated_at`, `updated_by` (user_profiles.id)

### **Meaning**
- **QUOTE:** plan set uploaded solely for quoting scope.
  - Never usable as working plan set
  - Used to generate FIRST real INITIAL plan set
- **INITIAL:** first permit-ready plan set
- **REVISION:** created when plan review fails; client performs revision workflow

## **5.2 Working plan set pointer**
Use Option A:
```

projects.current_plan_set_id → plan_sets.id

```
- Only `INITIAL` or `REVISION` should be assigned
- QUOTE is never current
- Ops UI can manually reassign for rollback

## **5.3 Locking Rules**

Client can CRUD plan set files when status is:

- `Draft`
- `New Submission`
- `Modified – Requires Review`

Client locked when:

- `In Review`
- `Incomplete`
- `Complete`
- `Complete for Quoting`
- Any future “Approved” equivalents

QUOTE sets follow the same rules.

**Failing plan review:**
- Generate new plan set with `type = REVISION`
- Client does revision workflow (keep, replace, remove, add)

---

# **6. Plan Set File Types & Groups**

## **6.1 plan_sets_file_types**

Examples:

### Client input
- `CONST_PLANS`
- `NOA`
- `TRUSS_DOCS`
- `ENERGY_LOAD`
- `ZONING_DOCS`
- `OTHER_DOCS`

### Stamped plan docs
- `STAMPED_CONST_PLANS`
- `STAMPED_TRUSS_DOCS`
- etc.

### Provider docs
- `NTBO`
- `PLAN_COMPLIANCE_AFFIDAVIT`
- `DULY_AUTH_REP`
- `JOB_SITE_ID`
- `PP_PACKET`
- (More as needed)

## **6.2 plan_file_type_groups**

Grouping table:

- `id` uuid
- `code` text UNIQUE
  - `CLIENT_PLAN_INPUT`
  - `STAMPED_PLAN`
  - `PROVIDER_PROJECT_DOC`
- `name` text
- `sort_order`
- `created_at`, `updated_at`

Each `plan_sets_file_types` row gets a `group_id`.

---

# **7. plan_sets__files (Versioning)**

Link table between plan sets and files.

### **Columns**
- `id` uuid
- `plan_set_id`
- `file_id`
- `file_type_id`
- `version` integer
- `previous_version_file_id` (file_id)
- `source_plan_set_file_id` (links stamped file back to original)
- `file_summary` text
- `number_of_pages` integer
- `signer` text
- `is_latest` boolean DEFAULT true
- `created_at`, `created_by`
- `deleted_at`, `deleted_by`

### **Rules**
- For any `(plan_set_id, file_type_id)` pair:
  - New upload increments version
  - Previous version’s `is_latest` = false

### **Stamped plans**
- New file + new plan_sets__files row
- **NOT** part of the version chain for the client’s original file
- `source_plan_set_file_id` links stamped → original

---

# **8. Project-Level Files (`project_files`)**

Rename `project_media` → **project_files**

## **8.1 project_files**

Columns:

- `id` uuid
- `project_id`
- `file_id` → files
- `type_id` → project_files_type_field
- `upload_method_id`
- `coordinates` jsonb
- `location_geom` (PostGIS)
- `is_internal_only` boolean DEFAULT false
- `is_visible_to_client` boolean DEFAULT true
- `created_at`, `created_by`
- `updated_at`, `updated_by`
- `deleted_at`, `deleted_by`

## **8.2 project_files_type_field**

### Inspection-related
- `INSPECTION_PHOTO`
- `INSPECTION_VIDEO`
- `LIVE_CALL_RECORDING`
- `FORM_BOARD_SURVEY`
- `TERMITE_CERT`
- `BLOWER_DOOR_TEST`
- `ENGINEER_LETTER`
- `INSPECTION_LOG_PDF`

### Project docs
- `CLIENT_UPLOAD_DOC`
- `INTERNAL_NOTE_DOC`

### Daily log / gallery
- `CLIENT_PHOTO`
- `CLIENT_VIDEO`

## **8.3 Upload method lookup**
- `CLIENT_PWA`
- `CLIENT_NATIVE`
- `INSPECTOR_APP`
- `OPS_STAFF`
- `SYSTEM_GENERATED`

## **8.4 Daily logs & gallery**
- Daily Logs → `daily_logs__project_files`
- Gallery → filter where `is_visible_to_client = true`

---

# **9. Inspection Sessions**

## **inspection_sessions__project_files**

Junction table:

- `inspection_session_id`
- `project_file_id`
- (No versioning needed)

Notes:
- Attach any `project_files` entry to a session
- Gallery photos reused inside a session do NOT need re-upload or bucket movement
- Multiple attachments to same media are allowed

---

# **10. BCP Documents**

Existing integration:

- `professional_licenses.file_id`
- `fccpro_config.signature_file_id`
- `fccpro_config.photo_file_id`
- `fccpro_config.resume_file_id`

Storage paths under `user-assets/bcp/...`

If you later want multiple signatures/resumes, add `bcp_files`.

---

# **11. Document Templates**

## **document_templates**

Columns:

- `id` uuid
- `code` (unique)
- `name`
- `category`
- `description`
- `engine` (DOCX, HTML_PDF, MARKDOWN_PDF, etc.)
- `file_id` → files
- `version`
- `previous_version_template_id`
- `active`
- `created_at`, `created_by`
- `updated_at`, `updated_by`
- `deleted_at`, `deleted_by`

Stored under bucket `templates`.

## **Usage**
- Lookup template by code
- Render with project/plan_set/BCP data
- Save generated output to:
  - plan_sets__files (for plan-set docs)
  - project_files (for project-level docs)

---

# **12. RLS & Access Handling**

## **12.1 Access flow**

Clients:

- Query domain tables (plan_sets__files, project_files, inspection_sessions__project_files)
- Request file access via backend function

Backend/Edge:

1. Verify domain permissions via RLS
2. Read files.bucket + files.object_key
3. Generate short-lived signed URL
4. Return URL to client

## **12.2 RLS should live on**

- projects
- plan_sets
- plan_sets__files
- project_files
- inspection_sessions
- inspection_sessions__project_files
- professional_licenses
- fccpro_config
- document_templates (internal only)

**Never** expose raw file storage paths directly.

---

# **13. House Rules**

1. **Soft delete everything**
   Store `deleted_at` + `deleted_by`.

2. **No orphan files**
   Upload flow must create:
   - `files` row
   - At least one domain-linked row
   If domain insert fails → rollback.

3. **Indexes everywhere**
   - plan_sets__files(plan_set_id, file_type_id)
   - projects(current_plan_set_id)
   - project_files(project_id, type_id)
   - inspection_sessions__project_files(inspection_session_id)
   - All FK columns

4. **AI metadata**
   Use `files.metadata` for auto-extracted fields:
   - summaries
   - page_count
   - text content hash
   - detected disciplines
   - compliance flags

5. **Standard upload helpers**
   - `initPlanSetFileUpload` / `completePlanSetFileUpload`
   - `initProjectFileUpload` / `completeProjectFileUpload`
   - `initInspectionFileUpload`
   - `generateDocumentFromTemplate`

Keep helpers small; frontends thin; invariants controlled centrally.

---

# **14. Upload Strategy (Large File Safe)**

Use **direct-to-storage via signed URLs**.

### **Edge function responsibilities**
- Auth via bearer token
- Validate user against project/plan_set/inspection
- Generate `file_id` + bucket + object_key
- Insert `files` row (`status = UPLOADING`)
- Insert domain context row(s)
- Generate signed upload URL via `createSignedUploadUrl`

### **Client responsibilities**
- Use `uploadToSignedUrl` to push raw file → Storage
- Call `complete_upload` after success

This prevents edge function timeouts and supports 100MB+ uploads.

---

# **This document is production-approved.**

Ready for Cursor implementation and dev team adoption.
```

[FCC File & Media - Schema Migration Plan v1](https://www.notion.so/FCC-File-Media-Schema-Migration-Plan-v1-2b0abb008fd88033ae62c5318dd6dc9f?pvs=21)

-Schema Change Log: