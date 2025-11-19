# FCC File & Media - Schema Migration Plan v1

```
> Goal: bring the existing Supabase schema in line with the **FCC File & Media Architecture v1** so that new edge functions can safely reference the right tables/fields and we can start wiring uploads tonight.

This doc is organized as **phased SQL** you can run as migrations.
Order matters; follow it top-down.

---

## Phase 0 – Notes & Assumptions

- All `*_by` fields will use **`user_profiles.id`**.
- Existing tables you already have:
  - `files`
  - `plan_sets`, `plan_sets__files`, `plan_sets_file_types`, `plan_sets_type_field`
  - `projects`
  - `project_media`, `project_media_upload_method_field`, `inspection_sessions__project_media`
  - `user_profiles`
  - `fccpro_config`, `professional_licenses`, `inspection_sessions`, etc.
- File/domain tables are **not heavily used yet**, so we’re safe to do renames that would normally be more disruptive.

---

## Phase 1 – Core `files` table alignment

Current `files`:

- `file_type` (text)
- `size_bytes`, `bucket`, `object_key`, `url`, `metadata`
- `created_at`, `updated_at`, `created_by`, `updated_by`, `deleted_at`

Architecture expects:

- `mime_type` instead of `file_type`
- `status` column
- `deleted_by` column
- `created_by` / `updated_by` / `deleted_by` = `user_profiles.id`

### 1.1 Rename `file_type` → `mime_type`

If nothing else is relying on `file_type` (true today for FCC), just rename:

```sql
ALTER TABLE public.files
  RENAME COLUMN file_type TO mime_type;
```

### **1.2 Add**

### **status**

### **and**

### **deleted_by**

```
ALTER TABLE public.files
  ADD COLUMN status text NOT NULL DEFAULT 'READY',
  ADD COLUMN deleted_by uuid NULL;

ALTER TABLE public.files
  ADD CONSTRAINT files_deleted_by_fkey
    FOREIGN KEY (deleted_by) REFERENCES public.user_profiles(id) ON DELETE SET NULL;

ALTER TABLE public.files
  ADD CONSTRAINT files_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES public.user_profiles(id) ON DELETE SET NULL;

ALTER TABLE public.files
  ADD CONSTRAINT files_updated_by_fkey
    FOREIGN KEY (updated_by) REFERENCES public.user_profiles(id) ON DELETE SET NULL;
```

> After this: your files table matches the architecture and your new edge function can safely write mime_type, status, and *_by.
> 

---

## **Phase 2 – Plan sets: type enum + working set pointer**

Current plan_sets columns:

- project_id
- document_review_status_id
- type_id → plan_sets_type_field
- working_set_id (lookup via plan_sets_working_set_field)
- created_at, updated_at, created_by, updated_by, deleted_at

### **2.1 Add the**

### **plan_set_type**

### **enum &**

### **type**

### **column**

```
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'plan_set_type') THEN
    CREATE TYPE plan_set_type AS ENUM ('QUOTE', 'INITIAL', 'REVISION');
  END IF;
END$$;

ALTER TABLE public.plan_sets
  ADD COLUMN type plan_set_type;
```

You can backfill from plan_sets_type_field later if you want; for **new code**, use the type column going forward.

### **2.2 Add**

### **current_plan_set_id**

### **to**

### **projects**

```
ALTER TABLE public.projects
  ADD COLUMN current_plan_set_id uuid NULL;

ALTER TABLE public.projects
  ADD CONSTRAINT projects_current_plan_set_id_fkey
    FOREIGN KEY (current_plan_set_id) REFERENCES public.plan_sets(id) ON DELETE SET NULL;
```

> Behavior rule: current_plan_set_id should only ever point to a plan set where type IN ('INITIAL','REVISION'), never QUOTE.
> 

### **2.3 (Optional) Mark legacy columns as deprecated**

No SQL needed now, but team convention:

- plan_sets.type_id and plan_sets.working_set_id are legacy.
- New code **only** uses:
    - plan_sets.type
    - projects.current_plan_set_id

You can drop the legacy columns once everything is migrated.

---

## **Phase 3 – Plan set file type groups**

Current plan_sets_file_types:

- id, code, name, active
- created_at, updated_at, deleted_at

You want a grouping table plus a group_id FK.

### **3.1 Create**

### **plan_file_type_groups**

```
CREATE TABLE IF NOT EXISTS public.plan_file_type_groups (
  id uuid PRIMARY KEY DEFAULT uuid_v7(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz NULL
);
```

### **3.2 Add**

### **group_id**

### **to**

### **plan_sets_file_types**

```
ALTER TABLE public.plan_sets_file_types
  ADD COLUMN group_id uuid NULL;

ALTER TABLE public.plan_sets_file_types
  ADD CONSTRAINT plan_sets_file_types_group_id_fkey
    FOREIGN KEY (group_id) REFERENCES public.plan_file_type_groups(id) ON DELETE SET NULL;
```

You can seed initial groups later:

- CLIENT_PLAN_INPUT
- STAMPED_PLAN
- PROVIDER_PROJECT_DOC

---

## **Phase 4 – Plan set file versioning enhancements**

Current plan_sets__files:

- file_summary text
- number_of_pages text
- signer text
- file_id, plan_set_id, previous_version_file_id
- version text DEFAULT ‘1’
- deleted_at, created_by, updated_by
- file_type_id

You want:

- number_of_pages integer
- version integer
- is_latest boolean
- source_plan_set_file_id (for stamped → original)
- deleted_by

### **4.1 Convert**

### **number_of_pages**

### **to integer**

```
ALTER TABLE public.plan_sets__files
  ALTER COLUMN number_of_pages TYPE integer
  USING NULLIF(number_of_pages, '')::integer;
```

### **4.2 Convert**

### **version**

### **to integer**

```
ALTER TABLE public.plan_sets__files
  ALTER COLUMN version TYPE integer
  USING NULLIF(version, '')::integer;
```

### **4.3 Add**

### **is_latest**

### **,**

### **source_plan_set_file_id**

### **,**

### **deleted_by**

```
ALTER TABLE public.plan_sets__files
  ADD COLUMN is_latest boolean NOT NULL DEFAULT true,
  ADD COLUMN source_plan_set_file_id uuid NULL,
  ADD COLUMN deleted_by uuid NULL;

ALTER TABLE public.plan_sets__files
  ADD CONSTRAINT plan_sets_files_source_plan_set_file_id_fkey
    FOREIGN KEY (source_plan_set_file_id) REFERENCES public.plan_sets__files(id) ON DELETE SET NULL;

ALTER TABLE public.plan_sets__files
  ADD CONSTRAINT plan_sets_files_deleted_by_fkey
    FOREIGN KEY (deleted_by) REFERENCES public.user_profiles(id) ON DELETE SET NULL;

ALTER TABLE public.plan_sets__files
  ADD CONSTRAINT plan_sets_files_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES public.user_profiles(id) ON DELETE SET NULL;

ALTER TABLE public.plan_sets__files
  ADD CONSTRAINT plan_sets_files_updated_by_fkey
    FOREIGN KEY (updated_by) REFERENCES public.user_profiles(id) ON DELETE SET NULL;
```

> Now you can enforce “one latest version per (plan_set_id, file_type_id)” via code or an index later if you want.
> 

---

## **Phase 5 – Project media → project_files refactor**

Current:

- project_media
- project_media_upload_method_field
- inspection_sessions__project_media

### **5.1 Rename tables and columns**

```
-- 1) Rename main table
ALTER TABLE public.project_media
  RENAME TO project_files;

-- 2) Rename upload method lookup
ALTER TABLE public.project_media_upload_method_field
  RENAME TO project_files_upload_method_field;

-- 3) Rename junction table + FK column
ALTER TABLE public.inspection_sessions__project_media
  RENAME COLUMN project_media_id TO project_file_id;

ALTER TABLE public.inspection_sessions__project_media
  RENAME TO inspection_sessions__project_files;
```

### **5.2 Add**

### **type_id**

### **, visibility flags, deleted_by**

```
-- Create type lookup
CREATE TABLE IF NOT EXISTS public.project_files_type_field (
  id uuid PRIMARY KEY DEFAULT uuid_v7(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  active bool NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz NULL
);

-- Add columns to project_files
ALTER TABLE public.project_files
  ADD COLUMN type_id uuid NULL,
  ADD COLUMN is_internal_only boolean NOT NULL DEFAULT false,
  ADD COLUMN is_visible_to_client boolean NOT NULL DEFAULT true,
  ADD COLUMN deleted_by uuid NULL;

ALTER TABLE public.project_files
  ADD CONSTRAINT project_files_type_id_fkey
    FOREIGN KEY (type_id) REFERENCES public.project_files_type_field(id) ON DELETE SET NULL;

ALTER TABLE public.project_files
  ADD CONSTRAINT project_files_deleted_by_fkey
    FOREIGN KEY (deleted_by) REFERENCES public.user_profiles(id) ON DELETE SET NULL;

ALTER TABLE public.project_files
  ADD CONSTRAINT project_files_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES public.user_profiles(id) ON DELETE SET NULL;

ALTER TABLE public.project_files
  ADD CONSTRAINT project_files_updated_by_fkey
    FOREIGN KEY (updated_by) REFERENCES public.user_profiles(id) ON DELETE SET NULL;
```

> folder_path and coordinates / location_geom remain as-is; they fit the architecture just fine.
> 

---

## **Phase 6 – Inspection junction alignment**

Current inspection_sessions__project_files (after rename):

- inspection_session_id
- project_file_id
- created_at, updated_at
- version, preview_version_file_id
- deleted_at, created_by, updated_by

You decided you **don’t need versioning** on inspection files. You can either:

- Ignore version / preview_version_file_id in code, or
- Remove them in a later migration.

For now, no schema change is strictly required for the edge function to work, so we can leave this alone.

---

## **Phase 7 – Document templates table**

You don’t currently have document_templates. Create it fresh.

```
CREATE TABLE IF NOT EXISTS public.document_templates (
  id uuid PRIMARY KEY DEFAULT uuid_v7(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  description text NULL,
  engine text NOT NULL, -- e.g. 'DOCX', 'HTML_PDF', 'MARKDOWN_PDF'
  file_id uuid NOT NULL REFERENCES public.files(id) ON DELETE RESTRICT,
  version integer NOT NULL DEFAULT 1,
  previous_version_template_id uuid NULL REFERENCES public.document_templates(id) ON DELETE SET NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NULL REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid NULL REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  deleted_at timestamptz NULL,
  deleted_by uuid NULL REFERENCES public.user_profiles(id) ON DELETE SET NULL
);
```

---

## **Phase 8 – Indexes that matter**

Critical indexes to support the architecture and edge functions:

```
-- Plan set file lookups
CREATE INDEX IF NOT EXISTS idx_plan_sets_files_plan_set_id
  ON public.plan_sets__files (plan_set_id);

CREATE INDEX IF NOT EXISTS idx_plan_sets_files_plan_set_id_file_type_id
  ON public.plan_sets__files (plan_set_id, file_type_id)
  WHERE deleted_at IS NULL;

-- Projects current working set
CREATE INDEX IF NOT EXISTS idx_projects_current_plan_set_id
  ON public.projects (current_plan_set_id);

-- Project files by project and type
CREATE INDEX IF NOT EXISTS idx_project_files_project_id
  ON public.project_files (project_id)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_project_files_project_id_type_id
  ON public.project_files (project_id, type_id)
  WHERE deleted_at IS NULL;

-- Inspection session file junction
CREATE INDEX IF NOT EXISTS idx_inspection_sessions_project_files_inspection_session_id
  ON public.inspection_sessions__project_files (inspection_session_id)
  WHERE deleted_at IS NULL;
```

---

## **Phase 9 – Summary & Next Step**

After you run these migrations:

- files is aligned with mime_type, status, and deleted_by.
- Plan sets have:
    - type enum (QUOTE, INITIAL, REVISION)
    - projects.current_plan_set_id ready for working set logic.
- Plan-set file versioning has:
    - integer version
    - integer number_of_pages
    - is_latest
    - source_plan_set_file_id
- project_media has been fully converted to project_files with type_id, visibility flags, and deleted_by.
- inspection_sessions__project_files is ready to simply link existing project files into inspection sessions.
- document_templates is available for template-driven document generation.
- All relevant audit fields can cleanly point to user_profiles.id.

**Next step after this schema work:**

We define and implement the init_upload edge function that:

- Authenticates via Authorization: Bearer
- Writes into files + either plan_sets__files or project_files
- Returns signed upload URLs against:
    - project-files
    - inspection-files
    - templates
    - user-assets

When you’re ready, I’ll generate the full init_upload edge function (and its variants for plan set vs project vs inspection) to match this schema exactly.

```

```