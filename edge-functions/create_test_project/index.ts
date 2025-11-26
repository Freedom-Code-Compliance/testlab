import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  run_id: string;
  project_data: {
    name: string;
    company_id: string;
    contact_id: string;
    building_department_id: string;
    project_type_id: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    zipcode: string;
    scope_of_work?: string;
    needs_quote: boolean;
  };
  service_ids?: string[];
  files?: Record<string, string[]>;
  mode?: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const {
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
    } = Deno.env.toObject();

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase environment variables');
    }

    const body: RequestBody = await req.json();
    const { run_id, project_data, service_ids } = body;

    // Validate required fields
    if (!run_id || !project_data) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields: run_id and project_data' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate project_data required fields
    const requiredFields = ['name', 'company_id', 'contact_id', 'building_department_id', 'project_type_id', 'address_line1', 'city', 'state', 'zipcode'];
    for (const field of requiredFields) {
      if (!project_data[field as keyof typeof project_data]) {
        return new Response(
          JSON.stringify({ success: false, error: `Missing required field: ${field}` }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Fetch test run to get scenario_id and run_by
    const testRunResponse = await fetch(`${SUPABASE_URL}/rest/v1/test_runs?id=eq.${run_id}&select=scenario_id,run_by`, {
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    });

    if (!testRunResponse.ok) {
      throw new Error('Failed to fetch test run');
    }

    const testRuns = await testRunResponse.json();
    if (!testRuns || testRuns.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Test run not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { scenario_id, run_by } = testRuns[0];

    // Derive classification fields from project_type_id
    const projectTypeResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/project_types?id=eq.${project_data.project_type_id}&select=id,construction_type_id&deleted_at=is.null`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    );

    if (!projectTypeResponse.ok) {
      throw new Error('Failed to fetch project type');
    }

    const projectTypes = await projectTypeResponse.json();
    if (!projectTypes || projectTypes.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Project type not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const construction_type_id = projectTypes[0].construction_type_id;
    if (!construction_type_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Project type missing construction_type_id' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get occupancy_id from construction_type
    const constructionTypeResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/construction_types?id=eq.${construction_type_id}&select=id,occupancy_id&deleted_at=is.null`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    );

    if (!constructionTypeResponse.ok) {
      throw new Error('Failed to fetch construction type');
    }

    const constructionTypes = await constructionTypeResponse.json();
    if (!constructionTypes || constructionTypes.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Construction type not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const occupancy_id = constructionTypes[0].occupancy_id;

    // Set defaults
    const phase_id = '019a79be-2a8a-7a89-cbb2-a2a62da11dfa'; // Draft phase
    const has_legal_address = true;
    const deleted = false;

    // Map state code to full state name for enum
    const stateCode = project_data.state; // e.g. "FL"

    // USPS → Enum literal mapping
    const stateMap: Record<string, string> = {
      AL: "Alabama",
      AK: "Alaska",
      AZ: "Arizona",
      AR: "Arkansas",
      CA: "California",
      CO: "Colorado",
      CT: "Connecticut",
      DE: "Delaware",
      FL: "Florida",
      GA: "Georgia",
      HI: "Hawaii",
      ID: "Idaho",
      IL: "Illinois",
      IN: "Indiana",
      IA: "Iowa",
      KS: "Kansas",
      KY: "Kentucky",
      LA: "Louisiana",
      ME: "Maine",
      MD: "Maryland",
      MA: "Massachusetts",
      MI: "Michigan",
      MN: "Minnesota",
      MS: "Mississippi",
      MO: "Missouri",
      MT: "Montana",
      NE: "Nebraska",
      NV: "Nevada",
      NH: "New Hampshire",
      NJ: "New Jersey",
      NM: "New Mexico",
      NY: "New York",
      NC: "North Carolina",
      ND: "North Dakota",
      OH: "Ohio",
      OK: "Oklahoma",
      OR: "Oregon",
      PA: "Pennsylvania",
      RI: "Rhode Island",
      SC: "South Carolina",
      SD: "South Dakota",
      TN: "Tennessee",
      TX: "Texas",
      UT: "Utah",
      VT: "Vermont",
      VA: "Virginia",
      WA: "Washington",
      WV: "West Virginia",
      WI: "Wisconsin",
      WY: "Wyoming",
    };

    const stateEnum = stateMap[stateCode];
    if (!stateEnum) {
      return new Response(
        JSON.stringify({ success: false, error: `Unsupported state code: ${stateCode}` }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Prepare project insert data
    const projectInsert = {
      name: project_data.name,
      company_id: project_data.company_id,
      submitted_by_id: project_data.contact_id, // Map contact_id to submitted_by_id
      building_department_id: project_data.building_department_id,
      project_type_id: project_data.project_type_id,
      construction_type_id: construction_type_id,
      occupancy_id: occupancy_id,
      phase_id: phase_id,
      address_line1: project_data.address_line1,
      address_line2: project_data.address_line2 || null,
      city: project_data.city,
      state: stateEnum, // Use mapped full state name
      zipcode: project_data.zipcode,
      scope_of_work: project_data.scope_of_work || null,
      needs_quote: project_data.needs_quote || false,
      has_legal_address: has_legal_address,
      deleted: deleted,
    };

    // Insert project
    const insertResponse = await fetch(`${SUPABASE_URL}/rest/v1/projects`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(projectInsert),
    });

    if (!insertResponse.ok) {
      const errorText = await insertResponse.text();
      throw new Error(`Failed to insert project: ${errorText}`);
    }

    const insertedProjects = await insertResponse.json();
    const project_id = insertedProjects[0].id;

    // Log test record for project
    const logProjectResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/testlab_log_record`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        p_run_id: run_id,
        p_scenario_id: scenario_id,
        p_table_name: 'projects',
        p_record_id: project_id,
        p_created_by: run_by,
        p_table_id: null,
      }),
    });

    if (!logProjectResponse.ok) {
      console.error('Failed to log project test record');
    }

    // Create service junctions if service_ids provided
    const serviceJunctionIds: string[] = [];
    let servicesLinked = false;
    let servicesError: string | null = null;

    // Validate service_ids is an array if provided
    if (service_ids !== undefined && service_ids !== null) {
      if (!Array.isArray(service_ids)) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'service_ids must be an array' 
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      if (service_ids.length > 0) {
        // Validate that all service_ids exist in the services table
        // PostgREST in.() operator expects comma-separated values
        const serviceIdsString = service_ids.join(',');
        const validateServicesResponse = await fetch(
          `${SUPABASE_URL}/rest/v1/services?id=in.(${serviceIdsString})&select=id&deleted_at=is.null`,
          {
            headers: {
              'apikey': SUPABASE_SERVICE_ROLE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            },
          }
        );

        if (!validateServicesResponse.ok) {
          const errorText = await validateServicesResponse.text();
          throw new Error(`Failed to validate services: ${errorText}`);
        }

        const validServices = await validateServicesResponse.json();
        const validServiceIds = validServices.map((s: { id: string }) => s.id);
        const invalidServiceIds = service_ids.filter(id => !validServiceIds.includes(id));

        if (invalidServiceIds.length > 0) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: `One or more service IDs do not exist: ${invalidServiceIds.join(', ')}` 
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        // Create junction records
        const junctionRecords = service_ids.map(serviceId => ({
          project_id: project_id,
          service_id: serviceId,
        }));

        const junctionResponse = await fetch(`${SUPABASE_URL}/rest/v1/projects__services`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
          },
          body: JSON.stringify(junctionRecords),
        });

        if (!junctionResponse.ok) {
          const errorText = await junctionResponse.text();
          const errorMessage = `Failed to insert service junctions: ${errorText}`;
          console.error(errorMessage);
          // Store error but don't fail the entire request - return warning in response
          servicesError = errorMessage;
        } else {
          const insertedJunctions = await junctionResponse.json();
          servicesLinked = true;
          
          // Log each service junction
          for (const junction of insertedJunctions) {
            serviceJunctionIds.push(junction.id);
            
            const logJunctionResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/testlab_log_record`, {
              method: 'POST',
              headers: {
                'apikey': SUPABASE_SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                p_run_id: run_id,
                p_scenario_id: scenario_id,
                p_table_name: 'projects__services',
                p_record_id: junction.id,
                p_created_by: run_by,
                p_table_id: null,
              }),
            });

            if (!logJunctionResponse.ok) {
              console.error(`Failed to log service junction test record for ${junction.id}`);
            }
          }
        }
      }
    }

    // Return success response
    const response: any = {
      success: true,
      message: 'Project created successfully',
      project_id: project_id,
      run_id: run_id,
      scenario_id: scenario_id,
      data: {
        project_id: project_id,
        run_id: run_id,
        scenario_id: scenario_id,
      },
    };

    // Include service linking information in response
    if (service_ids && service_ids.length > 0) {
      response.services = {
        requested: service_ids.length,
        linked: serviceJunctionIds.length,
        linked_ids: serviceJunctionIds,
        success: servicesLinked,
        error: servicesError,
      };

      // If services were requested but failed to link, add warning to message
      if (!servicesLinked && servicesError) {
        response.message = `Project created successfully, but services failed to link: ${servicesError}`;
        response.warning = servicesError;
      }
    }

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in create_test_project:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

