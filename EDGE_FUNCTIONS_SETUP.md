# Edge Functions Setup

## Status: ✅ Deployed and Active

All edge functions have been deployed via Supabase MCP and are currently active.

## Deployed Edge Functions

### 1. monday_fetch_projects
**Status**: v3, ACTIVE  
**Function ID**: `ae82199f-3d11-4603-aa38-c17281fba33b`

Fetches all projects from the Completed Projects 2 board.

**Parameters:**
- `board_id`: Monday.com board ID (default: `18369402312`)
- `limit`: Maximum number of items to fetch (default: 500)

**Returns:**
```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "column_values": [...]
    }
  ]
}
```

**CORS**: Handled properly with preflight OPTIONS support

### 2. monday_fetch_plan_sets
**Status**: v3, ACTIVE  
**Function ID**: `5c398be5-3ae3-4ae5-bb87-65ba8065f3c5`

Fetches plan set files for a specific project from Monday.com.

**Parameters:**
- `project_id`: Monday.com project/item ID
- `plan_set_type`: Type filter (default: 'initial_submission')

**Returns:**
```json
{
  "files": [
    {
      "id": "string",
      "name": "string",
      "url": "string",
      "type": "string"
    }
  ]
}
```

**CORS**: Handled properly with preflight OPTIONS support

### 3. testlab_purge_by_run
**Status**: v6, ACTIVE  
**Function ID**: `1b13584e-4269-4ea3-852d-43c0acfd7c18`

Purges test data created during test runs. Handles cascading deletes for foreign key dependencies.

**Parameters:**
- `runIds`: Array of test run UUIDs to purge
- `reason`: Reason for purging (required)
- `actorId`: User ID performing the purge

**Features:**
- Deletes records from all tables tracked in `test_records`
- **Cascading Deletes**: Automatically deletes `plan_sets__files` and `plan_sets` before deleting `projects` to prevent foreign key constraint violations
- Priority-based deletion order (child records before parent records)
- Audit trail via `activity_log` entries
- Updates `test_runs` with purge metadata

**Delete Priority Order:**
1. Junction tables (priority 10): `services__deals`, `deals__contacts`, `companies__contacts`, etc.
2. Plan set files (priority 20): `plan_sets__files`
3. Plan sets (priority 25): `plan_sets`
4. Domain objects (priority 30-50): `deals`, `projects`, `contacts`, `companies`

**Returns:**
```json
{
  "success": true,
  "message": "Test data purged successfully.",
  "data": {
    "deletedCounts": { "projects": 2, "contacts": 3, ... },
    "totalDeleted": 15
  }
}
```

**CORS**: Handled properly with preflight OPTIONS support

## Configuration

### Secrets
The `MONDAY_API_KEY` secret has been set in Supabase and is accessible to both edge functions via `Deno.env.get('MONDAY_API_KEY')`.

### CORS Headers
Both functions include proper CORS headers:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Headers: authorization, x-client-info, apikey, content-type`

### Error Handling
- Functions return proper error responses with status codes
- Errors include descriptive messages
- All responses include CORS headers

## Usage

The frontend automatically calls these functions through the `callEdgeFunction` helper in `src/lib/supabase.ts`. No additional configuration needed.

## Testing

Both functions have been tested and are working correctly:
- ✅ CORS preflight requests handled
- ✅ Monday.com API authentication working
- ✅ Data returned in expected format
- ✅ Error handling functional

## Maintenance

To update these functions:
1. Modify the code in `edge-functions/[function-name]/index.ts`
2. Redeploy using Supabase MCP or CLI:
   ```bash
   supabase functions deploy monday_fetch_projects
   supabase functions deploy monday_fetch_plan_sets
   supabase functions deploy testlab_purge_by_run
   supabase functions deploy apply_form_submitted
   supabase functions deploy create_test_project
   ```

## Notes

- The Monday.com API key is stored as a Supabase secret, not in frontend code
- All Monday.com API calls are made server-side to avoid CORS issues
- Functions handle both successful responses and errors gracefully
- `testlab_purge_by_run` uses service role key to bypass RLS for deletion operations
- Cascading deletes ensure foreign key constraints are respected during purge

