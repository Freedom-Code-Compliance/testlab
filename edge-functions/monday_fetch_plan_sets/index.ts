import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const MONDAY_API_KEY = Deno.env.get('MONDAY_API_KEY') || '';
const PLAN_SETS_BOARD = '5307810845';

Deno.serve(async (req) => {
  try {
    const { project_id, plan_set_type = 'initial_submission' } = await req.json();

    if (!MONDAY_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Monday API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Call Monday.com API to fetch plan sets
    const response = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': MONDAY_API_KEY,
      },
      body: JSON.stringify({
        query: `
          query {
            boards(ids: [${PLAN_SETS_BOARD}]) {
              items_page(limit: 100) {
                items {
                  id
                  name
                  column_values {
                    id
                    text
                    value
                    type
                  }
                  assets {
                    id
                    name
                    url
                    file_extension
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
    
    // Filter by Initial Submission and link to project
    const filtered = items.filter((item: any) => {
      const planSetType = item.column_values.find((cv: any) => 
        cv.text?.toLowerCase().includes('initial submission') || 
        cv.text?.toLowerCase().includes('type')
      );
      const linkedProject = item.column_values.find((cv: any) => 
        cv.value?.includes(project_id) || cv.text?.includes(project_id)
      );
      return planSetType?.text?.toLowerCase().includes('initial') && linkedProject;
    });

    // Extract files from assets
    const files: any[] = [];
    filtered.forEach((item: any) => {
      if (item.assets) {
        item.assets.forEach((asset: any) => {
          files.push({
            id: asset.id,
            name: asset.name,
            url: asset.url,
            type: asset.file_extension || 'unknown',
          });
        });
      }
    });

    return new Response(
      JSON.stringify({ files }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

