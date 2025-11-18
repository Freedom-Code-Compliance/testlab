# API Reference

## Supabase RPC Functions

### testlab_create_run
Creates a new test run record.

**Parameters:**
- `p_scenario_id` (uuid): The scenario ID to execute
- `p_run_by` (uuid, nullable): User ID who is running the test

**Returns:**
- `uuid`: The created test run ID

**Usage:**
```typescript
const runId = await createTestRun(scenarioId, userId);
```

### testlab_log_record
Logs a test record for tracking created objects.

**Parameters:**
- `p_run_id` (uuid): The test run ID
- `p_scenario_id` (uuid): The scenario ID
- `p_table_name` (text): Name of the table where record was created
- `p_record_id` (uuid): ID of the created record
- `p_created_by` (uuid, nullable): User ID who created the record
- `p_table_id` (text, nullable): Optional table identifier

**Returns:**
- `void`

## Edge Functions

### apply_form_submitted
Creates a new application (company, contact, deal).

**Endpoint:** `POST /functions/v1/apply_form_submitted`

**Request Body:**
```json
{
  "testRunId": "uuid",
  "scenarioId": "uuid",
  "runBy": "uuid",
  "companyData": {
    "name": "string",
    "address": "string",
    "hasWebsite": boolean,
    "website": "string",
    "isLicensed": boolean,
    "licenseNumber": "string",
    "monthlyPermittedProjects": "string",
    "annualRevenue": "uuid",
    "techSavvy": "uuid",
    "techDescription": "string",
    "employeeQuantity": "string",
    "officeStaff": boolean,
    "officeStaffQuantity": "string",
    "fieldStaff": boolean,
    "fieldStaffQuantity": "string",
    "referralSourceId": "uuid",
    "previousPrivateProvider": boolean,
    "previousPPName": "string",
    "organizationId": "uuid",
    "interestId": "uuid",
    "interestDescription": "string",
    "buildingDepartments": ["uuid"],
    "project_type_ids": ["uuid"],
    "industryRole": ["uuid"],
    "techTools": ["uuid"],
    "services": ["uuid"]
  },
  "contactData": {
    "primaryContact": {
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string",
      "phoneExtension": "string"
    },
    "additionalContacts": [
      {
        "firstName": "string",
        "lastName": "string",
        "email": "string",
        "phone": "string",
        "phoneExtension": "string"
      }
    ]
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "companyId": "uuid",
    "primaryContactId": "uuid",
    "dealId": "uuid",
    "additionalContactIds": ["uuid"],
    "licenseId": "uuid",
    "testRunId": "uuid",
    "scenarioId": "uuid"
  }
}
```

**Notes:**
- `project_type_ids` is an array of UUIDs referencing the `project_types` table
- Creates junction records in `companies__project_types` table
- All junction records are logged in `test_records` for test tracking
```
<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>
read_file

### create_test_project
Creates a test project (manual or from Monday.com).

**Endpoint:** `POST /functions/v1/create_test_project`

**Request Body (Manual Mode):**
```json
{
  "run_id": "uuid",
  "project_data": {
    "name": "string",
    "building_department_id": "uuid",
    "project_type_id": "uuid",
    "occupancy_id": "uuid",
    "construction_type_id": "uuid",
    "address_line1": "string",
    "city": "string",
    "state": "string",
    "zipcode": "string",
    "company_id": "uuid",
    "contact_id": "uuid",
    "phase_id": "uuid"
  },
  "files": {
    "file_type_id": ["path/to/file1.pdf", "path/to/file2.pdf"]
  },
  "mode": "manual"
}
```

**Request Body (Monday Mode):**
```json
{
  "run_id": "uuid",
  "monday_item_id": "string",
  "file_type_mappings": {
    "construction_plans": "monday_column_id",
    "truss_documents": "monday_column_id"
  },
  "plan_set_files": [
    {
      "id": "string",
      "name": "string",
      "url": "string",
      "type": "string"
    }
  ],
  "mode": "monday"
}
```

**Response:**
```json
{
  "success": true,
  "project_id": "uuid"
}
```

### testlab_purge_by_run
Purges all test records for specified runs.

**Endpoint:** `POST /functions/v1/testlab_purge_by_run`

**Request Body:**
```json
{
  "runIds": ["uuid"],
  "reason": "string",
  "actorId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Test data purged successfully.",
  "data": {
    "deletedCounts": {
      "companies__project_types": 2,
      "companies": 1,
      "contacts": 1,
      "deals": 1
    },
    "totalDeleted": 5
  }
}
```

**Notes:**
- Deletes records in proper order respecting foreign key relationships
- Junction tables (including `companies__project_types`) are deleted before parent tables
- Updates `test_runs` with purge metadata (`purged_at`, `purged_by`, `purge_reason`)
- Logs purge activity to `activity_log` table

### monday_fetch_projects
Fetches projects from Monday.com Completed Projects 2 board.

**Endpoint:** `POST /functions/v1/monday_fetch_projects`

**Request Body:**
```json
{
  "board_id": "18369402312",
  "limit": 500
}
```

**Response:**
```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "column_values": [
        {
          "id": "string",
          "text": "string",
          "value": "string",
          "type": "string"
        }
      ]
    }
  ]
}
```

### monday_fetch_plan_sets
Fetches plan set files from Monday.com for a specific project.

**Endpoint:** `POST /functions/v1/monday_fetch_plan_sets`

**Request Body:**
```json
{
  "project_id": "monday_item_id",
  "plan_set_type": "initial_submission"
}
```

**Response:**
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

## Database Tables

### test_scenarios
Stores test scenario definitions.

**Key Fields:**
- `id` (uuid): Primary key
- `name` (text): Scenario name
- `description` (text): Scenario description
- `call_function` (text): Edge function name to call
- `active` (bool): Whether scenario is active
- `metadata` (jsonb): Additional scenario metadata

### test_runs
Stores test run executions.

**Key Fields:**
- `id` (uuid): Primary key
- `scenario_id` (uuid): Foreign key to test_scenarios
- `run_at` (timestamptz): When the run was executed
- `run_by` (uuid, nullable): User who ran the test
- `purged_at` (timestamptz, nullable): When the run was purged
- `purged_by` (uuid, nullable): User who purged the run
- `purge_reason` (text, nullable): Reason for purging

### test_records
Logs all records created during test runs.

**Key Fields:**
- `id` (bigint): Primary key
- `run_id` (uuid): Foreign key to test_runs
- `scenario_id` (uuid): Foreign key to test_scenarios
- `table_name` (text): Name of the table
- `table_id` (text, nullable): Optional table identifier
- `record_id` (uuid): ID of the created record
- `created_at` (timestamptz): When the record was created
- `created_by` (uuid, nullable): User who created the record

### activity_log
Tracks all activities in the system.

**Key Fields:**
- `id` (bigint): Primary key
- `occurred_at` (timestamptz): When the activity occurred
- `actor_id` (uuid, nullable): User who performed the action
- `actor_type` (text, nullable): Type of actor
- `action` (text): Action performed (e.g., "test_run_created", "test_run_completed")
- `target_table` (text, nullable): Table affected
- `target_id` (uuid, nullable): ID of affected record
- `context` (jsonb): Additional context data

## Helper Functions

### createTestRun
```typescript
async function createTestRun(
  scenarioId: string,
  runBy: string | null = null
): Promise<string>
```

Creates a new test run and returns the run ID.

### callEdgeFunction
```typescript
async function callEdgeFunction(
  functionName: string,
  body: any
): Promise<any>
```

Calls a Supabase edge function with error handling.

## Error Handling

All edge functions return errors in this format:
```json
{
  "error": "Error message here"
}
```

The frontend `callEdgeFunction` helper automatically throws errors if:
- The edge function returns an error
- The response contains an `error` field
- The HTTP request fails

## Authentication

Edge functions use Supabase JWT authentication. The Supabase client automatically includes the authentication token in requests.

For Monday.com API calls, the API key is stored as a Supabase secret (`MONDAY_API_KEY`) and accessed server-side only.



