<!-- c3d2f7d5-2c7c-4530-a3fa-85408dd2203f 18c54d16-e27a-461f-80c5-8d7f6a8af2b4 -->
# Integrate init-upload and confirm-upload Edge Functions

## Current Issues

1. **Function Name Mismatches:**

   - Code calls `init_upload` but edge function is `init-upload` (hyphen)
   - Code calls `complete_upload` but edge function is `confirm-upload` (different name)

2. **Response Structure Mismatch:**

   - `init-upload` returns: `{ file_id, domain_id, signed_upload_token, bucket, object_key, filename, expires_at, status, upload_method, message }`
   - Code expects: `{ success, file: { id }, upload: { bucket, object_key, signed_upload_token } }`

3. **Missing Parameters:**

   - `confirm-upload` requires `{ file_id, success: boolean, error_message?: string }`
   - Current `callCompleteUpload` only sends `{ file_id }` without `success: true`

4. **Request Payload Mismatch:**

   - `init-upload` expects: `{ kind, filename, plan_set_id, file_type_code, project_id }`
   - Code sends: `{ kind, filename, mime_type, size_bytes, plan_set: { ... } }`

## Implementation Plan

### 1. Update `src/lib/supabase.ts`

   - Fix `callInitUpload` to call `init-upload` (hyphenated)
   - Update payload structure to match edge function expectations
   - Fix response handling to match actual edge function response
   - Update `callCompleteUpload` to:
     - Call `confirm-upload` (not `complete-upload`)
     - Send `{ file_id, success: boolean, error_message?: string }`
     - Handle both success and failure cases

### 2. Update `src/components/testing/PlanSetFileCard.tsx`

   - Fix response handling to match actual `init-upload` response structure
   - Update to use correct field names from response
   - Ensure `confirm-upload` is called with `success: true` on successful upload
   - Ensure `confirm-upload` is called with `success: false` on upload failure
   - Add proper error handling for edge function calls

### 3. Update Other Upload Components (if any)

   - Check `ManualProjectForm.tsx` and other components using file uploads
   - Update to use the new upload flow if needed

## Key Changes

**init-upload Request:**

```typescript
{
  kind: 'PLAN_SET_FILE',
  filename: string,
  plan_set_id: string,
  file_type_code: string,
  project_id?: string  // optional, will be fetched if not provided
}
```

**init-upload Response:**

```typescript
{
  file_id: string,
  domain_id: string,
  signed_upload_token: string,
  bucket: string,
  object_key: string,
  filename: string,
  expires_at: string,
  status: 'PENDING',
  upload_method: 'uploadToSignedUrl',
  message: string
}
```

**confirm-upload Request:**

```typescript
{
  file_id: string,
  success: boolean,
  error_message?: string
}
```

## Files to Modify

1. `src/lib/supabase.ts` - Fix function names and payloads
2. `src/components/testing/PlanSetFileCard.tsx` - Fix response handling and confirm-upload calls
3. Check other components using file uploads for consistency

### To-dos

- [ ] Update callInitUpload and callCompleteUpload in supabase.ts to match edge function names and payloads
- [ ] Update PlanSetFileCard.tsx to handle correct response structure and call confirm-upload properly
- [ ] Review and update other components using file uploads (ManualProjectForm, etc.)
- [ ] Test the complete upload flow: init-upload → uploadToSignedUrl → confirm-upload