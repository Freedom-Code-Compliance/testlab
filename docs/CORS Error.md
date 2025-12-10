# CORS Error Fix – `init_upload` / `complete_upload`

## What Happened
- Browser requests to `https://wljgdyxeixbjruezrptj.supabase.co/functions/v1/init_upload` completed with HTTP 200 (confirmed in Supabase logs) but the response lacked `Access-Control-Allow-*` headers.
- Without those headers the browser treats the response as a CORS violation and blocks access even though the function succeeded.
- This affects both localhost and production origins because CORS is enforced by the browser, not Supabase.

## Required Changes
Add a shared CORS helper to the edge functions and use it for **every** response (OPTIONS, success, error).

```ts
// Shared headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

function jsonResponse(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });
}

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return jsonResponse({}, 200);
  }

  if (req.method !== "POST") {
    return jsonResponse({ success: false, error: "Method not allowed" }, 405);
  }

  try {
    // … existing logic …
    return jsonResponse({ success: true, /* payload */ });
  } catch (err) {
    return jsonResponse(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      500,
    );
  }
});
```

### Apply This To
- `init_upload` (plan set / project / inspection uploads)
- `complete_upload` (flips `files.status` to `READY`)
- Any future upload-related functions

## Deployment Checklist
1. Update the edge function source with the helper above.
2. Ensure all responses (success & error) use `jsonResponse`.
3. Redeploy via Supabase CLI or the Edge Functions dashboard.
4. Test from localhost with the browser dev tools **Network** tab:
   - OPTIONS → 200 with `Access-Control-Allow-Origin: *`
   - POST → 200 with the same headers
5. Verify uploads succeed without console CORS errors.

## Notes
- localhost origins are allowed once CORS headers are present.
- `supabase.functions.invoke()` automatically forwards the logged-in user’s JWT, so no extra headers are required on the client side.
- If you ever restrict origins, list them in `Access-Control-Allow-Origin` instead of `*`.

