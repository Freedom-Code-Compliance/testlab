import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Validation helpers
const validateEmail = (email: string) => {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

const validatePhone = (phone: string) => {
  if (!phone || typeof phone !== "string") return false;
  const phoneRegex = /^[\d\s\-\(\)\+]+$/;
  return phone.trim().length >= 10 && phoneRegex.test(phone.trim());
};

const validateUUID = (id: string) => {
  if (!id || typeof id !== "string") return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id.trim());
};

const validateUUIDArray = (ids: any) => {
  if (!Array.isArray(ids)) return false;
  return ids.every((id) => validateUUID(id));
};

const rollbackCreatedRecords = async (supabase: any, tracker: any) => {
  console.log("[ROLLBACK] Starting rollback of created records", {
    companies: tracker.companies.length,
    contacts: tracker.contacts.length,
    deals: tracker.deals.length,
    licenses: tracker.licenses.length,
    junctions: tracker.junctions.length,
    details: tracker
  });
  let rollbackErrors: string[] = [];
  
  // Delete in reverse order of creation
  // 1. Delete junction records
  for (const junction of tracker.junctions) {
    if (junction.ids.length > 0) {
      console.log(`[ROLLBACK] Deleting ${junction.ids.length} records from ${junction.table}`);
      const { error } = await supabase.from(junction.table).delete().in("id", junction.ids);
      if (error) {
        console.error(`[ROLLBACK] Failed to delete from ${junction.table}:`, error);
        rollbackErrors.push(`${junction.table}: ${error.message}`);
      } else {
        console.log(`[ROLLBACK] Successfully deleted from ${junction.table}`);
      }
    }
  }
  
  // 2. Delete deals
  if (tracker.deals.length > 0) {
    console.log(`[ROLLBACK] Deleting ${tracker.deals.length} deal(s):`, tracker.deals);
    const { error } = await supabase.from("deals").delete().in("id", tracker.deals);
    if (error) {
      console.error("[ROLLBACK] Failed to delete deals:", error);
      rollbackErrors.push(`deals: ${error.message}`);
    } else {
      console.log("[ROLLBACK] Successfully deleted deals");
    }
  }
  
  // 3. Delete contacts
  if (tracker.contacts.length > 0) {
    console.log(`[ROLLBACK] Deleting ${tracker.contacts.length} contact(s):`, tracker.contacts);
    const { error } = await supabase.from("contacts").delete().in("id", tracker.contacts);
    if (error) {
      console.error("[ROLLBACK] Failed to delete contacts:", error);
      rollbackErrors.push(`contacts: ${error.message}`);
    } else {
      console.log("[ROLLBACK] Successfully deleted contacts");
    }
  }
  
  // 4. Delete licenses
  if (tracker.licenses.length > 0) {
    console.log(`[ROLLBACK] Deleting ${tracker.licenses.length} license(s):`, tracker.licenses);
    const { error } = await supabase.from("professional_licenses").delete().in("id", tracker.licenses);
    if (error) {
      console.error("[ROLLBACK] Failed to delete licenses:", error);
      rollbackErrors.push(`licenses: ${error.message}`);
    } else {
      console.log("[ROLLBACK] Successfully deleted licenses");
    }
  }
  
  // 5. Delete companies (last, as it may have foreign key dependencies)
  if (tracker.companies.length > 0) {
    console.log(`[ROLLBACK] Deleting ${tracker.companies.length} company/companies:`, tracker.companies);
    const { error } = await supabase.from("companies").delete().in("id", tracker.companies);
    if (error) {
      console.error("[ROLLBACK] Failed to delete companies:", error);
      rollbackErrors.push(`companies: ${error.message}`);
    } else {
      console.log("[ROLLBACK] Successfully deleted companies");
    }
  }
  
  if (rollbackErrors.length > 0) {
    console.error("[ROLLBACK] Rollback completed with errors:", rollbackErrors);
  } else {
    console.log("[ROLLBACK] Rollback completed successfully");
  }
};

// CORS headers for all responses
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-api-app-key, apiAppKey, api-app-key, x-api-key, apiKey, appapikey, app-api-key",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Max-Age": "86400"
};

// Helper function to create JSON response with CORS headers
function jsonResponse(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    }
  });
}

serve(async (req: Request) => {
  const requestId = crypto.randomUUID();
  const startTime = Date.now();
  console.log(`[${requestId}] ========== REQUEST STARTED ==========`);
  console.log(`[${requestId}] Method: ${req.method}`);
  console.log(`[${requestId}] URL: ${req.url}`);
  console.log(`[${requestId}] Origin: ${req.headers.get("origin") || "none"}`);
  console.log(`[${requestId}] Timestamp: ${new Date().toISOString()}`);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log(`[${requestId}] CORS preflight request - returning 204`);
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }
  
  // Initialize rollback tracker
  const rollbackTracker = {
    companies: [] as string[],
    contacts: [] as string[],
    deals: [] as string[],
    licenses: [] as string[],
    junctions: [] as Array<{ table: string; ids: string[] }>
  };
  
  try {
    // Validate request method
    if (req.method !== "POST") {
      return jsonResponse({
        success: false,
        error: "Method not allowed"
      }, 405);
    }
    
    // Get environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return jsonResponse({
        success: false,
        error: "Missing Supabase configuration"
      }, 500);
    }
    
    // Initialize Supabase client with service role key (bypasses RLS)
    console.log(`[${requestId}] Initializing Supabase client`);
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Parse request body
    console.log(`[${requestId}] Parsing request body`);
    const payload = await req.json();
    const { contactData, companyData, testRunId, scenarioId, runBy } = payload;
    
    console.log(`[${requestId}] Request payload summary:`, {
      hasCompanyData: !!companyData,
      hasContactData: !!contactData,
      companyName: companyData?.name,
      primaryContactEmail: contactData?.primaryContact?.email,
      additionalContactsCount: contactData?.additionalContacts?.length || 0,
      testRunId: testRunId || null,
      scenarioId: scenarioId || null
    });
    
    // Helper: log a test record if this call came from Test Lab
    const logTestRecord = async (tableName: string, recordId: string) => {
      if (!testRunId || !scenarioId) return;
      const { error } = await supabase.rpc("testlab_log_record", {
        p_run_id: testRunId,
        p_scenario_id: scenarioId,
        p_table_name: tableName,
        p_record_id: recordId,
        p_created_by: runBy ?? null,
        p_table_id: null
      });
      if (error) {
        console.error("Error logging test record", {
          tableName,
          recordId,
          error
        });
        // Do not throw – logging failure should not break the main flow
      }
    };
    
    // Validation: Check required fields
    console.log(`[${requestId}] [VALIDATION] Starting field validation`);
    if (!companyData?.name || !companyData?.address) {
      console.error(`[${requestId}] [VALIDATION] Missing required company fields:`, {
        hasName: !!companyData?.name,
        hasAddress: !!companyData?.address
      });
      return jsonResponse({
        success: false,
        error: "Missing required company fields: name and address"
      }, 400);
    }
    
    if (!contactData?.primaryContact?.firstName || !contactData?.primaryContact?.lastName || !contactData?.primaryContact?.email || !contactData?.primaryContact?.phone) {
      console.error(`[${requestId}] [VALIDATION] Missing required contact fields:`, {
        hasFirstName: !!contactData?.primaryContact?.firstName,
        hasLastName: !!contactData?.primaryContact?.lastName,
        hasEmail: !!contactData?.primaryContact?.email,
        hasPhone: !!contactData?.primaryContact?.phone
      });
      return jsonResponse({
        success: false,
        error: "Missing required contact fields"
      }, 400);
    }
    
    // Validate email format
    console.log(`[${requestId}] [VALIDATION] Validating primary contact email: ${contactData.primaryContact.email}`);
    if (!validateEmail(contactData.primaryContact.email)) {
      console.error(`[${requestId}] [VALIDATION] Invalid email format: ${contactData.primaryContact.email}`);
      return jsonResponse({
        success: false,
        error: "Invalid email format for primary contact"
      }, 400);
    }
    console.log(`[${requestId}] [VALIDATION] Email format valid`);
    
    // Validate phone format
    console.log(`[${requestId}] [VALIDATION] Validating primary contact phone`);
    if (!validatePhone(contactData.primaryContact.phone)) {
      console.error(`[${requestId}] [VALIDATION] Invalid phone format: ${contactData.primaryContact.phone}`);
      return jsonResponse({
        success: false,
        error: "Invalid phone format for primary contact. Phone must be at least 10 characters."
      }, 400);
    }
    console.log(`[${requestId}] [VALIDATION] Phone format valid`);
    
    // Validate additional contacts if present
    if (contactData.additionalContacts && Array.isArray(contactData.additionalContacts)) {
      console.log(`[${requestId}] [VALIDATION] Validating ${contactData.additionalContacts.length} additional contacts`);
      for (let i = 0; i < contactData.additionalContacts.length; i++) {
        const contact = contactData.additionalContacts[i];
        if (contact.email && !validateEmail(contact.email)) {
          console.error(`[${requestId}] [VALIDATION] Invalid email for additional contact #${i + 1}: ${contact.email}`);
          return jsonResponse({
            success: false,
            error: `Invalid email format for additional contact: ${contact.email}`
          }, 400);
        }
        if (contact.phone && !validatePhone(contact.phone)) {
          console.error(`[${requestId}] [VALIDATION] Invalid phone for additional contact #${i + 1}`);
          return jsonResponse({
            success: false,
            error: `Invalid phone format for additional contact. Phone must be at least 10 characters.`
          }, 400);
        }
      }
      console.log(`[${requestId}] [VALIDATION] All additional contacts validated`);
    }
    
    // Validate UUID arrays for junction tables
    console.log(`[${requestId}] [VALIDATION] Validating UUID arrays for junction tables`);
    if (companyData.buildingDepartments && !validateUUIDArray(companyData.buildingDepartments)) {
      return jsonResponse({
        success: false,
        error: "Invalid UUID format in buildingDepartments array"
      }, 400);
    }
    if (companyData.project_type_ids && !validateUUIDArray(companyData.project_type_ids)) {
      return jsonResponse({
        success: false,
        error: "Invalid UUID format in project_type_ids array"
      }, 400);
    }
    if (companyData.industryRole && !validateUUIDArray(companyData.industryRole)) {
      return jsonResponse({
        success: false,
        error: "Invalid UUID format in industryRole array"
      }, 400);
    }
    if (companyData.techTools && !validateUUIDArray(companyData.techTools)) {
      return jsonResponse({
        success: false,
        error: "Invalid UUID format in techTools array"
      }, 400);
    }
    if (companyData.services && !validateUUIDArray(companyData.services)) {
      return jsonResponse({
        success: false,
        error: "Invalid UUID format in services array"
      }, 400);
    }
    
    // Validate individual UUID fields
    if (companyData.annualRevenue && !validateUUID(companyData.annualRevenue)) {
      return jsonResponse({
        success: false,
        error: "Invalid UUID format for annualRevenue"
      }, 400);
    }
    if (companyData.techSavvy && !validateUUID(companyData.techSavvy)) {
      return jsonResponse({
        success: false,
        error: "Invalid UUID format for techSavvy"
      }, 400);
    }
    if (companyData.referralSourceId && !validateUUID(companyData.referralSourceId)) {
      return jsonResponse({
        success: false,
        error: "Invalid UUID format for referralSourceId"
      }, 400);
    }
    if (companyData.organizationId && !validateUUID(companyData.organizationId)) {
      return jsonResponse({
        success: false,
        error: "Invalid UUID format for organizationId"
      }, 400);
    }
    if (companyData.interestId && !validateUUID(companyData.interestId)) {
      return jsonResponse({
        success: false,
        error: "Invalid UUID format for interestId"
      }, 400);
    }
    
    // Get UUIDs for hardcoded field values with error handling
    console.log(`[${requestId}] [LOOKUP] Fetching reference table UUIDs`);
    
    // account_type_id: default to "client" code
    console.log(`[${requestId}] [LOOKUP] Looking up account_type (code: "client")`);
    const { data: accountTypeData, error: accountTypeError } = await supabase
      .from("companies_account_type_field")
      .select("id")
      .eq("code", "client")
      .eq("active", true)
      .single();
    
    if (accountTypeError || !accountTypeData?.id) {
      console.error(`[${requestId}] [LOOKUP] Failed to lookup account_type:`, accountTypeError);
      await rollbackCreatedRecords(supabase, rollbackTracker);
      return jsonResponse({
        success: false,
        error: "Failed to lookup account type: 'client' not found or inactive"
      }, 500);
    }
    const accountTypeId = accountTypeData.id;
    console.log(`[${requestId}] [LOOKUP] Found account_type_id: ${accountTypeId}`);
    
    // client_stage_id: default to "prospect" code
    console.log(`[${requestId}] [LOOKUP] Looking up client_stage (code: "prospect")`);
    const { data: clientStageData, error: clientStageError } = await supabase
      .from("companies_client_stage_field")
      .select("id")
      .eq("code", "prospect")
      .eq("active", true)
      .single();
    
    if (clientStageError || !clientStageData?.id) {
      console.error(`[${requestId}] [LOOKUP] Failed to lookup client_stage:`, clientStageError);
      await rollbackCreatedRecords(supabase, rollbackTracker);
      return jsonResponse({
        success: false,
        error: "Failed to lookup client stage: 'prospect' not found or inactive"
      }, 500);
    }
    const clientStageId = clientStageData.id;
    console.log(`[${requestId}] [LOOKUP] Found client_stage_id: ${clientStageId}`);
    
    // deal_phase_id: get UUID for code="new"
    console.log(`[${requestId}] [LOOKUP] Looking up deal_phase (code: "new")`);
    const { data: dealPhaseData, error: dealPhaseError } = await supabase
      .from("deal_phase_field")
      .select("id")
      .eq("code", "new")
      .eq("active", true)
      .single();
    
    if (dealPhaseError || !dealPhaseData?.id) {
      console.error(`[${requestId}] [LOOKUP] Failed to lookup deal_phase:`, dealPhaseError);
      await rollbackCreatedRecords(supabase, rollbackTracker);
      return jsonResponse({
        success: false,
        error: "Failed to lookup deal phase: 'new' not found or inactive"
      }, 500);
    }
    const dealPhaseId = dealPhaseData.id;
    console.log(`[${requestId}] [LOOKUP] Found deal_phase_id: ${dealPhaseId}`);
    
    // deal_qualification_id: get UUID for code="need_to_assess"
    console.log(`[${requestId}] [LOOKUP] Looking up deal_qualification (code: "need_to_assess")`);
    const { data: dealQualificationData, error: dealQualificationError } = await supabase
      .from("deal_qualification_field")
      .select("id")
      .eq("code", "need_to_assess")
      .eq("active", true)
      .single();
    
    if (dealQualificationError || !dealQualificationData?.id) {
      console.error(`[${requestId}] [LOOKUP] Failed to lookup deal_qualification:`, dealQualificationError);
      await rollbackCreatedRecords(supabase, rollbackTracker);
      return jsonResponse({
        success: false,
        error: "Failed to lookup deal qualification: 'need_to_assess' not found or inactive"
      }, 500);
    }
    const dealQualificationId = dealQualificationData.id;
    console.log(`[${requestId}] [LOOKUP] Found deal_qualification_id: ${dealQualificationId}`);
    
    // Get contact type for contacts (default to "client")
    console.log(`[${requestId}] [LOOKUP] Looking up contact_type (code: "client")`);
    const { data: contactTypeData, error: contactTypeError } = await supabase
      .from("contacts_type_field")
      .select("id")
      .eq("code", "client")
      .eq("active", true)
      .single();
    
    if (contactTypeError || !contactTypeData?.id) {
      console.error(`[${requestId}] [LOOKUP] Failed to lookup contact_type:`, contactTypeError);
      await rollbackCreatedRecords(supabase, rollbackTracker);
      return jsonResponse({
        success: false,
        error: "Failed to lookup contact type: 'client' not found or inactive"
      }, 500);
    }
    const contactTypeId = contactTypeData.id;
    console.log(`[${requestId}] [LOOKUP] Found contact_type_id: ${contactTypeId}`);
    console.log(`[${requestId}] [LOOKUP] All reference lookups completed successfully`);
    
    // 1. Create company record
    console.log(`[${requestId}] [STEP 1] Creating company: "${companyData.name}"`);
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .insert({
        name: companyData.name,
        address: companyData.address,
        has_website: companyData.hasWebsite,
        website_url: companyData.hasWebsite ? companyData.website || null : null,
        monthly_permitted_projects: companyData.monthlyPermittedProjects && companyData.monthlyPermittedProjects.trim() !== "" ? parseInt(companyData.monthlyPermittedProjects) || null : null,
        annual_revenue_id: companyData.annualRevenue && companyData.annualRevenue.trim() !== "" ? companyData.annualRevenue : null,
        licensed: companyData.isLicensed,
        tech_savvy_id: companyData.techSavvy && companyData.techSavvy.trim() !== "" ? companyData.techSavvy : null,
        tech_description: companyData.techDescription?.trim() || null,
        employee_quantity: companyData.employeeQuantity && companyData.employeeQuantity.trim() !== "" ? parseInt(companyData.employeeQuantity) || null : null,
        office_staff: companyData.officeStaff,
        office_staff_quantity: companyData.officeStaffQuantity && companyData.officeStaffQuantity.trim() !== "" ? parseInt(companyData.officeStaffQuantity) || null : null,
        field_staff: companyData.fieldStaff,
        field_staff_quantity: companyData.fieldStaffQuantity && companyData.fieldStaffQuantity.trim() !== "" ? parseInt(companyData.fieldStaffQuantity) || null : null,
        referral_source_id: companyData.referralSourceId && companyData.referralSourceId.trim() !== "" ? companyData.referralSourceId : null,
        previous_private_provider: companyData.previousPrivateProvider,
        previous_pp_name: companyData.previousPPName?.trim() || null,
        organization_id: companyData.organizationId && companyData.organizationId.trim() !== "" ? companyData.organizationId : null,
        interest_id: companyData.interestId && companyData.interestId.trim() !== "" ? companyData.interestId : null,
        interest_description: companyData.interestDescription?.trim() || null,
        account_type_id: accountTypeId,
        client_stage_id: clientStageId
      })
      .select()
      .single();
    
    if (companyError) {
      console.error(`[${requestId}] [STEP 1] Company creation failed:`, {
        error: companyError.message,
        code: companyError.code,
        details: companyError.details,
        hint: companyError.hint
      });
      await rollbackCreatedRecords(supabase, rollbackTracker);
      return jsonResponse({
        success: false,
        error: `Failed to create company: ${companyError.message}`
      }, 500);
    }
    
    rollbackTracker.companies.push(company.id);
    console.log(`[${requestId}] [STEP 1] Company created successfully:`, {
      companyId: company.id,
      companyName: company.name
    });
    await logTestRecord("companies", company.id);
    
    // 2. Create building departments junction records (conditional)
    if (companyData.buildingDepartments && Array.isArray(companyData.buildingDepartments) && companyData.buildingDepartments.length > 0) {
      console.log(`[${requestId}] [STEP 2] Processing ${companyData.buildingDepartments.length} building department(s)`);
      
      // Validate that building department IDs exist
      console.log(`[${requestId}] [STEP 2] Validating building department IDs exist`);
      const { data: existingDepts, error: deptCheckError } = await supabase
        .from("building_departments")
        .select("id")
        .in("id", companyData.buildingDepartments);
      
      if (deptCheckError || !existingDepts || existingDepts.length !== companyData.buildingDepartments.length) {
        console.error(`[${requestId}] [STEP 2] Building department validation failed:`, {
          requested: companyData.buildingDepartments.length,
          found: existingDepts?.length || 0,
          error: deptCheckError?.message
        });
        await rollbackCreatedRecords(supabase, rollbackTracker);
        return jsonResponse({
          success: false,
          error: "One or more building department IDs do not exist"
        }, 400);
      }
      
      console.log(`[${requestId}] [STEP 2] All building department IDs validated`);
      console.log(`[${requestId}] [STEP 2] Creating building department junction records`);
      const { data: junctionDepts, error: buildingDepartmentsError } = await supabase
        .from("companies__building_departments")
        .insert(companyData.buildingDepartments.map((deptId: string) => ({
          company_id: company.id,
          building_department_id: deptId
        })))
        .select("id");
      
      if (buildingDepartmentsError) {
        console.error(`[${requestId}] [STEP 2] Building departments junction creation failed:`, {
          error: buildingDepartmentsError.message,
          code: buildingDepartmentsError.code,
          details: buildingDepartmentsError.details
        });
        await rollbackCreatedRecords(supabase, rollbackTracker);
        return jsonResponse({
          success: false,
          error: `Failed to link building departments: ${buildingDepartmentsError.message}`
        }, 500);
      }
      
      if (junctionDepts) {
        rollbackTracker.junctions.push({
          table: "companies__building_departments",
          ids: junctionDepts.map((j: any) => j.id)
        });
        console.log(`[${requestId}] [STEP 2] Created ${junctionDepts.length} building department junction(s)`);
      }
    } else {
      console.log(`[${requestId}] [STEP 2] No building departments to link`);
    }
    
    // 3. Create project types junction records (conditional)
    if (companyData.project_type_ids && Array.isArray(companyData.project_type_ids) && companyData.project_type_ids.length > 0) {
      console.log(`[${requestId}] [STEP 3] Processing ${companyData.project_type_ids.length} project type(s)`);
      
      // Validate that project type IDs exist
      console.log(`[${requestId}] [STEP 3] Validating project type IDs exist`);
      const { data: existingProjectTypes, error: projectTypeCheckError } = await supabase
        .from("project_types")
        .select("id")
        .in("id", companyData.project_type_ids);
      
      if (projectTypeCheckError || !existingProjectTypes || existingProjectTypes.length !== companyData.project_type_ids.length) {
        console.error(`[${requestId}] [STEP 3] Project type validation failed:`, {
          requested: companyData.project_type_ids.length,
          found: existingProjectTypes?.length || 0,
          error: projectTypeCheckError?.message
        });
        await rollbackCreatedRecords(supabase, rollbackTracker);
        return jsonResponse({
          success: false,
          error: "One or more project type IDs do not exist"
        }, 400);
      }
      
      console.log(`[${requestId}] [STEP 3] All project type IDs validated`);
      console.log(`[${requestId}] [STEP 3] Creating project type junction records`);
      const { data: junctionProjectTypes, error: projectTypesError } = await supabase
        .from("companies__project_types")
        .insert(companyData.project_type_ids.map((projectTypeId: string) => ({
          company_id: company.id,
          project_type_id: projectTypeId
        })))
        .select("id");
      
      if (projectTypesError) {
        console.error(`[${requestId}] [STEP 3] Project types error:`, projectTypesError);
        await rollbackCreatedRecords(supabase, rollbackTracker);
        return jsonResponse({
          success: false,
          error: `Failed to link project types: ${projectTypesError.message}`
        }, 500);
      }
      
      if (junctionProjectTypes) {
        rollbackTracker.junctions.push({
          table: "companies__project_types",
          ids: junctionProjectTypes.map((j: any) => j.id)
        });
        console.log(`[${requestId}] [STEP 3] Created ${junctionProjectTypes.length} project type junction(s)`);
        
        // Log test records for each junction row
        if (testRunId && scenarioId) {
          for (const junction of junctionProjectTypes) {
            await logTestRecord("companies__project_types", junction.id);
          }
        }
      }
    } else {
      console.log(`[${requestId}] [STEP 3] No project types to link`);
    }
    
    // 4. Create industry role junction records (conditional)
    if (companyData.industryRole && Array.isArray(companyData.industryRole) && companyData.industryRole.length > 0) {
      // Validate that industry role IDs exist
      const { data: existingRoles, error: roleCheckError } = await supabase
        .from("companies_industry_role_field")
        .select("id")
        .in("id", companyData.industryRole);
      
      if (roleCheckError || !existingRoles || existingRoles.length !== companyData.industryRole.length) {
        await rollbackCreatedRecords(supabase, rollbackTracker);
        return jsonResponse({
          success: false,
          error: "One or more industry role IDs do not exist"
        }, 400);
      }
      
      const { data: junctionRoles, error: industryRoleError } = await supabase
        .from("companies__industry_roles")
        .insert(companyData.industryRole.map((roleId: string) => ({
          company_id: company.id,
          industry_role_id: roleId
        })))
        .select("id");
      
      if (industryRoleError) {
        console.error("Industry role error:", industryRoleError);
        await rollbackCreatedRecords(supabase, rollbackTracker);
        return jsonResponse({
          success: false,
          error: `Failed to link industry roles: ${industryRoleError.message}`
        }, 500);
      }
      
      if (junctionRoles) {
        rollbackTracker.junctions.push({
          table: "companies__industry_roles",
          ids: junctionRoles.map((j: any) => j.id)
        });
      }
    }
    
    // 5. Create tech tools junction records (conditional)
    if (companyData.techTools && Array.isArray(companyData.techTools) && companyData.techTools.length > 0) {
      // Validate that tech tool IDs exist
      const { data: existingTechTools, error: techToolCheckError } = await supabase
        .from("companies_tech_tools_field")
        .select("id")
        .in("id", companyData.techTools);
      
      if (techToolCheckError || !existingTechTools || existingTechTools.length !== companyData.techTools.length) {
        await rollbackCreatedRecords(supabase, rollbackTracker);
        return jsonResponse({
          success: false,
          error: "One or more tech tool IDs do not exist"
        }, 400);
      }
      
      const { data: junctionTechTools, error: techToolsError } = await supabase
        .from("companies__tech_tools")
        .insert(companyData.techTools.map((toolId: string) => ({
          company_id: company.id,
          tech_tool_id: toolId
        })))
        .select("id");
      
      if (techToolsError) {
        console.error("Tech tools error:", techToolsError);
        await rollbackCreatedRecords(supabase, rollbackTracker);
        return jsonResponse({
          success: false,
          error: `Failed to link tech tools: ${techToolsError.message}`
        }, 500);
      }
      
      if (junctionTechTools) {
        rollbackTracker.junctions.push({
          table: "companies__tech_tools",
          ids: junctionTechTools.map((j: any) => j.id)
        });
      }
    }
    
    // 6. Create professional license record if applicable (conditional)
    let licenseId = null;
    if (companyData.isLicensed === true) {
      const { data: license, error: licenseError } = await supabase
        .from("professional_licenses")
        .insert({
          license_number: companyData.licenseNumber || ""
        })
        .select()
        .single();
      
      if (licenseError) {
        console.error("License creation error:", licenseError);
        await rollbackCreatedRecords(supabase, rollbackTracker);
        return jsonResponse({
          success: false,
          error: `Failed to create license: ${licenseError.message}`
        }, 500);
      }
      
      licenseId = license.id;
      rollbackTracker.licenses.push(license.id);
      await logTestRecord("professional_licenses", license.id);
      
      const { data: licenseJunction, error: junctionError } = await supabase
        .from("companies__professional_licenses")
        .insert({
          company_id: company.id,
          professional_license_id: license.id
        })
        .select("id");
      
      if (junctionError) {
        console.error("License junction error:", junctionError);
        await rollbackCreatedRecords(supabase, rollbackTracker);
        return jsonResponse({
          success: false,
          error: `Failed to link license to company: ${junctionError.message}`
        }, 500);
      }
      
      if (licenseJunction && licenseJunction.length > 0) {
        rollbackTracker.junctions.push({
          table: "companies__professional_licenses",
          ids: licenseJunction.map((j: any) => j.id)
        });
      }
    }
    
    // 7. Check for existing primary contact by email (prevent duplicates)
    console.log(`[${requestId}] [STEP 7] Processing primary contact`);
    const primaryEmail = contactData.primaryContact.email.trim().toLowerCase();
    console.log(`[${requestId}] [STEP 7] Checking for existing contact with email: ${primaryEmail}`);
    const { data: existingPrimaryContact } = await supabase
      .from("contacts")
      .select("id, email")
      .eq("email", primaryEmail)
      .is("deleted_at", null)
      .maybeSingle();
    
    let primaryContactData: any;
    if (existingPrimaryContact) {
      // Use existing contact
      primaryContactData = existingPrimaryContact;
      console.log(`[${requestId}] [STEP 7] Using existing primary contact:`, {
        contactId: primaryContactData.id,
        email: primaryContactData.email
      });
    } else {
      // Create new primary contact
      console.log(`[${requestId}] [STEP 7] Creating new primary contact`);
      const { data: newContact, error: contactError } = await supabase
        .from("contacts")
        .insert({
          first_name: contactData.primaryContact.firstName,
          last_name: contactData.primaryContact.lastName,
          email: contactData.primaryContact.email.trim(),
          phone: contactData.primaryContact.phone,
          phone_extension: contactData.primaryContact.phoneExtension || "",
          contact_type_id: contactTypeId
        })
        .select()
        .single();
      
      if (contactError) {
        console.error(`[${requestId}] [STEP 7] Primary contact creation failed:`, {
          error: contactError.message,
          code: contactError.code,
          details: contactError.details,
          hint: contactError.hint
        });
        await rollbackCreatedRecords(supabase, rollbackTracker);
        return jsonResponse({
          success: false,
          error: `Failed to create contact: ${contactError.message}`
        }, 500);
      }
      
      primaryContactData = newContact;
      rollbackTracker.contacts.push(primaryContactData.id);
      console.log(`[${requestId}] [STEP 7] Primary contact created successfully:`, {
        contactId: primaryContactData.id,
        email: primaryContactData.email
      });
    }
    
    await logTestRecord("contacts", primaryContactData.id);
    
    // Link primary contact to company (check if already linked)
    const { data: existingLink } = await supabase
      .from("companies__contacts")
      .select("id")
      .eq("company_id", company.id)
      .eq("contact_id", primaryContactData.id)
      .maybeSingle();
    
    if (!existingLink) {
      const { data: primaryContactJunction, error: primaryContactJunctionError } = await supabase
        .from("companies__contacts")
        .insert({
          company_id: company.id,
          contact_id: primaryContactData.id
        })
        .select("id");
      
      if (primaryContactJunctionError) {
        console.error("Primary contact junction error:", primaryContactJunctionError);
        await rollbackCreatedRecords(supabase, rollbackTracker);
        return jsonResponse({
          success: false,
          error: `Failed to link primary contact to company: ${primaryContactJunctionError.message}`
        }, 500);
      }
      
      if (primaryContactJunction && primaryContactJunction.length > 0) {
        rollbackTracker.junctions.push({
          table: "companies__contacts",
          ids: primaryContactJunction.map((j: any) => j.id)
        });
      }
    }
    
    // 8. Create additional contacts (conditional) - with duplicate check
    console.log(`[${requestId}] [STEP 8] Processing additional contacts`);
    const additionalContactIds: string[] = [];
    
    if (contactData.additionalContacts && Array.isArray(contactData.additionalContacts) && contactData.additionalContacts.length > 0) {
      console.log(`[${requestId}] [STEP 8] Found ${contactData.additionalContacts.length} additional contact(s) to process`);
      
      const contactsToCreate: any[] = [];
      const emailsToCheck = contactData.additionalContacts.map((c: any) => c.email?.trim().toLowerCase()).filter(Boolean);
      
      // Check for existing contacts by email
      console.log(`[${requestId}] [STEP 8] Checking for existing contacts by email`);
      const { data: existingAdditionalContacts } = await supabase
        .from("contacts")
        .select("id, email")
        .in("email", emailsToCheck)
        .is("deleted_at", null);
      
      const existingEmailsMap = new Map((existingAdditionalContacts || []).map((c: any) => [
        c.email.toLowerCase(),
        c.id
      ]));
      
      console.log(`[${requestId}] [STEP 8] Found ${existingEmailsMap.size} existing contact(s) by email`);
      
      // Separate new contacts from existing ones
      for (const contact of contactData.additionalContacts) {
        const email = contact.email?.trim().toLowerCase();
        if (email && existingEmailsMap.has(email)) {
          // Use existing contact
          const existingId = existingEmailsMap.get(email);
          additionalContactIds.push(existingId!);
          console.log(`[${requestId}] [STEP 8] Using existing additional contact: ${existingId} (${email})`);
        } else {
          // Create new contact
          contactsToCreate.push({
            first_name: contact.firstName || "",
            last_name: contact.lastName || "",
            email: contact.email?.trim() || "",
            phone: contact.phone || "",
            phone_extension: contact.phoneExtension || "",
            contact_type_id: contactTypeId
          });
        }
      }
      
      // Create new contacts if any
      if (contactsToCreate.length > 0) {
        console.log(`[${requestId}] [STEP 8] Creating ${contactsToCreate.length} new additional contact(s)`);
        const { data: newAdditionalContacts, error: additionalContactsError } = await supabase
          .from("contacts")
          .insert(contactsToCreate)
          .select("id");
        
        if (additionalContactsError) {
          console.error(`[${requestId}] [STEP 8] Additional contacts creation failed:`, {
            error: additionalContactsError.message,
            code: additionalContactsError.code,
            details: additionalContactsError.details,
            hint: additionalContactsError.hint
          });
          await rollbackCreatedRecords(supabase, rollbackTracker);
          return jsonResponse({
            success: false,
            error: `Failed to create additional contacts: ${additionalContactsError.message}`
          }, 500);
        }
        
        if (newAdditionalContacts) {
          const newIds = newAdditionalContacts.map((c: any) => c.id);
          additionalContactIds.push(...newIds);
          rollbackTracker.contacts.push(...newIds);
          console.log(`[${requestId}] [STEP 8] Created ${newIds.length} new additional contact(s):`, newIds);
        }
      }
      
      console.log(`[${requestId}] [STEP 8] Total additional contact IDs: ${additionalContactIds.length}`);
      
      // Log each additional contact as a test record
      for (const contactId of additionalContactIds) {
        await logTestRecord("contacts", contactId);
      }
      
      // Link additional contacts to company (only new links)
      if (additionalContactIds.length > 0) {
        console.log(`[${requestId}] [STEP 8] Linking additional contacts to company`);
        
        // Check which links already exist
        const { data: existingLinks } = await supabase
          .from("companies__contacts")
          .select("contact_id")
          .eq("company_id", company.id)
          .in("contact_id", additionalContactIds);
        
        const existingLinkIds = new Set((existingLinks || []).map((l: any) => l.contact_id));
        const newLinkIds = additionalContactIds.filter((id) => !existingLinkIds.has(id));
        
        console.log(`[${requestId}] [STEP 8] Found ${existingLinkIds.size} existing link(s), ${newLinkIds.length} new link(s) to create`);
        
        if (newLinkIds.length > 0) {
          const { data: additionalContactsJunction, error: additionalContactsJunctionError } = await supabase
            .from("companies__contacts")
            .insert(newLinkIds.map((contactId: string) => ({
              company_id: company.id,
              contact_id: contactId
            })))
            .select("id");
          
          if (additionalContactsJunctionError) {
            console.error(`[${requestId}] [STEP 8] Additional contacts junction creation failed:`, {
              error: additionalContactsJunctionError.message,
              code: additionalContactsJunctionError.code,
              details: additionalContactsJunctionError.details
            });
            await rollbackCreatedRecords(supabase, rollbackTracker);
            return jsonResponse({
              success: false,
              error: `Failed to link additional contacts to company: ${additionalContactsJunctionError.message}`
            }, 500);
          }
          
          if (additionalContactsJunction && additionalContactsJunction.length > 0) {
            rollbackTracker.junctions.push({
              table: "companies__contacts",
              ids: additionalContactsJunction.map((j: any) => j.id)
            });
            console.log(`[${requestId}] [STEP 8] Created ${additionalContactsJunction.length} additional contact junction(s)`);
          }
        }
      }
    } else {
      console.log(`[${requestId}] [STEP 8] No additional contacts to process`);
    }
    
    // 9. Create deal record linked to company and primary contact (always required)
    console.log(`[${requestId}] [STEP 9] Creating deal record`);
    const { data: deal, error: dealError } = await supabase
      .from("deals")
      .insert({
        title: `${companyData.name} - Deal`,
        company_id: company.id,
        primary_contact_id: primaryContactData.id,
        deal_phase_id: dealPhaseId,
        deal_qualification_id: dealQualificationId
      })
      .select()
      .single();
    
    if (dealError) {
      console.error(`[${requestId}] [STEP 9] Deal creation failed:`, {
        error: dealError.message,
        code: dealError.code,
        details: dealError.details,
        hint: dealError.hint
      });
      await rollbackCreatedRecords(supabase, rollbackTracker);
      return jsonResponse({
        success: false,
        error: `Failed to create deal: ${dealError.message}`
      }, 500);
    }
    
    rollbackTracker.deals.push(deal.id);
    console.log(`[${requestId}] [STEP 9] Deal created successfully:`, {
      dealId: deal.id,
      title: deal.title,
      companyId: deal.company_id
    });
    await logTestRecord("deals", deal.id);
    
    // 10. Link additional contacts to deal (conditional)
    console.log(`[${requestId}] [STEP 10] Linking additional contacts to deal`);
    if (additionalContactIds.length > 0) {
      console.log(`[${requestId}] [STEP 10] Validating ${additionalContactIds.length} contact ID(s) exist`);
      
      // Validate that contact IDs exist
      const { data: existingDealContacts } = await supabase
        .from("contacts")
        .select("id")
        .in("id", additionalContactIds);
      
      if (!existingDealContacts || existingDealContacts.length !== additionalContactIds.length) {
        console.error(`[${requestId}] [STEP 10] Contact validation failed:`, {
          requested: additionalContactIds.length,
          found: existingDealContacts?.length || 0
        });
        await rollbackCreatedRecords(supabase, rollbackTracker);
        return jsonResponse({
          success: false,
          error: "One or more additional contact IDs do not exist"
        }, 400);
      }
      
      console.log(`[${requestId}] [STEP 10] All contact IDs validated, creating deal contact junctions`);
      const { data: dealContactsJunction, error: dealContactsError } = await supabase
        .from("deals__other_contacts")
        .insert(additionalContactIds.map((contactId: string) => ({
          deal_id: deal.id,
          other_contact_id: contactId
        })))
        .select("id");
      
      if (dealContactsError) {
        console.error(`[${requestId}] [STEP 10] Deal contacts junction creation failed:`, {
          error: dealContactsError.message,
          code: dealContactsError.code,
          details: dealContactsError.details
        });
        await rollbackCreatedRecords(supabase, rollbackTracker);
        return jsonResponse({
          success: false,
          error: `Failed to link additional contacts to deal: ${dealContactsError.message}`
        }, 500);
      }
      
      if (dealContactsJunction && dealContactsJunction.length > 0) {
        rollbackTracker.junctions.push({
          table: "deals__other_contacts",
          ids: dealContactsJunction.map((j: any) => j.id)
        });
        console.log(`[${requestId}] [STEP 10] Created ${dealContactsJunction.length} deal contact junction(s)`);
      }
    } else {
      console.log(`[${requestId}] [STEP 10] No additional contacts to link to deal`);
    }
    
    // 11. Create service junction records linked to deal (conditional)
    console.log(`[${requestId}] [STEP 11] Processing services for deal`);
    if (companyData.services && Array.isArray(companyData.services) && companyData.services.length > 0) {
      console.log(`[${requestId}] [STEP 11] Validating ${companyData.services.length} service ID(s) exist`);
      
      // Validate that service IDs exist
      const { data: existingServices, error: serviceCheckError } = await supabase
        .from("services")
        .select("id")
        .in("id", companyData.services);
      
      if (serviceCheckError || !existingServices || existingServices.length !== companyData.services.length) {
        console.error(`[${requestId}] [STEP 11] Service validation failed:`, {
          requested: companyData.services.length,
          found: existingServices?.length || 0,
          error: serviceCheckError?.message
        });
        await rollbackCreatedRecords(supabase, rollbackTracker);
        return jsonResponse({
          success: false,
          error: "One or more service IDs do not exist"
        }, 400);
      }
      
      console.log(`[${requestId}] [STEP 11] All service IDs validated, creating service deal junctions`);
      const { data: servicesJunction, error: servicesError } = await supabase
        .from("services__deals")
        .insert(companyData.services.map((serviceId: string) => ({
          deal_id: deal.id,
          service_id: serviceId
        })))
        .select("id");
      
      if (servicesError) {
        console.error(`[${requestId}] [STEP 11] Services junction creation failed:`, {
          error: servicesError.message,
          code: servicesError.code,
          details: servicesError.details
        });
        await rollbackCreatedRecords(supabase, rollbackTracker);
        return jsonResponse({
          success: false,
          error: `Failed to link services to deal: ${servicesError.message}`
        }, 500);
      }
      
      if (servicesJunction && servicesJunction.length > 0) {
        rollbackTracker.junctions.push({
          table: "services__deals",
          ids: servicesJunction.map((j: any) => j.id)
        });
        console.log(`[${requestId}] [STEP 11] Created ${servicesJunction.length} service deal junction(s)`);
      }
    } else {
      console.log(`[${requestId}] [STEP 11] No services to link to deal`);
    }
    
    // Success response
    const duration = Date.now() - startTime;
    console.log(`[${requestId}] ========== REQUEST SUCCESSFUL ==========`);
    console.log(`[${requestId}] Duration: ${duration}ms`);
    console.log(`[${requestId}] Created records summary:`, {
      companies: rollbackTracker.companies.length,
      contacts: rollbackTracker.contacts.length,
      deals: rollbackTracker.deals.length,
      licenses: rollbackTracker.licenses.length,
      junctions: rollbackTracker.junctions.reduce((sum, j) => sum + j.ids.length, 0)
    });
    
    const responseData: any = {
      companyId: company.id,
      primaryContactId: primaryContactData.id,
      dealId: deal.id,
      additionalContactIds
    };
    
    if (licenseId) {
      responseData.licenseId = licenseId;
    }
    
    if (testRunId && scenarioId) {
      responseData.testRunId = testRunId;
      responseData.scenarioId = scenarioId;
    }
    
    console.log(`[${requestId}] Response data:`, responseData);
    return jsonResponse({
      success: true,
      message: "Application submitted successfully",
      data: responseData
    }, 200);
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error(`[${requestId}] ========== UNEXPECTED ERROR ==========`);
    console.error(`[${requestId}] Duration before error: ${duration}ms`);
    console.error(`[${requestId}] Error message:`, errorMessage);
    console.error(`[${requestId}] Error stack:`, errorStack);
    console.error(`[${requestId}] Error object:`, error);
    console.error(`[${requestId}] Rollback tracker state:`, rollbackTracker);
    
    // Attempt rollback on unexpected errors
    try {
      console.log(`[${requestId}] [ROLLBACK] Attempting rollback due to unexpected error`);
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      
      if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        await rollbackCreatedRecords(supabase, rollbackTracker);
        console.log(`[${requestId}] [ROLLBACK] Rollback completed`);
      } else {
        console.error(`[${requestId}] [ROLLBACK] Cannot rollback - missing Supabase credentials`);
      }
    } catch (rollbackError) {
      console.error(`[${requestId}] [ROLLBACK] Rollback failed:`, {
        error: rollbackError instanceof Error ? rollbackError.message : String(rollbackError),
        stack: rollbackError instanceof Error ? rollbackError.stack : undefined
      });
    }
    
    console.error(`[${requestId}] ========== REQUEST FAILED ==========`);
    return jsonResponse({
      success: false,
      error: errorMessage
    }, 500);
  }
});

