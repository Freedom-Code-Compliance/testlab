# Plan Set File Upload Payload Comparison: master vs josh-consolidation

## Summary

The plan set file upload is broken in `josh-consolidation` because the payload structure sent to `init-upload` does not match what the edge function expects (which works in `master`). The current branch uses a nested `plan_set` object structure, while `master` uses a flat structure with top-level fields.

---

## 1. Payload Construction for `init-upload`

### MASTER Branch (`PlanSetFileCard.tsx` lines 86-92)

```typescript
const initResponse = await callInitUpload({
  kind: 'PLAN_SET_FILE',
  filename: file.name,
  plan_set_id: planSetId,
  file_type_code: fileType.code,
  project_id: projectId,
});
```

**Structure:**
- Flat structure with top-level fields
- `kind`: 'PLAN_SET_FILE'
- `filename`: file.name
- `plan_set_id`: planSetId (UUID)
- `file_type_code`: fileType.code
- `project_id`: projectId
- **Missing:** `mime_type`, `size_bytes` (not sent in master)

### CURRENT Branch (`josh-consolidation` - `PlanSetFileCard.tsx` lines 90-102)

```typescript
const initResponse = await callInitUpload({
  kind: 'PLAN_SET_FILE',
  filename: file.name,
  mime_type: file.type || 'application/octet-stream',
  size_bytes: file.size,
  run_id: runId,
  scenario_id: scenarioId,
  plan_set: {
    project_id: projectId,
    plan_set_id: planSetId,
    file_type_code: fileType.code,
  },
});
```

**Structure:**
- Nested structure with `plan_set` object
- `kind`: 'PLAN_SET_FILE'
- `filename`: file.name
- `mime_type`: file.type (added)
- `size_bytes`: file.size (added)
- `run_id`: runId (TestLab addition)
- `scenario_id`: scenarioId (TestLab addition)
- `plan_set`: { project_id, plan_set_id, file_type_code } (nested object)

---

## 2. Function Signature for `callInitUpload`

### MASTER Branch (`supabase.ts` lines 53-61)

```typescript
export async function callInitUpload(payload: {
  kind: 'PLAN_SET_FILE' | 'PROJECT_FILE' | 'INSPECTION_FILE';
  filename: string;
  plan_set_id?: string;
  file_type_code?: string;
  project_id?: string;
  inspection_session_id?: string;
  media_type_code?: string;
})
```

**Structure:**
- Flat optional fields at top level
- No `mime_type` or `size_bytes` in signature
- No TestLab fields (`run_id`, `scenario_id`)
- No nested `plan_set` object

### CURRENT Branch (`josh-consolidation` - `supabase.ts` lines 53-67)

```typescript
export async function callInitUpload(payload: {
  kind: 'PLAN_SET_FILE' | 'PROJECT_FILE' | 'INSPECTION_FILE';
  filename: string;
  mime_type: string;
  size_bytes: number;
  run_id?: string; // Optional: for TestLab logging
  scenario_id?: string; // Optional: for TestLab logging
  plan_set?: {
    project_id: string;
    plan_set_id: string;
    file_type_code: string;
  };
  project_file?: any;
  inspection_file?: any;
})
```

**Structure:**
- Nested `plan_set` object
- `mime_type` and `size_bytes` required
- TestLab fields (`run_id`, `scenario_id`) added
- Nested structure for plan set context

---

## 3. Why It's Broken

The edge function in production (which works with `master`) expects a **flat payload structure** with:
- `kind: 'PLAN_SET_FILE'`
- `plan_set_id: <uuid>` (top-level)
- `file_type_code: <string>` (top-level)
- `project_id: <uuid>` (top-level)

The current branch (`josh-consolidation`) sends a **nested structure** with:
- `plan_set: { project_id, plan_set_id, file_type_code }` (nested object)

This mismatch causes the edge function to fail validation or not find the required fields, breaking file uploads.

---

## 4. How to Fix

Align `josh-consolidation` with `master` by:

1. **Change payload in `PlanSetFileCard.tsx`** to use flat structure:
   ```typescript
   const initResponse = await callInitUpload({
     kind: 'PLAN_SET_FILE',
     filename: file.name,
     plan_set_id: planSetId,
     file_type_code: fileType.code,
     project_id: projectId,
     // Add TestLab fields on top (keep these)
     run_id: runId,
     scenario_id: scenarioId,
   });
   ```

2. **Update function signature in `supabase.ts`** to match master + TestLab:
   ```typescript
   export async function callInitUpload(payload: {
     kind: 'PLAN_SET_FILE' | 'PROJECT_FILE' | 'INSPECTION_FILE';
     filename: string;
     plan_set_id?: string;  // Flat, top-level
     file_type_code?: string;  // Flat, top-level
     project_id?: string;  // Flat, top-level
     // TestLab additions (keep these)
     run_id?: string;
     scenario_id?: string;
     // Other file types...
     inspection_session_id?: string;
     media_type_code?: string;
   })
   ```

3. **Remove nested `plan_set` object** from both the payload and function signature.

4. **Keep TestLab fields** (`run_id`, `scenario_id`) as optional top-level fields.

---

## 5. Key Differences Summary

| Aspect | master | josh-consolidation (current) | josh-consolidation (fixed) |
|--------|--------|------------------------------|----------------------------|
| Structure | Flat | Nested `plan_set` object | Flat (like master) |
| `plan_set_id` | Top-level | Inside `plan_set` object | Top-level |
| `file_type_code` | Top-level | Inside `plan_set` object | Top-level |
| `project_id` | Top-level | Inside `plan_set` object | Top-level |
| `mime_type` | Not sent | Sent | Not sent (match master) |
| `size_bytes` | Not sent | Sent | Not sent (match master) |
| `run_id` | Not sent | Sent | Sent (keep TestLab) |
| `scenario_id` | Not sent | Sent | Sent (keep TestLab) |

---

## 6. Note on `mime_type` and `size_bytes`

The `master` branch does **not** send `mime_type` or `size_bytes` to `init-upload`, even though the edge function spec suggests they might be required. Since uploads work in `master`, we should match that behavior exactly. If the edge function needs these fields, it likely has defaults or derives them from the file metadata after upload.

