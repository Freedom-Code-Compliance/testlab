# FCC Test Lab – PRD (v1.2)

## 1. Overview
FCC Test Lab is an internal tool for generating, managing, logging, and purging test workflow data across FCC Apply, FCC CRM, MyFCC, FCCPRO, and fccOPS. It eliminates manual test data creation and ensures reproducible, isolated, and safe-to-purge test environments.

## 2. Objectives
1. Generate realistic and complete test data states with one click.
2. Keep the system clean using safe purge operations.
3. Provide full auditability of test runs.
4. Allow complex workflows to be tested repeatedly without cluttering real data.
5. Support three initial scenarios with future expansion.

## 3. Test Fixture Defaults
Used as default dropdown values for project-based scenarios. These are NOT logged into test_records and NEVER purged.

### Default Project Test Company
```
companies.id = 79a05b0d-0f3b-404e-9fa3-ddbd13b37ad3
name = "Test Project Company 1"
```

### Default Project Test Contact
```
contacts.id = 019a7da9-cde3-7a9b-fc4d-0416789a0a46
name = "John Client"
```

## 4. Scenarios

### Scenario 1 – New Application (Apply Form Submitted)
Uses edge function `apply_form_submitted`. Creates a new company, contact, and deal.  
All are logged into `test_records` and purgeable.

Unique identifiers:
- `email = "test+new_application+" + run_id + "@example.test"`
- `phone = "555" + last_7_digits(run_id)`

### Scenario 2 – Create New Project (Manual)
Creates a new project under default or user-selected test company/contact.

Required fields:
- name, building_department_id, project_type_id, occupancy_id, construction_type_id
- phase_id (default = intake/new)
- status_id (default = draft)
- address_line1, city, state, zipcode
- company_id

Plan Set:
- Always create initial plan set (type = initial_submission)
- File storage path:
```
testlab/projects/<project_id>/plans/initial/<filename>
```

### Scenario 3 – Create New Project (From Monday.com)
Boards:
- Completed Projects Board: `18369402312`
- Plan Sets Board: `5307810845`

Monday fields → FCC mapping:
- name → projects.name
- address_line1, city, state, zipcode
- building_department lookup
- plan set files downloaded from Monday → Supabase storage

Plan set type mapping:
Values from Monday must map to plan_set_file_types:
- construction_plans
- truss_documents
- noa_product_approvals
- energy_load_calcs
- zoning_documents
- other_documents

## 5. Purge System
Purges use `test_records` as the source of truth.

### Rules:
- NEVER purge default company/contact
- NEVER purge shared reference data (building departments, project types, etc.)
- Purge in FK-safe order (child → parent)
- Junction tables must be logged and purged

## 6. Logging

### test_records
Every primary domain object created:
- companies, contacts, deals
- projects, plan_sets, files
- plan_reviews, inspections, sessions, cocs, permit_expedites
- junction tables

### activity_log
Actions logged:
- test_run_created
- test_run_failed
- test_run_completed
- test_records_purged
- scenario created/updated/activated/deactivated

Failed runs must log error_message and set status = failed.

## 7. UI Requirements

### Scenario list page
- Lists active scenarios from test_scenarios
- Clicking opens scenario-specific form

### Scenario execution page
- Scenario-specific form (not metadata-driven)
- Shows run progress state
- Displays counts by table after run

### Runs page
- Lists runs with scenario name, timestamps
- Clicking run shows grouped test_records for that run

### Purge page
- Multi-select runs
- Shows preview counts before deletion
- Requires purge reason
- Calls purge edge function

## 8. Edge Function Architecture
Separate functions:
- apply_form_submitted
- create_test_project (supports both Manual and Monday flows)
- testlab_purge_by_run

Monday API must be used server-side only.

## 9. Error Handling
- No DB transactions for v1
- Partial failures return success: false
- test_runs updated to failed
- All created records remain logged so purge works safely

## 10. Test Data Isolation
Test Lab runs occur on non-prod environments for now.

Future:
- Views may filter out test data via LEFT JOIN test_records

## 11. Tasks for Implementation (Cursor)
1. Build Test Lab UI (React/Vite/Tailwind)
2. Scenario list page
3. Scenario-specific forms (S1, S2, S3)
4. Run creation via rpc('testlab_create_run')
5. Integrate edge function calls
6. File uploads for S2
7. Monday item picker + mapping UI for S3
8. Runs page + detail view
9. Purge page with preview + delete
10. Logging display (optional for v1)
