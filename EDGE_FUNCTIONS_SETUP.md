# Edge Functions Setup for Monday.com Integration

## Status: ✅ Deployed and Active

Both edge functions have been deployed via Supabase MCP and are currently active.

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
   ```

## Notes

- The Monday.com API key is stored as a Supabase secret, not in frontend code
- All Monday.com API calls are made server-side to avoid CORS issues
- Functions handle both successful responses and errors gracefully

