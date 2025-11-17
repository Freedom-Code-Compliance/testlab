import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const MONDAY_API_KEY = Deno.env.get('MONDAY_API_KEY') || '';

Deno.serve(async (req) => {
  try {
    const { board_id, limit = 500 } = await req.json();

    if (!MONDAY_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Monday API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Call Monday.com API
    const response = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': MONDAY_API_KEY,
      },
      body: JSON.stringify({
        query: `
          query {
            boards(ids: [${board_id}]) {
              items_page(limit: ${limit}) {
                items {
                  id
                  name
                  column_values {
                    id
                    text
                    value
                    type
                  }
                }
              }
            }
          }
        `,
      }),
    });

    const data = await response.json();

    if (data.errors) {
      return new Response(
        JSON.stringify({ error: data.errors[0].message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const items = data.data.boards[0]?.items_page?.items || [];

    return new Response(
      JSON.stringify({ items }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});



