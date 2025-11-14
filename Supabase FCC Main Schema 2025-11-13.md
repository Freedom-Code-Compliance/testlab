# Supabase Schema Documentation - FCC Main

**Generated:** 2025-11-13 23:09:33

---

## Table of Contents

1. [Extensions](#extensions)
2. [Schema Overview](#schema-overview)
3. [Public Schema Tables](#public-schema)
4. [Auth Schema Tables](#auth-schema)
5. [Storage Schema Tables](#storage-schema)
6. [Foreign Key Relationships](#foreign-key-relationships)
7. [Indexes](#indexes)
8. [Row Level Security (RLS) Policies](#row-level-security-rls-policies)
9. [Functions](#functions)
10. [Triggers](#triggers)

---

## Extensions

| Extension | Version | Schema | Description |
|-----------|---------|--------|-------------|
| pg_stat_statements | 1.11 | extensions | track planning and execution statistics of all SQL statements executed |
| uuid-ossp | 1.1 | extensions | generate universally unique identifiers (UUIDs) |
| pgcrypto | 1.3 | extensions | cryptographic functions |
| pg_graphql | 1.5.11 | graphql | pg_graphql: GraphQL support |
| supabase_vault | 0.3.1 | vault | Supabase Vault Extension |
| postgis | 3.3.7 | public | PostGIS geometry and geography spatial types and functions |

_Note: Only installed extensions are shown. Many other extensions are available but not installed._

---

## Schema Overview

This database contains **115 tables** across 3 schemas:

- **public**: Main application tables (115 tables)
- **auth**: Authentication and user management (0 tables)
- **storage**: File storage management (0 tables)

---

## Complete Table Listing

### Public Schema Tables

| Table Name | Columns | Description |
|------------|---------|-------------|
| `activity_log` | 8 |  |
| `agreements` | 9 | Agreements table with Realtime enabled for CRM subscriptions |
| `agreements_status_field` | 8 |  |
| `apps` | 9 |  |
| `apps__roles` | 7 |  |
| `bcp` | 15 | Airtable: Building Code Professionals (id: tblaRr54lKgDNDQpK) |
| `bcp_availability_field` | 8 | Building Code Professionals |
| `bcp_qualified_services` | 9 | Airtable: BCP Qualified Services (id: tblwC2ylPSCYbzNSI) |
| `bd_inspection_types` | 10 | List of all Inspection Types from Building Departments. Names may be duplicates. Each record should be linked to a Standard Inspection Type. |
| `building_departments` | 20 | Airtable: Building Departments (id: tblqGl0OVemJ14B3m) |
| `building_departments__bcp` | 9 |  |
| `building_departments_registration_status_field` | 8 | Building Departments |
| `client_users` | 7 |  |
| `companies` | 32 | Companies table with Realtime enabled for CRM subscriptions |
| `companies__building_departments` | 8 |  |
| `companies__contacts` | 7 | Companies-Contacts junction table with Realtime enabled for CRM subscriptions |
| `companies__industry_roles` | 8 |  |
| `companies__permit_expediting` | 9 |  |
| `companies__professional_licenses` | 8 |  |
| `companies__services` | 7 |  |
| `companies__subcontractors` | 8 |  |
| `companies__tech_tools` | 8 |  |
| `companies__work_types` | 9 |  |
| `companies_account_type_field` | 8 | Companies |
| `companies_annual_revenue_field` | 7 |  |
| `companies_client_stage_field` | 8 | Companies |
| `companies_industry_role_field` | 8 | Companies |
| `companies_interest_field` | 9 |  |
| `companies_organization_field` | 9 |  |
| `companies_referral_source_field` | 8 |  |
| `companies_tech_savvy_field` | 9 |  |
| `companies_tech_tools_field` | 9 |  |
| `companies_work_types_field` | 9 |  |
| `construction_types` | 10 | Airtable: Construction Types (id: tblCZN3wSdVZORUry) |
| `construction_types__project_types` | 8 |  |
| `contacts` | 12 | Contacts table with Realtime enabled for CRM subscriptions |
| `contacts__building_departments` | 8 |  |
| `contacts__projects` | 8 |  |
| `contacts_type_field` | 9 | Contacts |
| `deal_phase_field` | 8 |  |
| `deal_qualification_field` | 8 |  |
| `deals` | 14 | Deals table with Realtime enabled for CRM subscriptions |
| `deals__other_contacts` | 8 |  |
| `disciplines` | 8 | Airtable: Disciplines (id: tblzLh0p7RePoLEs2) |
| `employee_users` | 9 |  |
| `files` | 13 |  |
| `inspection_modes` | 7 | Airtable: Inspection Modes (id: tblLzVFPKXcm5Wz1l) |
| `inspection_sessions` | 12 | Airtable: Inspection Sessions (id: tblKw2HSfUAI8vSEZ) |
| `inspection_sessions__contacts` | 8 |  |
| `inspection_sessions__project_media` | 10 |  |
| `inspection_sessions_status_field` | 8 | Inspection Sessions |
| `inspections` | 10 | Airtable: Inspections (id: tblKaVcietpUYwJhN) |
| `inspections_result_field` | 8 | Inspections |
| `invoice_line_items` | 13 | Airtable: Invoice Line Items (id: tblAX449iJaYOV6cA) |
| `invoice_line_items_status_field` | 9 |  |
| `invoices` | 13 | Airtable: Invoices (id: tblNETmcNwKt90r3t) |
| `invoices_collection_status_field` | 9 | Invoices |
| `invoices_payment_status_field` | 9 | Invoices |
| `issue_comments` | 10 | Airtable: Issue Comments (id: tblZqISSIHty3zNF1) |
| `occupancies` | 7 | Airtable: Occupancies (id: tblo3OJeaDkud20sB) |
| `payment_processors` | 7 |  |
| `payments` | 15 |  |
| `payments__invoices` | 8 | Junction between payments and invoices. Technically an invoice can have multiple partial payments and a payment can be applied to multiple invoices, |
| `permit_expediting` | 23 | Airtable: Permit Expediting (id: tblBdoEIcb2ISpOuD) |
| `permit_expediting_document_status_field` | 9 | Permit Expediting |
| `permit_expediting_fees_status_field` | 10 | Permit Expediting |
| `permit_expediting_noc_status_field` | 9 | Permit Expediting |
| `permit_expediting_ntbo_status_field` | 9 | Permit Expediting |
| `permit_expediting_permit_app_status_field` | 9 | Permit Expediting |
| `permit_expediting_private_provider_field` | 9 | Permit Expediting |
| `permit_expediting_status_field` | 9 | Permit Expediting |
| `permit_expediting_sub_form_field` | 9 | Permit Expediting |
| `permit_expediting_sub_permit_type_field` | 10 | Permits |
| `permit_expediting_subcontractor_info_field` | 9 | Permit Expediting |
| `permit_expediting_workability_field` | 9 | Permit Expediting |
| `plan_review_result_field` | 7 | Result field for Plan Review table |
| `plan_reviews` | 11 | Airtable: Plan Reviews (id: tbl77NbisHn3IZ8i1) |
| `plan_reviews_status_field` | 8 |  |
| `plan_sets` | 10 | Airtable: Plan Sets (id: tblI6oMRSrK1R0pQY) |
| `plan_sets__files` | 14 | Junction Table |
| `plan_sets_document_review_field` | 8 | Plan Sets |
| `plan_sets_file_types` | 7 |  |
| `plan_sets_type_field` | 8 | Services |
| `plan_sets_working_set_field` | 8 | Plan Sets |
| `price_list` | 14 | Airtable: Price List (id: tblERwCBV0gFANrME) |
| `price_list_status_field` | 9 |  |
| `professional_licenses` | 14 | Airtable: Professional Licenses (id: tblVAjkspFrbaGPhu) |
| `professional_licenses__bcp_qualified_services` | 8 |  |
| `professional_licenses_status_field` | 9 |  |
| `professional_licenses_type_field` | 9 | Professional Licenses |
| `project_media` | 12 | Airtable: Project Media (id: tblkXHdC92grrZGmf) |
| `project_media_upload_method_field` | 8 | Project Media |
| `project_phases` | 8 | Airtable: Project Phases (id: tblGoqDSCi75HtBHp) |
| `project_phases_status_field` | 9 | Airtable: Project Phase Statuses (id: tblRNyEiLRCrnYa6C) |
| `project_types` | 8 | Airtable: Project Types (id: tblrjoQ9XJXX055fZ) |
| `projects` | 27 | Airtable: Projects (id: tbloBrkVaFgQS6Lee) |
| `projects__services` | 7 |  |
| `quotes` | 14 | Airtable: Quotes (id: tblMcQXwAKR6hAGw8) |
| `quotes_status_field` | 9 | Quotes |
| `rls_permissions` | 16 |  |
| `rls_permissions_audit` | 20 |  |
| `roles` | 8 |  |
| `services` | 9 | Airtable: Services (id: tblHYVbRZWgiPYrt9) |
| `services__deals` | 7 |  |
| `services_type_field` | 10 | Type single select field for the Services table |
| `spatial_ref_sys` | 5 |  |
| `standard_inspection_types` | 9 | List of Standard Inspection Types. We will set behavior such as Allowable Inspection Modes, Inspection Guide Sheets, etc by relating each of thousands of BD types to a smaller list of Standard Types. |
| `standard_inspection_types__inspection_modes` | 8 |  |
| `test_records` | 8 |  |
| `test_runs` | 7 |  |
| `test_scenarios` | 8 |  |
| `threads` | 17 |  |
| `trades` | 8 | Airtable: Trades (id: tbleXdO6KoYvHbKLs) |
| `user_profiles` | 12 | Airtable: User Profiles (id: tblcDOqYc24Djhzvo) |
| `user_profiles_status_field` | 9 |  |

### Auth Schema Tables

| Table Name | Columns | Description |
|------------|---------|-------------|

### Storage Schema Tables

| Table Name | Columns | Description |
|------------|---------|-------------|

---

## Detailed Table Column Information

### Public Schema Tables

#### activity_log

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | bigint(64,0) | NO | AUTO_INCREMENT |
| `occurred_at` | timestamptz | NO | now() |
| `actor_id` | uuid | YES |  |
| `actor_type` | text | YES |  |
| `action` | text | NO |  |
| `target_table` | text | YES |  |
| `target_id` | uuid | YES |  |
| `context` | jsonb | NO | '{}'::jsonb |

#### agreements

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `created_at` | timestamptz | NO | now() |
| `updated_at` | timestamptz | NO | now() |
| `company_id` | uuid | YES |  |
| `number` | bigint(64,0) | YES |  |
| `status_id` | uuid | YES |  |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### agreements_status_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `color` | text | YES |  |
| `id` | uuid | NO | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### apps

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `description` | text | YES |  |
| `created_at` | timestamptz | NO | now() |
| `updated_at` | timestamptz | NO | now() |
| `api_key` | text | YES |  |
| `id` | uuid | NO | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `deleted_at` | timestamptz | YES |  |

#### apps__roles

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `role_code` | text | YES |  |
| `app_id` | uuid | YES |  |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### bcp

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `created_at` | timestamptz | NO | now() |
| `updated_at` | timestamptz | NO | now() |
| `plan_review_license_id` | uuid | YES |  |
| `inspector_license_id` | uuid | YES |  |
| `private_provider_license_id` | uuid | YES |  |
| `user_profile_id` | uuid | YES |  |
| `contact_id` | uuid | YES |  |
| `signature_file_id` | uuid | YES |  |
| `photo_file_id` | uuid | YES |  |
| `resume_file_id` | uuid | YES |  |
| `availability_id` | uuid | YES |  |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### bcp_availability_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `color` | text | YES |  |
| `id` | uuid | NO | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### bcp_qualified_services

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `created_at` | timestamptz | NO | now() |
| `updated_at` | timestamptz | NO | now() |
| `name` | text | YES |  |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### bd_inspection_types

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `created_at` | timestamptz | NO | now() |
| `updated_at` | timestamptz | NO | now() |
| `building_department_id` | uuid | YES |  |
| `value` | text | YES |  |
| `notes` | text | YES |  |
| `standard_inspection_type_id` | uuid | YES |  |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### building_departments

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `created_at` | timestamptz | NO | now() |
| `updated_at` | timestamptz | NO | now() |
| `name` | text | YES |  |
| `permitting_instructions_url` | text | YES |  |
| `public_website_url` | text | YES |  |
| `pp_portal_url` | text | YES |  |
| `staff_directory_url` | text | YES |  |
| `permit_portal_url` | text | YES |  |
| `pp_licensing_email` | text | YES |  |
| `fcc_username` | text | YES |  |
| `fcc_password` | text | YES |  |
| `pp_phone` | text | YES |  |
| `address_text` | text | YES |  |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `registration_status_id` | uuid | YES |  |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### building_departments__bcp

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `building_department_id` | uuid | NO |  |
| `bcp_id` | uuid | NO |  |
| `created_at` | timestamptz | NO | now() |
| `reason` | text | YES |  |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### building_departments_registration_status_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `color` | text | YES |  |
| `id` | uuid | NO | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### client_users

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `company_id` | uuid | YES |  |
| `created_at` | timestamptz | NO | now() |
| `updated_at` | timestamptz | NO | now() |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### companies

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `created_at` | timestamptz | NO | now() |
| `updated_at` | timestamptz | NO | now() |
| `name` | text | YES |  |
| `address` | text | YES |  |
| `billing_contact_name` | text | YES |  |
| `billing_phone` | text | YES |  |
| `billing_email` | text | YES |  |
| `banned` | bool | YES | false |
| `website_url` | text | YES |  |
| `monthly_permitted_projects` | bigint(64,0) | YES |  |
| `tech_description` | text | YES |  |
| `employee_quantity` | integer(32,0) | YES |  |
| `field_staff` | bool | YES | false |
| `field_staff_quantity` | integer(32,0) | YES |  |
| `office_staff` | bool | YES | false |
| `office_staff_quantity` | bigint(64,0) | YES |  |
| `previous_private_provider` | bool | YES | false |
| `previous_pp_name` | text | YES |  |
| `interest_description` | text | YES |  |
| `licensed` | bool | YES | false |
| `has_website` | bool | YES | false |
| `tech_savvy_id` | uuid | YES |  |
| `organization_id` | uuid | YES |  |
| `referral_source_id` | uuid | YES |  |
| `interest_id` | uuid | YES |  |
| `account_type_id` | uuid | YES |  |
| `annual_revenue_id` | uuid | YES |  |
| `client_stage_id` | uuid | YES |  |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### companies__building_departments

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `company_id` | uuid | NO |  |
| `building_department_id` | uuid | NO |  |
| `created_at` | timestamptz | NO | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### companies__contacts

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `company_id` | uuid | NO |  |
| `contact_id` | uuid | NO |  |
| `created_at` | timestamptz | NO | now() |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### companies__industry_roles

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `company_id` | uuid | NO |  |
| `created_at` | timestamptz | NO | now() |
| `industry_role_id` | uuid | YES |  |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### companies__permit_expediting

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | gen_random_uuid() |
| `company_id` | uuid | NO |  |
| `permit_expediting_id` | uuid | NO |  |
| `created_at` | timestamptz | NO | now() |
| `updated_at` | timestamptz | YES | now() |
| `trade_id` | uuid | YES |  |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### companies__professional_licenses

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `company_id` | uuid | NO |  |
| `professional_license_id` | uuid | NO |  |
| `created_at` | timestamptz | NO | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### companies__services

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `company_id` | uuid | NO |  |
| `created_at` | timestamptz | NO | now() |
| `service_id` | uuid | YES |  |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### companies__subcontractors

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `company_id` | uuid | NO |  |
| `subcontractor_company_id` | uuid | NO |  |
| `created_at` | timestamptz | NO | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### companies__tech_tools

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `company_id` | uuid | NO |  |
| `id` | uuid | NO | uuid_v7() |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |
| `tech_tool_id` | uuid | YES |  |

#### companies__work_types

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `company_id` | uuid | NO |  |
| `created_at` | timestamptz | NO | now() |
| `service_id` | uuid | YES |  |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |
| `work_type_id` | uuid | YES |  |
| `updated_at` | timestamptz | YES | now() |

#### companies_account_type_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `color` | text | YES |  |
| `id` | uuid | NO | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### companies_annual_revenue_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | YES |  |
| `id` | uuid | NO | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### companies_client_stage_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `color` | text | YES |  |
| `id` | uuid | NO | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### companies_industry_role_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `color` | text | YES |  |
| `id` | uuid | NO | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### companies_interest_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | integer(32,0) | NO | AUTO_INCREMENT |
| `name` | text | YES |  |
| `description` | text | YES |  |
| `id_uuid` | uuid | YES | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### companies_organization_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | integer(32,0) | NO | AUTO_INCREMENT |
| `name` | text | YES |  |
| `helper_text` | text | YES |  |
| `id_uuid` | uuid | YES | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### companies_referral_source_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | integer(32,0) | NO | AUTO_INCREMENT |
| `name` | text | YES |  |
| `id_uuid` | uuid | YES | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### companies_tech_savvy_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | integer(32,0) | NO | AUTO_INCREMENT |
| `name` | text | YES |  |
| `helper_text` | text | YES |  |
| `id_uuid` | uuid | YES | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### companies_tech_tools_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | integer(32,0) | NO | AUTO_INCREMENT |
| `name` | text | YES |  |
| `helper_text` | text | YES |  |
| `id_uuid` | uuid | YES | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### companies_work_types_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | bigint(64,0) | NO |  |
| `name` | text | YES |  |
| `created_at` | timestamptz | NO | now() |
| `description` | text | YES |  |
| `id_uuid` | uuid | YES | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### construction_types

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | YES |  |
| `id` | uuid | NO | uuid_v7() |
| `occupancy_id` | uuid | YES |  |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### construction_types__project_types

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | gen_random_uuid() |
| `created_at` | timestamptz | NO | now() |
| `construction_type_id` | uuid | YES |  |
| `project_type_id` | uuid | YES |  |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### contacts

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `created_at` | timestamptz | NO | now() |
| `updated_at` | timestamptz | NO | now() |
| `first_name` | text | YES |  |
| `last_name` | text | YES |  |
| `email` | text | YES |  |
| `phone` | text | YES |  |
| `phone_extension` | text | YES |  |
| `contact_type_id` | uuid | YES |  |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### contacts__building_departments

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `contact_id` | uuid | NO |  |
| `building_department_id` | uuid | NO |  |
| `created_at` | timestamptz | NO | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### contacts__projects

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `contact_id` | uuid | NO |  |
| `project_id` | uuid | NO |  |
| `created_at` | timestamptz | NO | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### contacts_type_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `color` | text | YES |  |
| `id` | integer(32,0) | NO | AUTO_INCREMENT |
| `id_uuid` | uuid | YES | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### deal_phase_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | integer(32,0) | NO | AUTO_INCREMENT |
| `name` | text | YES |  |
| `id_uuid` | uuid | YES | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### deal_qualification_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | integer(32,0) | NO | AUTO_INCREMENT |
| `name` | text | YES |  |
| `id_uuid` | uuid | YES | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### deals

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |
| `title` | text | YES |  |
| `company_id` | uuid | YES |  |
| `primary_contact_id` | uuid | YES |  |
| `invoice_id` | uuid | YES |  |
| `loss_noncompete_reason` | text | YES |  |
| `id` | uuid | NO | uuid_v7() |
| `agreement_id` | uuid | YES |  |
| `deal_phase_id` | uuid | YES |  |
| `deal_qualification_id` | uuid | YES |  |
| `deleted_at` | timestamptz | YES |  |

#### deals__other_contacts

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `other_contact_id` | uuid | NO |  |
| `id` | uuid | NO | uuid_v7() |
| `deal_id` | uuid | NO |  |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### disciplines

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | YES |  |
| `id` | uuid | NO | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |
| `trade_id` | uuid | YES |  |

#### employee_users

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `department` | text | YES |  |
| `title` | text | YES |  |
| `manager_id` | uuid | YES |  |
| `created_at` | timestamptz | NO | now() |
| `updated_at` | timestamptz | NO | now() |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### files

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `filename` | text | NO |  |
| `file_type` | text | YES |  |
| `size_bytes` | bigint(64,0) | YES |  |
| `bucket` | text | YES |  |
| `object_key` | text | YES |  |
| `url` | text | YES |  |
| `metadata` | jsonb | YES |  |
| `created_at` | timestamptz | NO | now() |
| `updated_at` | timestamptz | NO | now() |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |
| `deleted_at` | timestamptz | YES |  |

#### inspection_modes

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | YES |  |
| `id` | uuid | NO | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### inspection_sessions

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `created_at` | timestamptz | NO | now() |
| `updated_at` | timestamptz | NO | now() |
| `project_id` | uuid | YES |  |
| `inspection_contact_id` | uuid | YES |  |
| `inspection_number` | integer(32,0) | YES |  |
| `inspector_id` | uuid | YES |  |
| `inspection_mode_id` | uuid | YES |  |
| `session_status_id` | uuid | YES |  |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### inspection_sessions__contacts

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `contact_id` | uuid | NO |  |
| `inspection_session_id` | uuid | NO |  |
| `created_at` | timestamptz | NO | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### inspection_sessions__project_media

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `inspection_session_id` | uuid | NO |  |
| `project_media_id` | uuid | YES |  |
| `created_at` | timestamptz | NO | now() |
| `version` | integer(32,0) | YES | 1 |
| `preview_version_file_id` | uuid | YES |  |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### inspection_sessions_status_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `color` | text | YES |  |
| `id` | uuid | NO | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### inspections

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `created_at` | timestamptz | NO | now() |
| `updated_at` | timestamptz | NO | now() |
| `inspection_session_id` | uuid | YES |  |
| `inspection_type_id` | uuid | YES |  |
| `project_id` | uuid | YES |  |
| `result_id` | uuid | YES |  |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### inspections_result_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `color` | text | YES |  |
| `id` | uuid | NO | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### invoice_line_items

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `created_at` | timestamptz | NO | now() |
| `updated_at` | timestamptz | NO | now() |
| `service_id` | uuid | YES |  |
| `project_id` | uuid | YES |  |
| `amount_cents` | bigint(64,0) | YES |  |
| `quantity_int` | integer(32,0) | YES |  |
| `quote_id` | uuid | YES |  |
| `invoice_id` | uuid | YES |  |
| `status_id` | uuid | YES |  |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### invoice_line_items_status_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `color` | text | YES |  |
| `id` | integer(32,0) | NO | AUTO_INCREMENT |
| `id_uuid` | uuid | YES | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### invoices

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `created_at` | timestamptz | NO | now() |
| `updated_at` | timestamptz | NO | now() |
| `amount_cents` | bigint(64,0) | YES |  |
| `open_balance_cents` | bigint(64,0) | YES |  |
| `invoice_number` | integer(32,0) | YES |  |
| `company_id` | uuid | YES |  |
| `deal_id` | uuid | YES |  |
| `collection_status_id` | uuid | YES |  |
| `payment_status_id` | uuid | YES |  |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### invoices_collection_status_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `color` | text | YES |  |
| `id` | integer(32,0) | NO | AUTO_INCREMENT |
| `id_uuid` | uuid | YES | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### invoices_payment_status_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `color` | text | YES |  |
| `id` | integer(32,0) | NO | AUTO_INCREMENT |
| `id_uuid` | uuid | YES | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### issue_comments

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `created_at` | timestamptz | NO | now() |
| `updated_at` | timestamptz | NO | now() |
| `plan_review_id` | uuid | YES |  |
| `code_reference` | text | YES |  |
| `inspection_id` | uuid | YES |  |
| `comment` | text | YES |  |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### occupancies

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | YES |  |
| `id` | uuid | NO | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### payment_processors

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `name` | text | YES |  |
| `id` | uuid | NO | uuid_v7() |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |
| `deleted_at` | timestamptz | YES |  |

#### payments

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `amount_cents` | bigint(64,0) | YES |  |
| `payment_date` | date | YES |  |
| `deposit_date` | date | YES |  |
| `payment_method` | text | YES |  |
| `status` | text | YES |  |
| `memo` | text | YES |  |
| `processor_fee_amount_cents` | bigint(64,0) | YES |  |
| `net_amount_cents` | bigint(64,0) | YES |  |
| `id` | uuid | NO | uuid_v7() |
| `payment_processor_id` | uuid | YES |  |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### payments__invoices

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `invoice_id` | uuid | NO |  |
| `id` | uuid | NO | uuid_v7() |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |
| `payment_id` | uuid | YES |  |

#### permit_expediting

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `created_at` | timestamptz | NO | now() |
| `updated_at` | timestamptz | NO | now() |
| `project_value_cents` | bigint(64,0) | YES |  |
| `mechanical_trade_value_cents` | bigint(64,0) | YES |  |
| `electrical_trade_value_cents` | bigint(64,0) | YES |  |
| `plumbing_trade_value_cents` | bigint(64,0) | YES |  |
| `roofing_trade_value_cents` | bigint(64,0) | YES |  |
| `building_trade_value_int` | integer(32,0) | YES |  |
| `permit_number` | text | YES |  |
| `project_id` | uuid | YES |  |
| `document_completion_status_id` | uuid | YES |  |
| `noc_status_id` | uuid | YES |  |
| `ntbo_status_id` | uuid | YES |  |
| `permit_app_status_id` | uuid | YES |  |
| `private_provider_id` | uuid | YES |  |
| `permitting_status_id` | uuid | YES |  |
| `sub_form_id` | uuid | YES |  |
| `subcontractor_info_id` | uuid | YES |  |
| `workability_id` | uuid | YES |  |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### permit_expediting_document_status_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `color` | text | YES |  |
| `id` | integer(32,0) | NO | AUTO_INCREMENT |
| `id_uuid` | uuid | YES | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### permit_expediting_fees_status_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `color` | text | YES |  |
| `id` | uuid | NO | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### permit_expediting_noc_status_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `color` | text | YES |  |
| `id` | integer(32,0) | NO | AUTO_INCREMENT |
| `id_uuid` | uuid | YES | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### permit_expediting_ntbo_status_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `color` | text | YES |  |
| `id` | integer(32,0) | NO | AUTO_INCREMENT |
| `id_uuid` | uuid | YES | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### permit_expediting_permit_app_status_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `color` | text | YES |  |
| `id` | integer(32,0) | NO | AUTO_INCREMENT |
| `id_uuid` | uuid | YES | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### permit_expediting_private_provider_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `color` | text | YES |  |
| `id` | integer(32,0) | NO | AUTO_INCREMENT |
| `id_uuid` | uuid | YES | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### permit_expediting_status_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `color` | text | YES |  |
| `id` | integer(32,0) | NO | AUTO_INCREMENT |
| `id_uuid` | uuid | YES | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### permit_expediting_sub_form_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `color` | text | YES |  |
| `id` | integer(32,0) | NO | AUTO_INCREMENT |
| `id_uuid` | uuid | YES | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### permit_expediting_sub_permit_type_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `color` | text | YES |  |
| `id` | uuid | NO | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### permit_expediting_subcontractor_info_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `color` | text | YES |  |
| `id` | integer(32,0) | NO | AUTO_INCREMENT |
| `id_uuid` | uuid | YES | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### permit_expediting_workability_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `color` | text | YES |  |
| `id` | integer(32,0) | NO | AUTO_INCREMENT |
| `id_uuid` | uuid | YES | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### plan_review_result_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | YES |  |
| `id` | uuid | NO | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### plan_reviews

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `created_at` | timestamptz | NO | now() |
| `updated_at` | timestamptz | NO | now() |
| `plan_set_id` | uuid | YES |  |
| `plans_examiner_id` | uuid | YES |  |
| `discipline_id` | uuid | YES |  |
| `result_id` | uuid | YES |  |
| `status_id` | uuid | YES |  |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### plan_reviews_status_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `color` | text | YES |  |
| `id` | uuid | NO | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### plan_sets

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `created_at` | timestamptz | NO | now() |
| `updated_at` | timestamptz | NO | now() |
| `project_id` | uuid | YES |  |
| `document_review_status_id` | uuid | YES |  |
| `type_id` | uuid | YES |  |
| `working_set_id` | uuid | YES |  |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### plan_sets__files

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `created_at` | timestamptz | NO | now() |
| `updated_at` | timestamptz | NO | now() |
| `file_summary` | text | YES |  |
| `number_of_pages` | text | YES |  |
| `signer` | text | YES |  |
| `file_id` | uuid | YES |  |
| `plan_set_id` | uuid | YES |  |
| `previous_version_file_id` | uuid | YES |  |
| `version` | text | YES | '1'::text |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |
| `file_type_id` | uuid | YES |  |

#### plan_sets_document_review_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `color` | text | YES |  |
| `id` | uuid | NO | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### plan_sets_file_types

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `code` | text | NO |  |
| `name` | text | NO |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### plan_sets_type_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `color` | text | YES |  |
| `id` | uuid | NO | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### plan_sets_working_set_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `color` | text | YES |  |
| `id` | uuid | NO | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### price_list

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `created_at` | timestamptz | NO | now() |
| `updated_at` | timestamptz | NO | now() |
| `price_cents` | bigint(64,0) | YES |  |
| `agreement_id` | uuid | YES |  |
| `company_id` | uuid | YES |  |
| `service_id` | uuid | YES |  |
| `occupancy_id` | uuid | YES |  |
| `status_id` | uuid | YES |  |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |
| `construction_type_id` | uuid | YES |  |
| `project_type_id` | uuid | YES |  |

#### price_list_status_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `color` | text | YES |  |
| `id` | integer(32,0) | NO | AUTO_INCREMENT |
| `id_uuid` | uuid | YES | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### professional_licenses

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `created_at` | timestamptz | NO | now() |
| `updated_at` | timestamptz | NO | now() |
| `license_number` | text | YES |  |
| `license_identifier` | text | YES |  |
| `file_id` | uuid | YES |  |
| `license_holder_name` | text | YES |  |
| `issued_date` | date | YES |  |
| `expiration_date` | date | YES |  |
| `status_id` | uuid | YES |  |
| `license_type_id` | uuid | YES |  |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### professional_licenses__bcp_qualified_services

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `professional_license_id` | uuid | NO |  |
| `bcp_qualified_service_id` | uuid | NO |  |
| `created_at` | timestamptz | NO | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### professional_licenses_status_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `color` | text | YES |  |
| `id` | integer(32,0) | NO | AUTO_INCREMENT |
| `id_uuid` | uuid | YES | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### professional_licenses_type_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `color` | text | YES |  |
| `id` | integer(32,0) | NO | AUTO_INCREMENT |
| `id_uuid` | uuid | YES | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### project_media

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `created_at` | timestamptz | NO | now() |
| `updated_at` | timestamptz | NO | now() |
| `coordinates` | jsonb | YES |  |
| `folder_path` | text | YES |  |
| `file_id` | uuid | YES |  |
| `project_id` | uuid | YES |  |
| `upload_method_id` | uuid | YES |  |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |
| `location_geom` | geometry | YES |  |

#### project_media_upload_method_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `color` | text | YES |  |
| `id` | uuid | NO | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### project_phases

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `id` | integer(32,0) | NO | AUTO_INCREMENT |
| `id_uuid` | uuid | YES | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### project_phases_status_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | YES |  |
| `id` | integer(32,0) | NO | AUTO_INCREMENT |
| `id_uuid` | uuid | YES | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |
| `phase_id` | uuid | YES |  |

#### project_types

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | YES |  |
| `id` | uuid | NO | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |
| `construction_type_id` | uuid | YES |  |

#### projects

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `created_at` | timestamptz | NO | now() |
| `updated_at` | timestamptz | NO | now() |
| `building_department_id` | uuid | YES |  |
| `submitted_by_id` | uuid | YES |  |
| `company_id` | uuid | YES |  |
| `coordinates` | jsonb | YES |  |
| `has_legal_address` | bool | NO | true |
| `deleted` | bool | NO | false |
| `address_line1` | text | YES |  |
| `address_line2` | text | YES |  |
| `city` | text | YES |  |
| `state` | us_state | YES |  |
| `county` | text | YES |  |
| `zipcode` | text | YES |  |
| `country` | country | YES |  |
| `name` | text | YES |  |
| `needs_quote` | bool | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |
| `construction_type_id` | uuid | YES |  |
| `project_type_id` | uuid | YES |  |
| `occupancy_id` | uuid | YES |  |
| `phase_id` | uuid | YES |  |
| `status_id` | uuid | YES |  |
| `deleted_at` | timestamptz | YES |  |
| `location_geom` | geometry | YES |  |

#### projects__services

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `project_id` | uuid | NO |  |
| `created_at` | timestamptz | NO | now() |
| `service_id` | uuid | YES |  |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### quotes

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `created_at` | timestamptz | NO | now() |
| `updated_at` | timestamptz | NO | now() |
| `project_id` | uuid | YES |  |
| `price_cents` | bigint(64,0) | YES |  |
| `quote_number` | bigint(64,0) | YES |  |
| `link` | text | YES |  |
| `sent_date` | date | YES |  |
| `expiration_date` | date | YES |  |
| `completed_date` | date | YES |  |
| `quote_status_id` | uuid | YES |  |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### quotes_status_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `color` | text | YES |  |
| `id` | integer(32,0) | NO | AUTO_INCREMENT |
| `id_uuid` | uuid | YES | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### rls_permissions

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `table_name` | text | NO |  |
| `role_code` | text | NO |  |
| `can_select` | bool | YES | false |
| `can_insert` | bool | YES | false |
| `can_update` | bool | YES | false |
| `can_delete` | bool | YES | false |
| `scoping_type` | text | YES | 'none'::text |
| `disabled_at` | timestamptz | YES |  |
| `notes` | text | YES |  |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `id` | uuid | NO | uuid_v7() |
| `app_id` | uuid | YES |  |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### rls_permissions_audit

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `table_name` | text | NO |  |
| `role_code` | text | NO |  |
| `can_select` | bool | YES | false |
| `can_insert` | bool | YES | false |
| `can_update` | bool | YES | false |
| `can_delete` | bool | YES | false |
| `scoping_type` | text | YES | 'none'::text |
| `disabled_at` | timestamptz | YES |  |
| `notes` | text | YES |  |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `action` | text | NO |  |
| `actor_id` | uuid | YES |  |
| `changed_at` | timestamptz | YES | now() |
| `id` | uuid | NO | uuid_v7() |
| `permission_id` | uuid | YES |  |
| `app_id` | uuid | YES |  |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### roles

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `code` | text | NO |  |
| `name` | text | NO |  |
| `description` | text | YES |  |
| `id` | uuid | YES | uuid_v7() |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### services

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `id_uuid` | uuid | YES | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |
| `id` | uuid | NO | uuid_v7() |
| `service_type_id` | uuid | YES |  |

#### services__deals

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `deal_id` | uuid | YES |  |
| `service_id` | uuid | YES |  |
| `id` | uuid | NO | uuid_v7() |
| `created_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### services_type_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | YES |  |
| `id` | integer(32,0) | NO | AUTO_INCREMENT |
| `id_uuid` | uuid | NO | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### spatial_ref_sys

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `srid` | integer(32,0) | NO |  |
| `auth_name` | character varying(256) | YES |  |
| `auth_srid` | integer(32,0) | YES |  |
| `srtext` | character varying(2048) | YES |  |
| `proj4text` | character varying(2048) | YES |  |

#### standard_inspection_types

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | YES |  |
| `notes` | text | YES |  |
| `id` | uuid | NO | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |
| `trade_id` | uuid | YES |  |

#### standard_inspection_types__inspection_modes

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `created_at` | timestamptz | NO | now() |
| `standard_inspection_type_id` | uuid | YES |  |
| `inspection_mode_id` | uuid | YES |  |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |

#### test_records

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | bigint(64,0) | NO | AUTO_INCREMENT |
| `run_id` | uuid | NO |  |
| `scenario_id` | uuid | NO |  |
| `table_name` | text | NO |  |
| `table_id` | text | YES |  |
| `record_id` | uuid | NO |  |
| `created_at` | timestamptz | NO | now() |
| `created_by` | uuid | YES |  |

#### test_runs

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | gen_random_uuid() |
| `scenario_id` | uuid | NO |  |
| `run_at` | timestamptz | NO | now() |
| `run_by` | uuid | YES |  |
| `purged_at` | timestamptz | YES |  |
| `purged_by` | uuid | YES |  |
| `purge_reason` | text | YES |  |

#### test_scenarios

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | gen_random_uuid() |
| `name` | text | NO |  |
| `description` | text | YES |  |
| `call_function` | text | NO |  |
| `active` | bool | NO | true |
| `metadata` | jsonb | NO | '{}'::jsonb |
| `created_at` | timestamptz | NO | now() |
| `created_by` | uuid | YES |  |

#### threads

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | gen_random_uuid() |
| `target_id` | uuid | NO |  |
| `target_type` | text | NO |  |
| `created_by` | uuid | NO |  |
| `created_at` | timestamptz | NO | now() |
| `last_activity_at` | timestamptz | NO | now() |
| `comment_count` | integer(32,0) | NO | 0 |
| `is_resolved` | bool | NO | false |
| `resolved_at` | timestamptz | YES |  |
| `resolved_by` | uuid | YES |  |
| `is_closed` | bool | NO | false |
| `closed_at` | timestamptz | YES |  |
| `closed_by` | uuid | YES |  |
| `closure_message` | text | YES |  |
| `reopened_at` | timestamptz | YES |  |
| `reopened_by` | uuid | YES |  |
| `reopening_message` | text | YES |  |

#### trades

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | YES |  |
| `permit_expediting_id` | uuid | YES |  |
| `id` | uuid | NO | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

#### user_profiles

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `id` | uuid | NO | uuid_v7() |
| `created_at` | timestamptz | NO | now() |
| `updated_at` | timestamptz | NO | now() |
| `contact_id` | uuid | YES |  |
| `role_code` | text | YES |  |
| `app_id` | uuid | YES |  |
| `status_id` | uuid | YES |  |
| `deleted_at` | timestamptz | YES |  |
| `created_by` | uuid | YES |  |
| `updated_by` | uuid | YES |  |
| `mimic_role_code` | text | YES |  |
| `mimic_app_id` | uuid | YES |  |

#### user_profiles_status_field

| Column Name | Data Type | Nullable | Default |
|-------------|-----------|----------|---------|
| `name` | text | NO |  |
| `color` | text | YES |  |
| `id` | integer(32,0) | NO | AUTO_INCREMENT |
| `id_uuid` | uuid | YES | uuid_v7() |
| `code` | text | YES |  |
| `active` | bool | YES | true |
| `created_at` | timestamptz | YES | now() |
| `updated_at` | timestamptz | YES | now() |
| `deleted_at` | timestamptz | YES |  |

---

## Foreign Key Relationships

| Table | Column | References Table | References Column |
|-------|--------|------------------|-------------------|
| `agreements` | `company_id` | `companies` | `id` |
| `agreements` | `company_id` | `companies` | `id` |
| `agreements` | `status_id` | `agreements_status_field` | `id` |
| `apps__roles` | `app_id` | `apps` | `id` |
| `apps__roles` | `role_code` | `roles` | `code` |
| `bcp` | `availability_id` | `bcp_availability_field` | `id` |
| `bcp` | `contact_id` | `contacts` | `id` |
| `bcp` | `inspector_license_id` | `professional_licenses` | `id` |
| `bcp` | `photo_file_id` | `files` | `id` |
| `bcp` | `plan_review_license_id` | `professional_licenses` | `id` |
| `bcp` | `private_provider_license_id` | `professional_licenses` | `id` |
| `bcp` | `resume_file_id` | `files` | `id` |
| `bcp` | `signature_file_id` | `files` | `id` |
| `bcp` | `user_profile_id` | `user_profiles` | `id` |
| `bd_inspection_types` | `building_department_id` | `building_departments` | `id` |
| `bd_inspection_types` | `building_department_id` | `building_departments` | `id` |
| `bd_inspection_types` | `standard_inspection_type_id` | `standard_inspection_types` | `id` |
| `building_departments` | `registration_status_id` | `building_departments_registration_status_field` | `id` |
| `building_departments__bcp` | `bcp_id` | `bcp` | `id` |
| `building_departments__bcp` | `building_department_id` | `building_departments` | `id` |
| `client_users` | `company_id` | `companies` | `id` |
| `client_users` | `id` | `user_profiles` | `id` |
| `companies` | `account_type_id` | `companies_account_type_field` | `id` |
| `companies` | `annual_revenue_id` | `companies_annual_revenue_field` | `id` |
| `companies` | `client_stage_id` | `companies_client_stage_field` | `id` |
| `companies` | `interest_id` | `companies_interest_field` | `id_uuid` |
| `companies` | `organization_id` | `companies_organization_field` | `id_uuid` |
| `companies` | `referral_source_id` | `companies_referral_source_field` | `id_uuid` |
| `companies` | `tech_savvy_id` | `companies_tech_savvy_field` | `id_uuid` |
| `companies__building_departments` | `building_department_id` | `building_departments` | `id` |
| `companies__building_departments` | `company_id` | `companies` | `id` |
| `companies__contacts` | `company_id` | `companies` | `id` |
| `companies__contacts` | `contact_id` | `contacts` | `id` |
| `companies__industry_roles` | `company_id` | `companies` | `id` |
| `companies__industry_roles` | `industry_role_id` | `companies_industry_role_field` | `id` |
| `companies__permit_expediting` | `company_id` | `companies` | `id` |
| `companies__permit_expediting` | `company_id` | `companies` | `id` |
| `companies__permit_expediting` | `permit_expediting_id` | `permit_expediting` | `id` |
| `companies__permit_expediting` | `permit_expediting_id` | `permit_expediting` | `id` |
| `companies__permit_expediting` | `trade_id` | `trades` | `id` |
| `companies__professional_licenses` | `company_id` | `companies` | `id` |
| `companies__professional_licenses` | `professional_license_id` | `professional_licenses` | `id` |
| `companies__services` | `company_id` | `companies` | `id` |
| `companies__services` | `service_id` | `services` | `id` |
| `companies__subcontractors` | `company_id` | `companies` | `id` |
| `companies__subcontractors` | `subcontractor_company_id` | `companies` | `id` |
| `companies__subcontractors` | `subcontractor_company_id` | `companies` | `id` |
| `companies__tech_tools` | `company_id` | `companies` | `id` |
| `companies__tech_tools` | `company_id` | `companies` | `id` |
| `companies__tech_tools` | `tech_tool_id` | `companies_tech_tools_field` | `id_uuid` |
| `companies__work_types` | `company_id` | `companies` | `id` |
| `companies__work_types` | `service_id` | `services` | `id` |
| `companies__work_types` | `work_type_id` | `companies_work_types_field` | `id_uuid` |
| `construction_types` | `occupancy_id` | `occupancies` | `id` |
| `construction_types__project_types` | `construction_type_id` | `construction_types` | `id` |
| `construction_types__project_types` | `project_type_id` | `project_types` | `id` |
| `contacts` | `contact_type_id` | `contacts_type_field` | `id_uuid` |
| `contacts__building_departments` | `building_department_id` | `building_departments` | `id` |
| `contacts__building_departments` | `contact_id` | `contacts` | `id` |
| `contacts__projects` | `contact_id` | `contacts` | `id` |
| `contacts__projects` | `project_id` | `projects` | `id` |
| `deals` | `agreement_id` | `agreements` | `id` |
| `deals` | `agreement_id` | `agreements` | `id` |
| `deals` | `company_id` | `companies` | `id` |
| `deals` | `company_id` | `companies` | `id` |
| `deals` | `deal_phase_id` | `deal_phase_field` | `id_uuid` |
| `deals` | `deal_qualification_id` | `deal_qualification_field` | `id_uuid` |
| `deals` | `invoice_id` | `invoices` | `id` |
| `deals` | `primary_contact_id` | `contacts` | `id` |
| `deals` | `primary_contact_id` | `contacts` | `id` |
| `deals__other_contacts` | `deal_id` | `deals` | `id` |
| `deals__other_contacts` | `other_contact_id` | `contacts` | `id` |
| `disciplines` | `trade_id` | `trades` | `id` |
| `employee_users` | `id` | `user_profiles` | `id` |
| `employee_users` | `manager_id` | `employee_users` | `id` |
| `inspection_sessions` | `inspection_contact_id` | `contacts` | `id` |
| `inspection_sessions` | `inspection_mode_id` | `inspection_modes` | `id` |
| `inspection_sessions` | `inspector_id` | `bcp` | `id` |
| `inspection_sessions` | `project_id` | `projects` | `id` |
| `inspection_sessions` | `session_status_id` | `inspection_sessions_status_field` | `id` |
| `inspection_sessions__contacts` | `contact_id` | `contacts` | `id` |
| `inspection_sessions__contacts` | `inspection_session_id` | `inspection_sessions` | `id` |
| `inspection_sessions__project_media` | `inspection_session_id` | `inspection_sessions` | `id` |
| `inspection_sessions__project_media` | `preview_version_file_id` | `project_media` | `id` |
| `inspection_sessions__project_media` | `project_media_id` | `project_media` | `id` |
| `inspections` | `inspection_session_id` | `inspection_sessions` | `id` |
| `inspections` | `inspection_type_id` | `bd_inspection_types` | `id` |
| `inspections` | `project_id` | `projects` | `id` |
| `inspections` | `result_id` | `inspections_result_field` | `id` |
| `invoice_line_items` | `invoice_id` | `invoices` | `id` |
| `invoice_line_items` | `project_id` | `projects` | `id` |
| `invoice_line_items` | `quote_id` | `quotes` | `id` |
| `invoice_line_items` | `quote_id` | `quotes` | `id` |
| `invoice_line_items` | `service_id` | `services` | `id` |
| `invoice_line_items` | `status_id` | `invoice_line_items_status_field` | `id_uuid` |
| `invoices` | `collection_status_id` | `invoices_collection_status_field` | `id_uuid` |
| `invoices` | `company_id` | `companies` | `id` |
| `invoices` | `deal_id` | `deals` | `id` |
| `invoices` | `payment_status_id` | `invoices_payment_status_field` | `id_uuid` |
| `issue_comments` | `inspection_id` | `inspections` | `id` |
| `issue_comments` | `plan_review_id` | `plan_reviews` | `id` |
| `payments` | `payment_processor_id` | `payment_processors` | `id` |
| `payments__invoices` | `invoice_id` | `invoices` | `id` |
| `payments__invoices` | `payment_id` | `payments` | `id` |
| `permit_expediting` | `document_completion_status_id` | `permit_expediting_document_status_field` | `id_uuid` |
| `permit_expediting` | `noc_status_id` | `permit_expediting_noc_status_field` | `id_uuid` |
| `permit_expediting` | `ntbo_status_id` | `permit_expediting_ntbo_status_field` | `id_uuid` |
| `permit_expediting` | `permit_app_status_id` | `permit_expediting_permit_app_status_field` | `id_uuid` |
| `permit_expediting` | `permitting_status_id` | `permit_expediting_status_field` | `id_uuid` |
| `permit_expediting` | `private_provider_id` | `permit_expediting_private_provider_field` | `id_uuid` |
| `permit_expediting` | `project_id` | `projects` | `id` |
| `permit_expediting` | `sub_form_id` | `permit_expediting_sub_form_field` | `id_uuid` |
| `permit_expediting` | `subcontractor_info_id` | `permit_expediting_subcontractor_info_field` | `id_uuid` |
| `permit_expediting` | `workability_id` | `permit_expediting_workability_field` | `id_uuid` |
| `plan_reviews` | `discipline_id` | `disciplines` | `id` |
| `plan_reviews` | `plan_set_id` | `plan_sets` | `id` |
| `plan_reviews` | `plans_examiner_id` | `bcp` | `id` |
| `plan_reviews` | `result_id` | `plan_review_result_field` | `id` |
| `plan_reviews` | `status_id` | `plan_reviews_status_field` | `id` |
| `plan_sets` | `document_review_status_id` | `plan_sets_document_review_field` | `id` |
| `plan_sets` | `project_id` | `projects` | `id` |
| `plan_sets` | `type_id` | `plan_sets_type_field` | `id` |
| `plan_sets` | `working_set_id` | `plan_sets_working_set_field` | `id` |
| `plan_sets__files` | `file_id` | `files` | `id` |
| `plan_sets__files` | `file_type_id` | `plan_sets_file_types` | `id` |
| `plan_sets__files` | `plan_set_id` | `plan_sets` | `id` |
| `plan_sets__files` | `previous_version_file_id` | `files` | `id` |
| `price_list` | `agreement_id` | `agreements` | `id` |
| `price_list` | `company_id` | `companies` | `id` |
| `price_list` | `construction_type_id` | `construction_types` | `id` |
| `price_list` | `occupancy_id` | `occupancies` | `id` |
| `price_list` | `project_type_id` | `project_types` | `id` |
| `price_list` | `service_id` | `services` | `id` |
| `price_list` | `status_id` | `price_list_status_field` | `id_uuid` |
| `professional_licenses` | `file_id` | `files` | `id` |
| `professional_licenses` | `license_type_id` | `professional_licenses_type_field` | `id_uuid` |
| `professional_licenses` | `status_id` | `professional_licenses_status_field` | `id_uuid` |
| `professional_licenses__bcp_qualified_services` | `bcp_qualified_service_id` | `bcp_qualified_services` | `id` |
| `professional_licenses__bcp_qualified_services` | `professional_license_id` | `professional_licenses` | `id` |
| `project_media` | `file_id` | `files` | `id` |
| `project_media` | `file_id` | `files` | `id` |
| `project_media` | `project_id` | `projects` | `id` |
| `project_media` | `project_id` | `projects` | `id` |
| `project_media` | `upload_method_id` | `project_media_upload_method_field` | `id` |
| `project_phases_status_field` | `phase_id` | `project_phases` | `id_uuid` |
| `project_types` | `construction_type_id` | `construction_types` | `id` |
| `projects` | `building_department_id` | `building_departments` | `id` |
| `projects` | `company_id` | `companies` | `id` |
| `projects` | `construction_type_id` | `construction_types` | `id` |
| `projects` | `occupancy_id` | `occupancies` | `id` |
| `projects` | `phase_id` | `project_phases` | `id_uuid` |
| `projects` | `project_type_id` | `project_types` | `id` |
| `projects` | `status_id` | `project_phases_status_field` | `id_uuid` |
| `projects` | `submitted_by_id` | `contacts` | `id` |
| `projects__services` | `project_id` | `projects` | `id` |
| `projects__services` | `service_id` | `services` | `id` |
| `quotes` | `project_id` | `projects` | `id` |
| `quotes` | `quote_status_id` | `quotes_status_field` | `id_uuid` |
| `rls_permissions` | `app_id` | `apps` | `id` |
| `rls_permissions` | `role_code` | `roles` | `code` |
| `rls_permissions_audit` | `app_id` | `apps` | `id` |
| `rls_permissions_audit` | `permission_id` | `rls_permissions` | `id` |
| `services` | `service_type_id` | `services_type_field` | `id_uuid` |
| `services__deals` | `deal_id` | `deals` | `id` |
| `services__deals` | `service_id` | `services` | `id` |
| `standard_inspection_types` | `trade_id` | `trades` | `id` |
| `standard_inspection_types__inspection_modes` | `inspection_mode_id` | `inspection_modes` | `id` |
| `standard_inspection_types__inspection_modes` | `standard_inspection_type_id` | `standard_inspection_types` | `id` |
| `test_records` | `run_id` | `test_runs` | `id` |
| `test_records` | `scenario_id` | `test_scenarios` | `id` |
| `test_runs` | `scenario_id` | `test_scenarios` | `id` |
| `trades` | `permit_expediting_id` | `permit_expediting` | `id` |
| `user_profiles` | `app_id` | `apps` | `id` |
| `user_profiles` | `contact_id` | `contacts` | `id` |
| `user_profiles` | `mimic_app_id` | `apps` | `id` |
| `user_profiles` | `mimic_role_code` | `roles` | `code` |
| `user_profiles` | `role_code` | `roles` | `code` |
| `user_profiles` | `status_id` | `user_profiles_status_field` | `id_uuid` |

---

## Indexes

### Public Schema Indexes

| Table | Index Name | Definition |
|-------|------------|------------|
| `activity_log` | `activity_log_pkey` | CREATE UNIQUE INDEX activity_log_pkey ON public.activity_log USING btree (id) |
| `activity_log` | `idx_activity_log_action` | CREATE INDEX idx_activity_log_action ON public.activity_log USING btree (action) |
| `activity_log` | `idx_activity_log_actor_id` | CREATE INDEX idx_activity_log_actor_id ON public.activity_log USING btree (actor_id) |
| `activity_log` | `idx_activity_log_target` | CREATE INDEX idx_activity_log_target ON public.activity_log USING btree (target_table, target_id) |
| `agreements` | `agreements_pkey` | CREATE UNIQUE INDEX agreements_pkey ON public.agreements USING btree (id) |
| `agreements` | `idx_agreements__company_id` | CREATE INDEX idx_agreements__company_id ON public.agreements USING btree (company_id) WHERE (deleted_at IS NULL) |
| `agreements` | `idx_agreements__deleted_at` | CREATE INDEX idx_agreements__deleted_at ON public.agreements USING btree (deleted_at) |
| `agreements` | `idx_agreements__status_id` | CREATE INDEX idx_agreements__status_id ON public.agreements USING btree (status_id) WHERE (deleted_at IS NULL) |
| `agreements_status_field` | `agreements_status_field_pkey` | CREATE UNIQUE INDEX agreements_status_field_pkey ON public.agreements_status_field USING btree (id) |
| `agreements_status_field` | `uq_agreements_status_field__code` | CREATE UNIQUE INDEX uq_agreements_status_field__code ON public.agreements_status_field USING btree (code) WHERE (deleted_at IS NULL) |
| `apps` | `apps_pkey` | CREATE UNIQUE INDEX apps_pkey ON public.apps USING btree (id) |
| `apps` | `idx_apps_api_key` | CREATE UNIQUE INDEX idx_apps_api_key ON public.apps USING btree (api_key) WHERE (api_key IS NOT NULL) |
| `apps` | `uq_apps__api_key` | CREATE UNIQUE INDEX uq_apps__api_key ON public.apps USING btree (api_key) WHERE (deleted_at IS NULL) |
| `apps` | `uq_apps__code` | CREATE UNIQUE INDEX uq_apps__code ON public.apps USING btree (code) WHERE (deleted_at IS NULL) |
| `apps__roles` | `apps__roles_pkey` | CREATE UNIQUE INDEX apps__roles_pkey ON public.apps__roles USING btree (id) |
| `apps__roles` | `uq_apps__roles__app_id__role_code` | CREATE UNIQUE INDEX uq_apps__roles__app_id__role_code ON public.apps__roles USING btree (app_id, role_code) WHERE (deleted_at IS NULL) |
| `bcp` | `building_code_professionals_pkey` | CREATE UNIQUE INDEX building_code_professionals_pkey ON public.bcp USING btree (id) |
| `bcp` | `idx_bcp__availability_id` | CREATE INDEX idx_bcp__availability_id ON public.bcp USING btree (availability_id) WHERE (deleted_at IS NULL) |
| `bcp` | `idx_bcp__contact_id` | CREATE INDEX idx_bcp__contact_id ON public.bcp USING btree (contact_id) WHERE (deleted_at IS NULL) |
| `bcp` | `idx_bcp__deleted_at` | CREATE INDEX idx_bcp__deleted_at ON public.bcp USING btree (deleted_at) |
| `bcp` | `idx_bcp__photo_file_id` | CREATE INDEX idx_bcp__photo_file_id ON public.bcp USING btree (photo_file_id) WHERE (deleted_at IS NULL) |
| `bcp` | `idx_bcp__resume_file_id` | CREATE INDEX idx_bcp__resume_file_id ON public.bcp USING btree (resume_file_id) WHERE (deleted_at IS NULL) |
| `bcp` | `idx_bcp__signature_file_id` | CREATE INDEX idx_bcp__signature_file_id ON public.bcp USING btree (signature_file_id) WHERE (deleted_at IS NULL) |
| `bcp` | `idx_bcp__user_profile_id` | CREATE INDEX idx_bcp__user_profile_id ON public.bcp USING btree (user_profile_id) WHERE (deleted_at IS NULL) |
| `bcp_availability_field` | `bcp_availability_field_pkey` | CREATE UNIQUE INDEX bcp_availability_field_pkey ON public.bcp_availability_field USING btree (id) |
| `bcp_availability_field` | `uq_bcp_availability_field__code` | CREATE UNIQUE INDEX uq_bcp_availability_field__code ON public.bcp_availability_field USING btree (code) WHERE (deleted_at IS NULL) |
| `bcp_qualified_services` | `bcp_qualified_services_pkey` | CREATE UNIQUE INDEX bcp_qualified_services_pkey ON public.bcp_qualified_services USING btree (id) |
| `bcp_qualified_services` | `uq_bcp_qualified_services__code` | CREATE UNIQUE INDEX uq_bcp_qualified_services__code ON public.bcp_qualified_services USING btree (lower(code)) WHERE ((deleted_at IS NULL) AND (code IS NOT NULL)) |
| `bcp_qualified_services` | `uq_bcp_qualified_services__name` | CREATE UNIQUE INDEX uq_bcp_qualified_services__name ON public.bcp_qualified_services USING btree (lower(name)) WHERE ((deleted_at IS NULL) AND (name IS NOT NULL)) |
| `bd_inspection_types` | `bd_inspection_types_dept_name_uniq` | CREATE UNIQUE INDEX bd_inspection_types_dept_name_uniq ON public.bd_inspection_types USING btree (building_department_id, value) WHERE ((building_department_id IS NOT NULL) AND (value IS NOT NULL)) |
| `bd_inspection_types` | `bd_inspection_types_pkey` | CREATE UNIQUE INDEX bd_inspection_types_pkey ON public.bd_inspection_types USING btree (id) |
| `bd_inspection_types` | `idx_bd_inspection_types__standard_inspection_type_id` | CREATE INDEX idx_bd_inspection_types__standard_inspection_type_id ON public.bd_inspection_types USING btree (standard_inspection_type_id) WHERE (deleted_at IS NULL) |
| `building_departments` | `building_departments_pkey` | CREATE UNIQUE INDEX building_departments_pkey ON public.building_departments USING btree (id) |
| `building_departments` | `uq_building_departments__code` | CREATE UNIQUE INDEX uq_building_departments__code ON public.building_departments USING btree (lower(code)) WHERE ((deleted_at IS NULL) AND (code IS NOT NULL)) |
| `building_departments` | `uq_building_departments__name` | CREATE UNIQUE INDEX uq_building_departments__name ON public.building_departments USING btree (lower(name)) WHERE ((deleted_at IS NULL) AND (name IS NOT NULL)) |
| `building_departments__bcp` | `building_departments__bcp_pkey` | CREATE UNIQUE INDEX building_departments__bcp_pkey ON public.building_departments__bcp USING btree (id) |
| `building_departments__bcp` | `idx_building_departments__bcp__bcp_id` | CREATE INDEX idx_building_departments__bcp__bcp_id ON public.building_departments__bcp USING btree (bcp_id) WHERE (deleted_at IS NULL) |
| `building_departments__bcp` | `idx_building_departments__bcp__building_department_id` | CREATE INDEX idx_building_departments__bcp__building_department_id ON public.building_departments__bcp USING btree (building_department_id) WHERE (deleted_at IS NULL) |
| `building_departments__bcp` | `uq_building_departments__bcp__building_department_id__bcp_id` | CREATE UNIQUE INDEX uq_building_departments__bcp__building_department_id__bcp_id ON public.building_departments__bcp USING btree (building_department_id, bcp_id) WHERE (deleted_at IS NULL) |
| `building_departments_registration_status_field` | `building_departments_registration_status_field_pkey` | CREATE UNIQUE INDEX building_departments_registration_status_field_pkey ON public.building_departments_registration_status_field USING btree (id) |
| `building_departments_registration_status_field` | `uq_building_departments_registration_status_field__code` | CREATE UNIQUE INDEX uq_building_departments_registration_status_field__code ON public.building_departments_registration_status_field USING btree (code) WHERE (deleted_at IS NULL) |
| `client_users` | `clientUsers_pkey` | CREATE UNIQUE INDEX "clientUsers_pkey" ON public.client_users USING btree (id) |
| `client_users` | `idx_client_users__company_id` | CREATE INDEX idx_client_users__company_id ON public.client_users USING btree (company_id) WHERE (deleted_at IS NULL) |
| `client_users` | `idx_client_users__deleted_at` | CREATE INDEX idx_client_users__deleted_at ON public.client_users USING btree (deleted_at) |
| `companies` | `companies_pkey` | CREATE UNIQUE INDEX companies_pkey ON public.companies USING btree (id) |
| `companies` | `idx_companies__account_type_id` | CREATE INDEX idx_companies__account_type_id ON public.companies USING btree (account_type_id) WHERE (deleted_at IS NULL) |
| `companies` | `idx_companies__annual_revenue_id` | CREATE INDEX idx_companies__annual_revenue_id ON public.companies USING btree (annual_revenue_id) WHERE (deleted_at IS NULL) |
| `companies` | `idx_companies__client_stage_id` | CREATE INDEX idx_companies__client_stage_id ON public.companies USING btree (client_stage_id) WHERE (deleted_at IS NULL) |
| `companies` | `idx_companies__deleted_at` | CREATE INDEX idx_companies__deleted_at ON public.companies USING btree (deleted_at) |
| `companies` | `idx_companies__interest_id` | CREATE INDEX idx_companies__interest_id ON public.companies USING btree (interest_id) WHERE (deleted_at IS NULL) |
| `companies` | `idx_companies__organization_id` | CREATE INDEX idx_companies__organization_id ON public.companies USING btree (organization_id) WHERE (deleted_at IS NULL) |
| `companies` | `idx_companies__referral_source_id` | CREATE INDEX idx_companies__referral_source_id ON public.companies USING btree (referral_source_id) WHERE (deleted_at IS NULL) |
| `companies` | `idx_companies__tech_savvy_id` | CREATE INDEX idx_companies__tech_savvy_id ON public.companies USING btree (tech_savvy_id) WHERE (deleted_at IS NULL) |
| `companies__building_departments` | `companies__building_departments_pkey` | CREATE UNIQUE INDEX companies__building_departments_pkey ON public.companies__building_departments USING btree (id) |
| `companies__building_departments` | `idx_companies__building_departments__building_department_id` | CREATE INDEX idx_companies__building_departments__building_department_id ON public.companies__building_departments USING btree (building_department_id) WHERE (deleted_at IS NULL) |
| `companies__building_departments` | `uq_companies__building_departments__company_id__building_depart` | CREATE UNIQUE INDEX uq_companies__building_departments__company_id__building_depart ON public.companies__building_departments USING btree (company_id, building_department_id) WHERE (deleted_at IS N... |
| `companies__contacts` | `companies__contacts_pkey` | CREATE UNIQUE INDEX companies__contacts_pkey ON public.companies__contacts USING btree (id) |
| `companies__contacts` | `companies__contacts_uniq` | CREATE UNIQUE INDEX companies__contacts_uniq ON public.companies__contacts USING btree (company_id, contact_id) |
| `companies__contacts` | `idx_companies__contacts__company_id` | CREATE INDEX idx_companies__contacts__company_id ON public.companies__contacts USING btree (company_id) WHERE (deleted_at IS NULL) |
| `companies__contacts` | `idx_companies__contacts__contact_id` | CREATE INDEX idx_companies__contacts__contact_id ON public.companies__contacts USING btree (contact_id) WHERE (deleted_at IS NULL) |
| `companies__contacts` | `idx_companies__contacts__deleted_at` | CREATE INDEX idx_companies__contacts__deleted_at ON public.companies__contacts USING btree (deleted_at) |
| `companies__industry_roles` | `companies__industry_roles_pkey` | CREATE UNIQUE INDEX companies__industry_roles_pkey ON public.companies__industry_roles USING btree (id) |
| `companies__industry_roles` | `uq_companies__industry_roles__company_id__industry_role_id` | CREATE UNIQUE INDEX uq_companies__industry_roles__company_id__industry_role_id ON public.companies__industry_roles USING btree (company_id, industry_role_id) WHERE (deleted_at IS NULL) |
| `companies__permit_expediting` | `idx_companies__permit_expediting__trade_id` | CREATE INDEX idx_companies__permit_expediting__trade_id ON public.companies__permit_expediting USING btree (trade_id) WHERE (deleted_at IS NULL) |
| `companies__permit_expediting` | `idx_companies_permit_expedite__trade_id` | CREATE INDEX idx_companies_permit_expedite__trade_id ON public.companies__permit_expediting USING btree (trade_id) WHERE (deleted_at IS NULL) |
| `companies__permit_expediting` | `uq_companies__permit_expediting__company_id__permit_expediting_` | CREATE UNIQUE INDEX uq_companies__permit_expediting__company_id__permit_expediting_ ON public.companies__permit_expediting USING btree (company_id, permit_expediting_id) WHERE (deleted_at IS NULL) |
| `companies__permit_expediting` | `zjunction_companies_permit_expediting_pkey` | CREATE UNIQUE INDEX zjunction_companies_permit_expediting_pkey ON public.companies__permit_expediting USING btree (id) |
| `companies__professional_licenses` | `companies__professional_licenses_pkey` | CREATE UNIQUE INDEX companies__professional_licenses_pkey ON public.companies__professional_licenses USING btree (id) |
| `companies__professional_licenses` | `uq_companies__professional_licenses__company_id__professional_l` | CREATE UNIQUE INDEX uq_companies__professional_licenses__company_id__professional_l ON public.companies__professional_licenses USING btree (company_id, professional_license_id) WHERE (deleted_at IS... |
| `companies__services` | `companies__services_pkey` | CREATE UNIQUE INDEX companies__services_pkey ON public.companies__services USING btree (id) |
| `companies__services` | `idx_companies__services__deleted_at` | CREATE INDEX idx_companies__services__deleted_at ON public.companies__services USING btree (deleted_at) |
| `companies__services` | `uq_companies__services__company_id__service_id` | CREATE UNIQUE INDEX uq_companies__services__company_id__service_id ON public.companies__services USING btree (company_id, service_id) WHERE (deleted_at IS NULL) |
| `companies__subcontractors` | `companies__subcontractors_pkey` | CREATE UNIQUE INDEX companies__subcontractors_pkey ON public.companies__subcontractors USING btree (id) |
| `companies__subcontractors` | `uq_companies__subcontractors__company_id__subcontractor_company` | CREATE UNIQUE INDEX uq_companies__subcontractors__company_id__subcontractor_company ON public.companies__subcontractors USING btree (company_id, subcontractor_company_id) WHERE (deleted_at IS NULL) |
| `companies__tech_tools` | `companies__tech_tools_pkey` | CREATE UNIQUE INDEX companies__tech_tools_pkey ON public.companies__tech_tools USING btree (id) |
| `companies__tech_tools` | `fk_companies__companies_y658in2fdl` | CREATE INDEX fk_companies__companies_y658in2fdl ON public.companies__tech_tools USING btree (company_id) |
| `companies__tech_tools` | `uq_companies__tech_tools__company_id__tech_tool_id` | CREATE UNIQUE INDEX uq_companies__tech_tools__company_id__tech_tool_id ON public.companies__tech_tools USING btree (company_id, tech_tool_id) WHERE (deleted_at IS NULL) |
| `companies__work_types` | `companies__work_types_pkey` | CREATE UNIQUE INDEX companies__work_types_pkey ON public.companies__work_types USING btree (id) |
| `companies__work_types` | `idx_companies__work_types__deleted_at` | CREATE INDEX idx_companies__work_types__deleted_at ON public.companies__work_types USING btree (deleted_at) |
| `companies__work_types` | `idx_companies__work_types__service_id` | CREATE INDEX idx_companies__work_types__service_id ON public.companies__work_types USING btree (service_id) WHERE (deleted_at IS NULL) |
| `companies__work_types` | `uq_companies__work_types__company_id__work_type_id` | CREATE UNIQUE INDEX uq_companies__work_types__company_id__work_type_id ON public.companies__work_types USING btree (company_id, work_type_id) WHERE (deleted_at IS NULL) |
| `companies_account_type_field` | `companies_account_type_field_pkey` | CREATE UNIQUE INDEX companies_account_type_field_pkey ON public.companies_account_type_field USING btree (id) |
| `companies_account_type_field` | `uq_companies_account_type_field__code` | CREATE UNIQUE INDEX uq_companies_account_type_field__code ON public.companies_account_type_field USING btree (code) WHERE (deleted_at IS NULL) |
| `companies_annual_revenue_field` | `companies_annual_revenue_field_pkey` | CREATE UNIQUE INDEX companies_annual_revenue_field_pkey ON public.companies_annual_revenue_field USING btree (id) |
| `companies_annual_revenue_field` | `uq_companies_annual_revenue_field__code` | CREATE UNIQUE INDEX uq_companies_annual_revenue_field__code ON public.companies_annual_revenue_field USING btree (code) WHERE (deleted_at IS NULL) |
| `companies_client_stage_field` | `companies_client_stage_field_pkey` | CREATE UNIQUE INDEX companies_client_stage_field_pkey ON public.companies_client_stage_field USING btree (id) |
| `companies_client_stage_field` | `uq_companies_client_stage_field__code` | CREATE UNIQUE INDEX uq_companies_client_stage_field__code ON public.companies_client_stage_field USING btree (code) WHERE (deleted_at IS NULL) |
| `companies_industry_role_field` | `companies_industry_role_field_pkey` | CREATE UNIQUE INDEX companies_industry_role_field_pkey ON public.companies_industry_role_field USING btree (id) |
| `companies_industry_role_field` | `uq_companies_industry_role_field__code` | CREATE UNIQUE INDEX uq_companies_industry_role_field__code ON public.companies_industry_role_field USING btree (code) WHERE (deleted_at IS NULL) |
| `companies_interest_field` | `salesApplications_InterestField_pkey` | CREATE UNIQUE INDEX "salesApplications_InterestField_pkey" ON public.companies_interest_field USING btree (id) |
| `companies_interest_field` | `uq_companies_interest_field__code` | CREATE UNIQUE INDEX uq_companies_interest_field__code ON public.companies_interest_field USING btree (code) WHERE (deleted_at IS NULL) |
| `companies_interest_field` | `uq_companies_interest_field__id_uuid` | CREATE UNIQUE INDEX uq_companies_interest_field__id_uuid ON public.companies_interest_field USING btree (id_uuid) |
| `companies_organization_field` | `salesApplications_OrganizationField_pkey` | CREATE UNIQUE INDEX "salesApplications_OrganizationField_pkey" ON public.companies_organization_field USING btree (id) |
| `companies_organization_field` | `uq_companies_organization_field__code` | CREATE UNIQUE INDEX uq_companies_organization_field__code ON public.companies_organization_field USING btree (code) WHERE (deleted_at IS NULL) |
| `companies_organization_field` | `uq_companies_organization_field__id_uuid` | CREATE UNIQUE INDEX uq_companies_organization_field__id_uuid ON public.companies_organization_field USING btree (id_uuid) |
| `companies_referral_source_field` | `salesApplications_ReferralSourceField_pkey` | CREATE UNIQUE INDEX "salesApplications_ReferralSourceField_pkey" ON public.companies_referral_source_field USING btree (id) |
| `companies_referral_source_field` | `uq_companies_referral_source_field__code` | CREATE UNIQUE INDEX uq_companies_referral_source_field__code ON public.companies_referral_source_field USING btree (code) WHERE (deleted_at IS NULL) |
| `companies_referral_source_field` | `uq_companies_referral_source_field__id_uuid` | CREATE UNIQUE INDEX uq_companies_referral_source_field__id_uuid ON public.companies_referral_source_field USING btree (id_uuid) |
| `companies_tech_savvy_field` | `salesApplications_TechSavvyField_pkey1` | CREATE UNIQUE INDEX "salesApplications_TechSavvyField_pkey1" ON public.companies_tech_savvy_field USING btree (id) |
| `companies_tech_savvy_field` | `uq_companies_tech_savvy_field__code` | CREATE UNIQUE INDEX uq_companies_tech_savvy_field__code ON public.companies_tech_savvy_field USING btree (code) WHERE (deleted_at IS NULL) |
| `companies_tech_savvy_field` | `uq_companies_tech_savvy_field__id_uuid` | CREATE UNIQUE INDEX uq_companies_tech_savvy_field__id_uuid ON public.companies_tech_savvy_field USING btree (id_uuid) |
| `companies_tech_tools_field` | `salesApplications_TechSavvyField_pkey` | CREATE UNIQUE INDEX "salesApplications_TechSavvyField_pkey" ON public.companies_tech_tools_field USING btree (id) |
| `companies_tech_tools_field` | `uq_companies_tech_tools_field__code` | CREATE UNIQUE INDEX uq_companies_tech_tools_field__code ON public.companies_tech_tools_field USING btree (code) WHERE (deleted_at IS NULL) |
| `companies_tech_tools_field` | `uq_companies_tech_tools_field__id_uuid` | CREATE UNIQUE INDEX uq_companies_tech_tools_field__id_uuid ON public.companies_tech_tools_field USING btree (id_uuid) |
| `companies_work_types_field` | `companies_WorkTypeField_pkey` | CREATE UNIQUE INDEX "companies_WorkTypeField_pkey" ON public.companies_work_types_field USING btree (id) |
| `companies_work_types_field` | `uq_companies_work_types_field__code` | CREATE UNIQUE INDEX uq_companies_work_types_field__code ON public.companies_work_types_field USING btree (code) WHERE (deleted_at IS NULL) |
| `companies_work_types_field` | `uq_companies_work_types_field__id_uuid` | CREATE UNIQUE INDEX uq_companies_work_types_field__id_uuid ON public.companies_work_types_field USING btree (id_uuid) |
| `construction_types` | `construction_types_name_uniq` | CREATE UNIQUE INDEX construction_types_name_uniq ON public.construction_types USING btree (name) |
| `construction_types` | `construction_types_pkey` | CREATE UNIQUE INDEX construction_types_pkey ON public.construction_types USING btree (id) |
| `construction_types` | `idx_construction_types__active` | CREATE INDEX idx_construction_types__active ON public.construction_types USING btree (active) WHERE (deleted_at IS NULL) |
| `construction_types` | `idx_construction_types__name` | CREATE INDEX idx_construction_types__name ON public.construction_types USING btree (lower(name)) WHERE (deleted_at IS NULL) |
| `construction_types__project_types` | `idx_construction_types__project_types__deleted_at` | CREATE INDEX idx_construction_types__project_types__deleted_at ON public.construction_types__project_types USING btree (deleted_at) |
| `construction_types__project_types` | `uq_construction_types__project_types__construction_type_id__pro` | CREATE UNIQUE INDEX uq_construction_types__project_types__construction_type_id__pro ON public.construction_types__project_types USING btree (construction_type_id, project_type_id) WHERE (deleted_at... |
| `construction_types__project_types` | `zjunction_construction_types_project_types_pkey` | CREATE UNIQUE INDEX zjunction_construction_types_project_types_pkey ON public.construction_types__project_types USING btree (id) |
| `contacts` | `contacts_pkey` | CREATE UNIQUE INDEX contacts_pkey ON public.contacts USING btree (id) |
| `contacts` | `idx_contacts__contact_type_id` | CREATE INDEX idx_contacts__contact_type_id ON public.contacts USING btree (contact_type_id) WHERE (deleted_at IS NULL) |
| `contacts` | `idx_contacts__deleted_at` | CREATE INDEX idx_contacts__deleted_at ON public.contacts USING btree (deleted_at) |
| `contacts` | `idx_contacts_email` | CREATE INDEX idx_contacts_email ON public.contacts USING btree (email) |
| `contacts` | `idx_contacts_phone` | CREATE INDEX idx_contacts_phone ON public.contacts USING btree (phone) |
| `contacts` | `uq_contacts__email` | CREATE UNIQUE INDEX uq_contacts__email ON public.contacts USING btree (email) WHERE ((deleted_at IS NULL) AND (email IS NOT NULL)) |
| `contacts` | `uq_contacts__phone` | CREATE UNIQUE INDEX uq_contacts__phone ON public.contacts USING btree (phone, phone_extension) WHERE ((deleted_at IS NULL) AND (phone IS NOT NULL)) |
| `contacts__building_departments` | `contacts__building_departments_pkey` | CREATE UNIQUE INDEX contacts__building_departments_pkey ON public.contacts__building_departments USING btree (id) |
| `contacts__building_departments` | `idx_contacts__building_departments__building_department_id` | CREATE INDEX idx_contacts__building_departments__building_department_id ON public.contacts__building_departments USING btree (building_department_id) WHERE (deleted_at IS NULL) |
| `contacts__building_departments` | `idx_contacts__building_departments__contact_id` | CREATE INDEX idx_contacts__building_departments__contact_id ON public.contacts__building_departments USING btree (contact_id) WHERE (deleted_at IS NULL) |
| `contacts__building_departments` | `uq_contacts__building_departments__contact_id__building_departm` | CREATE UNIQUE INDEX uq_contacts__building_departments__contact_id__building_departm ON public.contacts__building_departments USING btree (contact_id, building_department_id) WHERE (deleted_at IS NULL) |
| `contacts__projects` | `contacts__projects_pkey` | CREATE UNIQUE INDEX contacts__projects_pkey ON public.contacts__projects USING btree (id) |
| `contacts__projects` | `idx_contacts__projects__contact_id` | CREATE INDEX idx_contacts__projects__contact_id ON public.contacts__projects USING btree (contact_id) WHERE (deleted_at IS NULL) |
| `contacts__projects` | `idx_contacts__projects__project_id` | CREATE INDEX idx_contacts__projects__project_id ON public.contacts__projects USING btree (project_id) WHERE (deleted_at IS NULL) |
| `contacts__projects` | `uq_contacts__projects__contact_id__project_id` | CREATE UNIQUE INDEX uq_contacts__projects__contact_id__project_id ON public.contacts__projects USING btree (contact_id, project_id) WHERE (deleted_at IS NULL) |
| `contacts_type_field` | `contacts_TypeField_id_key` | CREATE UNIQUE INDEX "contacts_TypeField_id_key" ON public.contacts_type_field USING btree (id) |
| `contacts_type_field` | `contacts_TypeField_id_unique` | CREATE UNIQUE INDEX "contacts_TypeField_id_unique" ON public.contacts_type_field USING btree (id) |
| `contacts_type_field` | `contacts_TypeField_pkey` | CREATE UNIQUE INDEX "contacts_TypeField_pkey" ON public.contacts_type_field USING btree (id) |
| `contacts_type_field` | `uq_contacts_type_field__code` | CREATE UNIQUE INDEX uq_contacts_type_field__code ON public.contacts_type_field USING btree (code) WHERE (deleted_at IS NULL) |
| `contacts_type_field` | `uq_contacts_type_field__id_uuid` | CREATE UNIQUE INDEX uq_contacts_type_field__id_uuid ON public.contacts_type_field USING btree (id_uuid) |
| `deal_phase_field` | `deal_PhaseField_pkey` | CREATE UNIQUE INDEX "deal_PhaseField_pkey" ON public.deal_phase_field USING btree (id) |
| `deal_phase_field` | `uq_deal_phase_field__code` | CREATE UNIQUE INDEX uq_deal_phase_field__code ON public.deal_phase_field USING btree (code) WHERE (deleted_at IS NULL) |
| `deal_phase_field` | `uq_deal_phase_field__id_uuid` | CREATE UNIQUE INDEX uq_deal_phase_field__id_uuid ON public.deal_phase_field USING btree (id_uuid) |
| `deal_qualification_field` | `deal_QualificationField_pkey` | CREATE UNIQUE INDEX "deal_QualificationField_pkey" ON public.deal_qualification_field USING btree (id) |
| `deal_qualification_field` | `uq_deal_qualification_field__code` | CREATE UNIQUE INDEX uq_deal_qualification_field__code ON public.deal_qualification_field USING btree (code) WHERE (deleted_at IS NULL) |
| `deal_qualification_field` | `uq_deal_qualification_field__id_uuid` | CREATE UNIQUE INDEX uq_deal_qualification_field__id_uuid ON public.deal_qualification_field USING btree (id_uuid) |
| `deals` | `deals_pkey` | CREATE UNIQUE INDEX deals_pkey ON public.deals USING btree (id) |
| `deals` | `idx_deals__company_id` | CREATE INDEX idx_deals__company_id ON public.deals USING btree (company_id) WHERE (deleted_at IS NULL) |
| `deals` | `idx_deals__deal_phase_id` | CREATE INDEX idx_deals__deal_phase_id ON public.deals USING btree (deal_phase_id) WHERE (deleted_at IS NULL) |
| `deals` | `idx_deals__deal_qualification_id` | CREATE INDEX idx_deals__deal_qualification_id ON public.deals USING btree (deal_qualification_id) WHERE (deleted_at IS NULL) |
| `deals` | `idx_deals__deleted_at` | CREATE INDEX idx_deals__deleted_at ON public.deals USING btree (deleted_at) |
| `deals` | `idx_deals__primary_contact_id` | CREATE INDEX idx_deals__primary_contact_id ON public.deals USING btree (primary_contact_id) WHERE (deleted_at IS NULL) |
| `deals` | `uq_deals__invoice_id` | CREATE UNIQUE INDEX uq_deals__invoice_id ON public.deals USING btree (invoice_id) WHERE (invoice_id IS NOT NULL) |
| `deals__other_contacts` | `deals__other_contacts_pkey` | CREATE UNIQUE INDEX deals__other_contacts_pkey ON public.deals__other_contacts USING btree (id) |
| `deals__other_contacts` | `fk_contacts_salesAppli_3fxjpsefqm` | CREATE INDEX "fk_contacts_salesAppli_3fxjpsefqm" ON public.deals__other_contacts USING btree (other_contact_id) |
| `deals__other_contacts` | `idx_deals__other_contacts__deal_id` | CREATE INDEX idx_deals__other_contacts__deal_id ON public.deals__other_contacts USING btree (deal_id) WHERE (deleted_at IS NULL) |
| `deals__other_contacts` | `idx_deals__other_contacts__deleted_at` | CREATE INDEX idx_deals__other_contacts__deleted_at ON public.deals__other_contacts USING btree (deleted_at) |
| `deals__other_contacts` | `idx_deals__other_contacts__other_contact_id` | CREATE INDEX idx_deals__other_contacts__other_contact_id ON public.deals__other_contacts USING btree (other_contact_id) WHERE (deleted_at IS NULL) |
| `deals__other_contacts` | `uq_deals__other_contacts__deal_id__other_contact_id` | CREATE UNIQUE INDEX uq_deals__other_contacts__deal_id__other_contact_id ON public.deals__other_contacts USING btree (deal_id, other_contact_id) WHERE (deleted_at IS NULL) |
| `disciplines` | `disciplines_name_uniq` | CREATE UNIQUE INDEX disciplines_name_uniq ON public.disciplines USING btree (name) |
| `disciplines` | `disciplines_pkey` | CREATE UNIQUE INDEX disciplines_pkey ON public.disciplines USING btree (id) |
| `disciplines` | `idx_disciplines__trade_id` | CREATE INDEX idx_disciplines__trade_id ON public.disciplines USING btree (trade_id) WHERE (deleted_at IS NULL) |
| `disciplines` | `uq_disciplines__code` | CREATE UNIQUE INDEX uq_disciplines__code ON public.disciplines USING btree (code) WHERE (deleted_at IS NULL) |
| `disciplines` | `uq_disciplines__id_uuid` | CREATE UNIQUE INDEX uq_disciplines__id_uuid ON public.disciplines USING btree (id) |
| `employee_users` | `employeeUsers_pkey` | CREATE UNIQUE INDEX "employeeUsers_pkey" ON public.employee_users USING btree (id) |
| `employee_users` | `idx_employee_users__deleted_at` | CREATE INDEX idx_employee_users__deleted_at ON public.employee_users USING btree (deleted_at) |
| `employee_users` | `idx_employee_users__department` | CREATE INDEX idx_employee_users__department ON public.employee_users USING btree (department) WHERE (deleted_at IS NULL) |
| `employee_users` | `idx_employee_users__manager_id` | CREATE INDEX idx_employee_users__manager_id ON public.employee_users USING btree (manager_id) WHERE (deleted_at IS NULL) |
| `files` | `files_pkey` | CREATE UNIQUE INDEX files_pkey ON public.files USING btree (id) |
| `files` | `idx_files__bucket` | CREATE INDEX idx_files__bucket ON public.files USING btree (bucket) |
| `files` | `idx_files__created_by` | CREATE INDEX idx_files__created_by ON public.files USING btree (created_by) |
| `files` | `idx_files__deleted_at` | CREATE INDEX idx_files__deleted_at ON public.files USING btree (deleted_at) |
| `files` | `idx_files__object_key` | CREATE INDEX idx_files__object_key ON public.files USING btree (object_key) |
| `inspection_modes` | `inspection_modes_name_uniq` | CREATE UNIQUE INDEX inspection_modes_name_uniq ON public.inspection_modes USING btree (name) WHERE (name IS NOT NULL) |
| `inspection_modes` | `inspection_modes_pkey` | CREATE UNIQUE INDEX inspection_modes_pkey ON public.inspection_modes USING btree (id) |
| `inspection_modes` | `uq_inspection_modes__code` | CREATE UNIQUE INDEX uq_inspection_modes__code ON public.inspection_modes USING btree (code) WHERE (deleted_at IS NULL) |
| `inspection_modes` | `uq_inspection_modes__id_uuid` | CREATE UNIQUE INDEX uq_inspection_modes__id_uuid ON public.inspection_modes USING btree (id) |
| `inspection_sessions` | `idx_inspection_sessions__inspection_mode_id` | CREATE INDEX idx_inspection_sessions__inspection_mode_id ON public.inspection_sessions USING btree (inspection_mode_id) WHERE (deleted_at IS NULL) |
| `inspection_sessions` | `idx_inspection_sessions__project_id` | CREATE INDEX idx_inspection_sessions__project_id ON public.inspection_sessions USING btree (project_id) WHERE (deleted_at IS NULL) |
| `inspection_sessions` | `idx_inspection_sessions__session_status_id` | CREATE INDEX idx_inspection_sessions__session_status_id ON public.inspection_sessions USING btree (session_status_id) WHERE (deleted_at IS NULL) |
| `inspection_sessions` | `inspection_sessions_pkey` | CREATE UNIQUE INDEX inspection_sessions_pkey ON public.inspection_sessions USING btree (id) |
| `inspection_sessions` | `inspectionsessions_projectid_idx` | CREATE INDEX inspectionsessions_projectid_idx ON public.inspection_sessions USING btree (project_id) |
| `inspection_sessions__contacts` | `idx_inspection_sessions__contacts__contact_id` | CREATE INDEX idx_inspection_sessions__contacts__contact_id ON public.inspection_sessions__contacts USING btree (contact_id) WHERE (deleted_at IS NULL) |
| `inspection_sessions__contacts` | `inspection_sessions__contacts_pkey` | CREATE UNIQUE INDEX inspection_sessions__contacts_pkey ON public.inspection_sessions__contacts USING btree (id) |
| `inspection_sessions__contacts` | `uq_inspection_sessions__contacts__inspection_session_id__contac` | CREATE UNIQUE INDEX uq_inspection_sessions__contacts__inspection_session_id__contac ON public.inspection_sessions__contacts USING btree (inspection_session_id, contact_id) WHERE (deleted_at IS NULL) |
| `inspection_sessions__project_media` | `idx_inspection_sessions__project_media__project_media_id` | CREATE INDEX idx_inspection_sessions__project_media__project_media_id ON public.inspection_sessions__project_media USING btree (project_media_id) WHERE (deleted_at IS NULL) |
| `inspection_sessions__project_media` | `inspection_sessions__project_media_pkey` | CREATE UNIQUE INDEX inspection_sessions__project_media_pkey ON public.inspection_sessions__project_media USING btree (id) |
| `inspection_sessions__project_media` | `uq_inspection_sessions__project_media__inspection_session_id__p` | CREATE UNIQUE INDEX uq_inspection_sessions__project_media__inspection_session_id__p ON public.inspection_sessions__project_media USING btree (inspection_session_id, project_media_id) WHERE (deleted... |
| `inspection_sessions_status_field` | `inspection_sessions_status_field_pkey` | CREATE UNIQUE INDEX inspection_sessions_status_field_pkey ON public.inspection_sessions_status_field USING btree (id) |
| `inspection_sessions_status_field` | `uq_inspection_sessions_status_field__code` | CREATE UNIQUE INDEX uq_inspection_sessions_status_field__code ON public.inspection_sessions_status_field USING btree (code) WHERE (deleted_at IS NULL) |
| `inspection_sessions_status_field` | `uq_inspection_sessions_status_field__id_uuid` | CREATE UNIQUE INDEX uq_inspection_sessions_status_field__id_uuid ON public.inspection_sessions_status_field USING btree (id) |
| `inspections` | `idx_inspections__inspection_session_id` | CREATE INDEX idx_inspections__inspection_session_id ON public.inspections USING btree (inspection_session_id) WHERE (deleted_at IS NULL) |
| `inspections` | `idx_inspections__project_id` | CREATE INDEX idx_inspections__project_id ON public.inspections USING btree (project_id) WHERE (deleted_at IS NULL) |
| `inspections` | `idx_inspections__result_id` | CREATE INDEX idx_inspections__result_id ON public.inspections USING btree (result_id) WHERE (deleted_at IS NULL) |
| `inspections` | `inspections_inspectionsessionid_idx` | CREATE INDEX inspections_inspectionsessionid_idx ON public.inspections USING btree (inspection_session_id) |
| `inspections` | `inspections_pkey` | CREATE UNIQUE INDEX inspections_pkey ON public.inspections USING btree (id) |
| `inspections_result_field` | `inspections_result_field_pkey` | CREATE UNIQUE INDEX inspections_result_field_pkey ON public.inspections_result_field USING btree (id) |
| `inspections_result_field` | `uq_inspections_result_field__code` | CREATE UNIQUE INDEX uq_inspections_result_field__code ON public.inspections_result_field USING btree (code) WHERE (deleted_at IS NULL) |
| `inspections_result_field` | `uq_inspections_result_field__id_uuid` | CREATE UNIQUE INDEX uq_inspections_result_field__id_uuid ON public.inspections_result_field USING btree (id) |
| `invoice_line_items` | `fk_quotes_invoiceLin_idt8pof8jn` | CREATE INDEX "fk_quotes_invoiceLin_idt8pof8jn" ON public.invoice_line_items USING btree (quote_id) |
| `invoice_line_items` | `idx_invoice_line_items__deleted_at` | CREATE INDEX idx_invoice_line_items__deleted_at ON public.invoice_line_items USING btree (deleted_at) |
| `invoice_line_items` | `idx_invoice_line_items__invoice_id` | CREATE INDEX idx_invoice_line_items__invoice_id ON public.invoice_line_items USING btree (invoice_id) WHERE (deleted_at IS NULL) |
| `invoice_line_items` | `idx_invoice_line_items__project_id` | CREATE INDEX idx_invoice_line_items__project_id ON public.invoice_line_items USING btree (project_id) WHERE (deleted_at IS NULL) |
| `invoice_line_items` | `idx_invoice_line_items__status_id` | CREATE INDEX idx_invoice_line_items__status_id ON public.invoice_line_items USING btree (status_id) WHERE (deleted_at IS NULL) |
| `invoice_line_items` | `invoice_line_items_pkey` | CREATE UNIQUE INDEX invoice_line_items_pkey ON public.invoice_line_items USING btree (id) |
| `invoice_line_items_status_field` | `invoiceLineItems_StatusField_id_unique` | CREATE UNIQUE INDEX "invoiceLineItems_StatusField_id_unique" ON public.invoice_line_items_status_field USING btree (id) |
| `invoice_line_items_status_field` | `invoiceLineItems_StatusField_pkey` | CREATE UNIQUE INDEX "invoiceLineItems_StatusField_pkey" ON public.invoice_line_items_status_field USING btree (id) |
| `invoice_line_items_status_field` | `uq_invoice_line_items_status_field__code` | CREATE UNIQUE INDEX uq_invoice_line_items_status_field__code ON public.invoice_line_items_status_field USING btree (code) WHERE (deleted_at IS NULL) |
| `invoice_line_items_status_field` | `uq_invoice_line_items_status_field__id_uuid` | CREATE UNIQUE INDEX uq_invoice_line_items_status_field__id_uuid ON public.invoice_line_items_status_field USING btree (id_uuid) |
| `invoices` | `idx_invoices__collection_status_id` | CREATE INDEX idx_invoices__collection_status_id ON public.invoices USING btree (collection_status_id) WHERE (deleted_at IS NULL) |
| `invoices` | `idx_invoices__company_id` | CREATE INDEX idx_invoices__company_id ON public.invoices USING btree (company_id) WHERE (deleted_at IS NULL) |
| `invoices` | `idx_invoices__deal_id` | CREATE INDEX idx_invoices__deal_id ON public.invoices USING btree (deal_id) WHERE (deleted_at IS NULL) |
| `invoices` | `idx_invoices__deleted_at` | CREATE INDEX idx_invoices__deleted_at ON public.invoices USING btree (deleted_at) |
| `invoices` | `idx_invoices__payment_status_id` | CREATE INDEX idx_invoices__payment_status_id ON public.invoices USING btree (payment_status_id) WHERE (deleted_at IS NULL) |
| `invoices` | `invoices_pkey` | CREATE UNIQUE INDEX invoices_pkey ON public.invoices USING btree (id) |
| `invoices` | `uq_invoices__invoice_number` | CREATE UNIQUE INDEX uq_invoices__invoice_number ON public.invoices USING btree (invoice_number) |
| `invoices_collection_status_field` | `invoices_CollectionStatusField_id_unique` | CREATE UNIQUE INDEX "invoices_CollectionStatusField_id_unique" ON public.invoices_collection_status_field USING btree (id) |
| `invoices_collection_status_field` | `invoices_CollectionStatusField_pkey` | CREATE UNIQUE INDEX "invoices_CollectionStatusField_pkey" ON public.invoices_collection_status_field USING btree (id) |
| `invoices_collection_status_field` | `uq_invoices_collection_status_field__code` | CREATE UNIQUE INDEX uq_invoices_collection_status_field__code ON public.invoices_collection_status_field USING btree (code) WHERE (deleted_at IS NULL) |
| `invoices_collection_status_field` | `uq_invoices_collection_status_field__id_uuid` | CREATE UNIQUE INDEX uq_invoices_collection_status_field__id_uuid ON public.invoices_collection_status_field USING btree (id_uuid) |
| `invoices_payment_status_field` | `invoices_PaymentStatusField_id_unique` | CREATE UNIQUE INDEX "invoices_PaymentStatusField_id_unique" ON public.invoices_payment_status_field USING btree (id) |
| `invoices_payment_status_field` | `invoices_PaymentStatusField_pkey` | CREATE UNIQUE INDEX "invoices_PaymentStatusField_pkey" ON public.invoices_payment_status_field USING btree (id) |
| `invoices_payment_status_field` | `uq_invoices_payment_status_field__code` | CREATE UNIQUE INDEX uq_invoices_payment_status_field__code ON public.invoices_payment_status_field USING btree (code) WHERE (deleted_at IS NULL) |
| `invoices_payment_status_field` | `uq_invoices_payment_status_field__id_uuid` | CREATE UNIQUE INDEX uq_invoices_payment_status_field__id_uuid ON public.invoices_payment_status_field USING btree (id_uuid) |
| `issue_comments` | `idx_issue_comments__inspection_id` | CREATE INDEX idx_issue_comments__inspection_id ON public.issue_comments USING btree (inspection_id) WHERE (deleted_at IS NULL) |
| `issue_comments` | `idx_issue_comments__plan_review_id` | CREATE INDEX idx_issue_comments__plan_review_id ON public.issue_comments USING btree (plan_review_id) WHERE (deleted_at IS NULL) |
| `issue_comments` | `issue_comments_pkey` | CREATE UNIQUE INDEX issue_comments_pkey ON public.issue_comments USING btree (id) |
| `occupancies` | `occupancies_name_uniq` | CREATE UNIQUE INDEX occupancies_name_uniq ON public.occupancies USING btree (name) |
| `occupancies` | `occupancies_pkey` | CREATE UNIQUE INDEX occupancies_pkey ON public.occupancies USING btree (id) |
| `occupancies` | `uq_occupancies__code` | CREATE UNIQUE INDEX uq_occupancies__code ON public.occupancies USING btree (code) WHERE (deleted_at IS NULL) |
| `payment_processors` | `idx_payment_processors__deleted_at` | CREATE INDEX idx_payment_processors__deleted_at ON public.payment_processors USING btree (deleted_at) |
| `payment_processors` | `payment_processors_pkey` | CREATE UNIQUE INDEX payment_processors_pkey ON public.payment_processors USING btree (id) |
| `payment_processors` | `uq_payment_processors__name` | CREATE UNIQUE INDEX uq_payment_processors__name ON public.payment_processors USING btree (lower(name)) WHERE (deleted_at IS NULL) |
| `payments` | `idx_payments__payment_date` | CREATE INDEX idx_payments__payment_date ON public.payments USING btree (payment_date) WHERE (deleted_at IS NULL) |
| `payments` | `idx_payments__status` | CREATE INDEX idx_payments__status ON public.payments USING btree (status) WHERE (deleted_at IS NULL) |
| `payments` | `payments_pkey` | CREATE UNIQUE INDEX payments_pkey ON public.payments USING btree (id) |
| `payments__invoices` | `fk_payments_invoices_z91ymqcz87` | CREATE INDEX fk_payments_invoices_z91ymqcz87 ON public.payments__invoices USING btree (invoice_id) |
| `payments__invoices` | `payments__invoices_pkey` | CREATE UNIQUE INDEX payments__invoices_pkey ON public.payments__invoices USING btree (id) |
| `payments__invoices` | `uq_payments__invoices__invoice_id__payment_id` | CREATE UNIQUE INDEX uq_payments__invoices__invoice_id__payment_id ON public.payments__invoices USING btree (invoice_id, payment_id) WHERE (deleted_at IS NULL) |
| `permit_expediting` | `fk_projects_permit_exp_riplggfld9` | CREATE INDEX fk_projects_permit_exp_riplggfld9 ON public.permit_expediting USING btree (project_id) |
| `permit_expediting` | `idx_permit_expediting__document_completion_status_id` | CREATE INDEX idx_permit_expediting__document_completion_status_id ON public.permit_expediting USING btree (document_completion_status_id) WHERE (deleted_at IS NULL) |
| `permit_expediting` | `idx_permit_expediting__noc_status_id` | CREATE INDEX idx_permit_expediting__noc_status_id ON public.permit_expediting USING btree (noc_status_id) WHERE (deleted_at IS NULL) |
| `permit_expediting` | `idx_permit_expediting__ntbo_status_id` | CREATE INDEX idx_permit_expediting__ntbo_status_id ON public.permit_expediting USING btree (ntbo_status_id) WHERE (deleted_at IS NULL) |
| `permit_expediting` | `idx_permit_expediting__permit_app_status_id` | CREATE INDEX idx_permit_expediting__permit_app_status_id ON public.permit_expediting USING btree (permit_app_status_id) WHERE (deleted_at IS NULL) |
| `permit_expediting` | `idx_permit_expediting__permitting_status_id` | CREATE INDEX idx_permit_expediting__permitting_status_id ON public.permit_expediting USING btree (permitting_status_id) WHERE (deleted_at IS NULL) |
| `permit_expediting` | `idx_permit_expediting__private_provider_id` | CREATE INDEX idx_permit_expediting__private_provider_id ON public.permit_expediting USING btree (private_provider_id) WHERE (deleted_at IS NULL) |
| `permit_expediting` | `idx_permit_expediting__sub_form_id` | CREATE INDEX idx_permit_expediting__sub_form_id ON public.permit_expediting USING btree (sub_form_id) WHERE (deleted_at IS NULL) |
| `permit_expediting` | `idx_permit_expediting__subcontractor_info_id` | CREATE INDEX idx_permit_expediting__subcontractor_info_id ON public.permit_expediting USING btree (subcontractor_info_id) WHERE (deleted_at IS NULL) |
| `permit_expediting` | `idx_permit_expediting__workability_id` | CREATE INDEX idx_permit_expediting__workability_id ON public.permit_expediting USING btree (workability_id) WHERE (deleted_at IS NULL) |
| `permit_expediting` | `permit_expediting_pkey` | CREATE UNIQUE INDEX permit_expediting_pkey ON public.permit_expediting USING btree (id) |
| `permit_expediting` | `uq_permit_expediting__project_id` | CREATE UNIQUE INDEX uq_permit_expediting__project_id ON public.permit_expediting USING btree (project_id) WHERE ((deleted_at IS NULL) AND (project_id IS NOT NULL)) |
| `permit_expediting_document_status_field` | `permitExpediting_DocumentStatusField_id_unique` | CREATE UNIQUE INDEX "permitExpediting_DocumentStatusField_id_unique" ON public.permit_expediting_document_status_field USING btree (id) |
| `permit_expediting_document_status_field` | `permitExpediting_DocumentStatusField_pkey` | CREATE UNIQUE INDEX "permitExpediting_DocumentStatusField_pkey" ON public.permit_expediting_document_status_field USING btree (id) |
| `permit_expediting_document_status_field` | `uq_permit_expediting_document_status_field__code` | CREATE UNIQUE INDEX uq_permit_expediting_document_status_field__code ON public.permit_expediting_document_status_field USING btree (code) WHERE (deleted_at IS NULL) |
| `permit_expediting_document_status_field` | `uq_permit_expediting_document_status_field__id_uuid` | CREATE UNIQUE INDEX uq_permit_expediting_document_status_field__id_uuid ON public.permit_expediting_document_status_field USING btree (id_uuid) |
| `permit_expediting_fees_status_field` | `permit_expediting_fees_status_field_pkey` | CREATE UNIQUE INDEX permit_expediting_fees_status_field_pkey ON public.permit_expediting_fees_status_field USING btree (id) |
| `permit_expediting_fees_status_field` | `uq_permit_expediting_fees_status_field__code` | CREATE UNIQUE INDEX uq_permit_expediting_fees_status_field__code ON public.permit_expediting_fees_status_field USING btree (code) WHERE (deleted_at IS NULL) |
| `permit_expediting_fees_status_field` | `uq_permit_expediting_fees_status_field__id_uuid` | CREATE UNIQUE INDEX uq_permit_expediting_fees_status_field__id_uuid ON public.permit_expediting_fees_status_field USING btree (id) |
| `permit_expediting_fees_status_field` | `uq_permit_expediting_fees_status_field__name` | CREATE UNIQUE INDEX uq_permit_expediting_fees_status_field__name ON public.permit_expediting_fees_status_field USING btree (lower(name)) WHERE (deleted_at IS NULL) |
| `permit_expediting_noc_status_field` | `permitExpediting_NOCStatusField_id_unique` | CREATE UNIQUE INDEX "permitExpediting_NOCStatusField_id_unique" ON public.permit_expediting_noc_status_field USING btree (id) |
| `permit_expediting_noc_status_field` | `permitExpediting_NOCStatusField_pkey` | CREATE UNIQUE INDEX "permitExpediting_NOCStatusField_pkey" ON public.permit_expediting_noc_status_field USING btree (id) |
| `permit_expediting_noc_status_field` | `uq_permit_expediting_noc_status_field__code` | CREATE UNIQUE INDEX uq_permit_expediting_noc_status_field__code ON public.permit_expediting_noc_status_field USING btree (code) WHERE (deleted_at IS NULL) |
| `permit_expediting_noc_status_field` | `uq_permit_expediting_noc_status_field__id_uuid` | CREATE UNIQUE INDEX uq_permit_expediting_noc_status_field__id_uuid ON public.permit_expediting_noc_status_field USING btree (id_uuid) |
| `permit_expediting_ntbo_status_field` | `permitExpediting_NTBOStatusField_id_unique` | CREATE UNIQUE INDEX "permitExpediting_NTBOStatusField_id_unique" ON public.permit_expediting_ntbo_status_field USING btree (id) |
| `permit_expediting_ntbo_status_field` | `permitExpediting_NTBOStatusField_pkey` | CREATE UNIQUE INDEX "permitExpediting_NTBOStatusField_pkey" ON public.permit_expediting_ntbo_status_field USING btree (id) |
| `permit_expediting_ntbo_status_field` | `uq_permit_expediting_ntbo_status_field__code` | CREATE UNIQUE INDEX uq_permit_expediting_ntbo_status_field__code ON public.permit_expediting_ntbo_status_field USING btree (code) WHERE (deleted_at IS NULL) |
| `permit_expediting_ntbo_status_field` | `uq_permit_expediting_ntbo_status_field__id_uuid` | CREATE UNIQUE INDEX uq_permit_expediting_ntbo_status_field__id_uuid ON public.permit_expediting_ntbo_status_field USING btree (id_uuid) |
| `permit_expediting_permit_app_status_field` | `permitExpediting_PermitAppStatusField_id_unique` | CREATE UNIQUE INDEX "permitExpediting_PermitAppStatusField_id_unique" ON public.permit_expediting_permit_app_status_field USING btree (id) |
| `permit_expediting_permit_app_status_field` | `permitExpediting_PermitAppStatusField_pkey` | CREATE UNIQUE INDEX "permitExpediting_PermitAppStatusField_pkey" ON public.permit_expediting_permit_app_status_field USING btree (id) |
| `permit_expediting_permit_app_status_field` | `uq_permit_expediting_permit_app_status_field__code` | CREATE UNIQUE INDEX uq_permit_expediting_permit_app_status_field__code ON public.permit_expediting_permit_app_status_field USING btree (code) WHERE (deleted_at IS NULL) |
| `permit_expediting_permit_app_status_field` | `uq_permit_expediting_permit_app_status_field__id_uuid` | CREATE UNIQUE INDEX uq_permit_expediting_permit_app_status_field__id_uuid ON public.permit_expediting_permit_app_status_field USING btree (id_uuid) |
| `permit_expediting_private_provider_field` | `permitExpediting_PrivateProviderField_id_unique` | CREATE UNIQUE INDEX "permitExpediting_PrivateProviderField_id_unique" ON public.permit_expediting_private_provider_field USING btree (id) |
| `permit_expediting_private_provider_field` | `permitExpediting_PrivateProviderField_pkey` | CREATE UNIQUE INDEX "permitExpediting_PrivateProviderField_pkey" ON public.permit_expediting_private_provider_field USING btree (id) |
| `permit_expediting_private_provider_field` | `uq_permit_expediting_private_provider_field__code` | CREATE UNIQUE INDEX uq_permit_expediting_private_provider_field__code ON public.permit_expediting_private_provider_field USING btree (code) WHERE (deleted_at IS NULL) |
| `permit_expediting_private_provider_field` | `uq_permit_expediting_private_provider_field__id_uuid` | CREATE UNIQUE INDEX uq_permit_expediting_private_provider_field__id_uuid ON public.permit_expediting_private_provider_field USING btree (id_uuid) |
| `permit_expediting_status_field` | `permitExpediting_StatusField_id_unique` | CREATE UNIQUE INDEX "permitExpediting_StatusField_id_unique" ON public.permit_expediting_status_field USING btree (id) |
| `permit_expediting_status_field` | `permitExpediting_StatusField_pkey` | CREATE UNIQUE INDEX "permitExpediting_StatusField_pkey" ON public.permit_expediting_status_field USING btree (id) |
| `permit_expediting_status_field` | `uq_permit_expediting_status_field__code` | CREATE UNIQUE INDEX uq_permit_expediting_status_field__code ON public.permit_expediting_status_field USING btree (code) WHERE (deleted_at IS NULL) |
| `permit_expediting_status_field` | `uq_permit_expediting_status_field__id_uuid` | CREATE UNIQUE INDEX uq_permit_expediting_status_field__id_uuid ON public.permit_expediting_status_field USING btree (id_uuid) |
| `permit_expediting_sub_form_field` | `permitExpediting_SubFormField_id_unique` | CREATE UNIQUE INDEX "permitExpediting_SubFormField_id_unique" ON public.permit_expediting_sub_form_field USING btree (id) |
| `permit_expediting_sub_form_field` | `permitExpediting_SubFormField_pkey` | CREATE UNIQUE INDEX "permitExpediting_SubFormField_pkey" ON public.permit_expediting_sub_form_field USING btree (id) |
| `permit_expediting_sub_form_field` | `uq_permit_expediting_sub_form_field__code` | CREATE UNIQUE INDEX uq_permit_expediting_sub_form_field__code ON public.permit_expediting_sub_form_field USING btree (code) WHERE (deleted_at IS NULL) |
| `permit_expediting_sub_form_field` | `uq_permit_expediting_sub_form_field__id_uuid` | CREATE UNIQUE INDEX uq_permit_expediting_sub_form_field__id_uuid ON public.permit_expediting_sub_form_field USING btree (id_uuid) |
| `permit_expediting_sub_permit_type_field` | `permit_expediting_sub_permit_type_field_pkey` | CREATE UNIQUE INDEX permit_expediting_sub_permit_type_field_pkey ON public.permit_expediting_sub_permit_type_field USING btree (id) |
| `permit_expediting_sub_permit_type_field` | `uq_permit_expediting_sub_permit_type_field__code` | CREATE UNIQUE INDEX uq_permit_expediting_sub_permit_type_field__code ON public.permit_expediting_sub_permit_type_field USING btree (code) WHERE (deleted_at IS NULL) |
| `permit_expediting_sub_permit_type_field` | `uq_permit_expediting_sub_permit_type_field__id_uuid` | CREATE UNIQUE INDEX uq_permit_expediting_sub_permit_type_field__id_uuid ON public.permit_expediting_sub_permit_type_field USING btree (id) |
| `permit_expediting_sub_permit_type_field` | `uq_permit_expediting_sub_permit_type_field__name` | CREATE UNIQUE INDEX uq_permit_expediting_sub_permit_type_field__name ON public.permit_expediting_sub_permit_type_field USING btree (lower(name)) WHERE (deleted_at IS NULL) |
| `permit_expediting_subcontractor_info_field` | `permitExpediting_SubcontractorInfoField_id_unique` | CREATE UNIQUE INDEX "permitExpediting_SubcontractorInfoField_id_unique" ON public.permit_expediting_subcontractor_info_field USING btree (id) |
| `permit_expediting_subcontractor_info_field` | `permitExpediting_SubcontractorInfoField_pkey` | CREATE UNIQUE INDEX "permitExpediting_SubcontractorInfoField_pkey" ON public.permit_expediting_subcontractor_info_field USING btree (id) |
| `permit_expediting_subcontractor_info_field` | `uq_permit_expediting_subcontractor_info_field__code` | CREATE UNIQUE INDEX uq_permit_expediting_subcontractor_info_field__code ON public.permit_expediting_subcontractor_info_field USING btree (code) WHERE (deleted_at IS NULL) |
| `permit_expediting_subcontractor_info_field` | `uq_permit_expediting_subcontractor_info_field__id_uuid` | CREATE UNIQUE INDEX uq_permit_expediting_subcontractor_info_field__id_uuid ON public.permit_expediting_subcontractor_info_field USING btree (id_uuid) |
| `permit_expediting_workability_field` | `permitExpediting_WorkabilityField_id_unique` | CREATE UNIQUE INDEX "permitExpediting_WorkabilityField_id_unique" ON public.permit_expediting_workability_field USING btree (id) |
| `permit_expediting_workability_field` | `permitExpediting_WorkabilityField_pkey` | CREATE UNIQUE INDEX "permitExpediting_WorkabilityField_pkey" ON public.permit_expediting_workability_field USING btree (id) |
| `permit_expediting_workability_field` | `uq_permit_expediting_workability_field__code` | CREATE UNIQUE INDEX uq_permit_expediting_workability_field__code ON public.permit_expediting_workability_field USING btree (code) WHERE (deleted_at IS NULL) |
| `permit_expediting_workability_field` | `uq_permit_expediting_workability_field__id_uuid` | CREATE UNIQUE INDEX uq_permit_expediting_workability_field__id_uuid ON public.permit_expediting_workability_field USING btree (id_uuid) |
| `plan_review_result_field` | `plan_review_result_field_pkey` | CREATE UNIQUE INDEX plan_review_result_field_pkey ON public.plan_review_result_field USING btree (id) |
| `plan_review_result_field` | `uq_plan_review_result_field__code` | CREATE UNIQUE INDEX uq_plan_review_result_field__code ON public.plan_review_result_field USING btree (code) WHERE (deleted_at IS NULL) |
| `plan_review_result_field` | `uq_plan_review_result_field__id_uuid` | CREATE UNIQUE INDEX uq_plan_review_result_field__id_uuid ON public.plan_review_result_field USING btree (id) |
| `plan_reviews` | `idx_plan_reviews__discipline_id` | CREATE INDEX idx_plan_reviews__discipline_id ON public.plan_reviews USING btree (discipline_id) WHERE (deleted_at IS NULL) |
| `plan_reviews` | `idx_plan_reviews__plan_set_id` | CREATE INDEX idx_plan_reviews__plan_set_id ON public.plan_reviews USING btree (plan_set_id) WHERE (deleted_at IS NULL) |
| `plan_reviews` | `idx_plan_reviews__plans_examiner_id` | CREATE INDEX idx_plan_reviews__plans_examiner_id ON public.plan_reviews USING btree (plans_examiner_id) WHERE (deleted_at IS NULL) |
| `plan_reviews` | `idx_plan_reviews__result_id` | CREATE INDEX idx_plan_reviews__result_id ON public.plan_reviews USING btree (result_id) WHERE (deleted_at IS NULL) |
| `plan_reviews` | `idx_plan_reviews__status_id` | CREATE INDEX idx_plan_reviews__status_id ON public.plan_reviews USING btree (status_id) WHERE (deleted_at IS NULL) |
| `plan_reviews` | `plan_reviews_pkey` | CREATE UNIQUE INDEX plan_reviews_pkey ON public.plan_reviews USING btree (id) |
| `plan_reviews` | `planreviews_plansetid_idx` | CREATE INDEX planreviews_plansetid_idx ON public.plan_reviews USING btree (plan_set_id) |
| `plan_reviews_status_field` | `plan_reviews_status_field_pkey` | CREATE UNIQUE INDEX plan_reviews_status_field_pkey ON public.plan_reviews_status_field USING btree (id) |
| `plan_reviews_status_field` | `uq_plan_reviews_status_field__code` | CREATE UNIQUE INDEX uq_plan_reviews_status_field__code ON public.plan_reviews_status_field USING btree (code) WHERE (deleted_at IS NULL) |
| `plan_reviews_status_field` | `uq_plan_reviews_status_field__id_uuid` | CREATE UNIQUE INDEX uq_plan_reviews_status_field__id_uuid ON public.plan_reviews_status_field USING btree (id) |
| `plan_sets` | `idx_plan_sets__document_review_status_id` | CREATE INDEX idx_plan_sets__document_review_status_id ON public.plan_sets USING btree (document_review_status_id) WHERE (deleted_at IS NULL) |
| `plan_sets` | `idx_plan_sets__project_id` | CREATE INDEX idx_plan_sets__project_id ON public.plan_sets USING btree (project_id) WHERE (deleted_at IS NULL) |
| `plan_sets` | `idx_plan_sets__type_id` | CREATE INDEX idx_plan_sets__type_id ON public.plan_sets USING btree (type_id) WHERE (deleted_at IS NULL) |
| `plan_sets` | `idx_plan_sets__working_set_id` | CREATE INDEX idx_plan_sets__working_set_id ON public.plan_sets USING btree (working_set_id) WHERE (deleted_at IS NULL) |
| `plan_sets` | `plan_sets_pkey` | CREATE UNIQUE INDEX plan_sets_pkey ON public.plan_sets USING btree (id) |
| `plan_sets` | `plansets_projectid_idx` | CREATE INDEX plansets_projectid_idx ON public.plan_sets USING btree (project_id) |
| `plan_sets__files` | `idx_plan_sets__files__file_id` | CREATE INDEX idx_plan_sets__files__file_id ON public.plan_sets__files USING btree (file_id) WHERE (deleted_at IS NULL) |
| `plan_sets__files` | `idx_plan_sets__files__file_type_id` | CREATE INDEX idx_plan_sets__files__file_type_id ON public.plan_sets__files USING btree (file_type_id) WHERE (deleted_at IS NULL) |
| `plan_sets__files` | `idx_plan_sets__files__plan_set_id` | CREATE INDEX idx_plan_sets__files__plan_set_id ON public.plan_sets__files USING btree (plan_set_id) WHERE (deleted_at IS NULL) |
| `plan_sets__files` | `plan_sets__files_pkey` | CREATE UNIQUE INDEX plan_sets__files_pkey ON public.plan_sets__files USING btree (id) |
| `plan_sets__files` | `uq_plan_sets__files__plan_set_id__file_id__version` | CREATE UNIQUE INDEX uq_plan_sets__files__plan_set_id__file_id__version ON public.plan_sets__files USING btree (plan_set_id, file_id, version) WHERE (deleted_at IS NULL) |
| `plan_sets_document_review_field` | `plan_sets_document_review_field_pkey` | CREATE UNIQUE INDEX plan_sets_document_review_field_pkey ON public.plan_sets_document_review_field USING btree (id) |
| `plan_sets_document_review_field` | `uq_plan_sets_document_review_field__code` | CREATE UNIQUE INDEX uq_plan_sets_document_review_field__code ON public.plan_sets_document_review_field USING btree (code) WHERE (deleted_at IS NULL) |
| `plan_sets_document_review_field` | `uq_plan_sets_document_review_field__id_uuid` | CREATE UNIQUE INDEX uq_plan_sets_document_review_field__id_uuid ON public.plan_sets_document_review_field USING btree (id) |
| `plan_sets_file_types` | `idx_plan_sets_file_types__id` | CREATE INDEX idx_plan_sets_file_types__id ON public.plan_sets_file_types USING btree (id) WHERE (deleted_at IS NULL) |
| `plan_sets_file_types` | `plan_sets_file_types_pkey` | CREATE UNIQUE INDEX plan_sets_file_types_pkey ON public.plan_sets_file_types USING btree (id) |
| `plan_sets_file_types` | `uq_plan_sets_file_types__code` | CREATE UNIQUE INDEX uq_plan_sets_file_types__code ON public.plan_sets_file_types USING btree (code) WHERE (deleted_at IS NULL) |
| `plan_sets_type_field` | `plan_sets_type_field_pkey` | CREATE UNIQUE INDEX plan_sets_type_field_pkey ON public.plan_sets_type_field USING btree (id) |
| `plan_sets_type_field` | `uq_plan_sets_type_field__code` | CREATE UNIQUE INDEX uq_plan_sets_type_field__code ON public.plan_sets_type_field USING btree (code) WHERE (deleted_at IS NULL) |
| `plan_sets_type_field` | `uq_plan_sets_type_field__id_uuid` | CREATE UNIQUE INDEX uq_plan_sets_type_field__id_uuid ON public.plan_sets_type_field USING btree (id) |
| `plan_sets_working_set_field` | `plan_sets_working_set_field_pkey` | CREATE UNIQUE INDEX plan_sets_working_set_field_pkey ON public.plan_sets_working_set_field USING btree (id) |
| `plan_sets_working_set_field` | `uq_plan_sets_working_set_field__code` | CREATE UNIQUE INDEX uq_plan_sets_working_set_field__code ON public.plan_sets_working_set_field USING btree (code) WHERE (deleted_at IS NULL) |
| `plan_sets_working_set_field` | `uq_plan_sets_working_set_field__id_uuid` | CREATE UNIQUE INDEX uq_plan_sets_working_set_field__id_uuid ON public.plan_sets_working_set_field USING btree (id) |
| `price_list` | `idx_price_list__company_id` | CREATE INDEX idx_price_list__company_id ON public.price_list USING btree (company_id) WHERE (deleted_at IS NULL) |
| `price_list` | `idx_price_list__construction_type_id` | CREATE INDEX idx_price_list__construction_type_id ON public.price_list USING btree (construction_type_id) WHERE (deleted_at IS NULL) |
| `price_list` | `idx_price_list__deleted_at` | CREATE INDEX idx_price_list__deleted_at ON public.price_list USING btree (deleted_at) |
| `price_list` | `idx_price_list__occupancy_id` | CREATE INDEX idx_price_list__occupancy_id ON public.price_list USING btree (occupancy_id) WHERE (deleted_at IS NULL) |
| `price_list` | `idx_price_list__project_type_id` | CREATE INDEX idx_price_list__project_type_id ON public.price_list USING btree (project_type_id) WHERE (deleted_at IS NULL) |
| `price_list` | `idx_price_list__service_id` | CREATE INDEX idx_price_list__service_id ON public.price_list USING btree (service_id) WHERE (deleted_at IS NULL) |
| `price_list` | `idx_price_list__status_id` | CREATE INDEX idx_price_list__status_id ON public.price_list USING btree (status_id) WHERE (deleted_at IS NULL) |
| `price_list` | `price_list_pkey` | CREATE UNIQUE INDEX price_list_pkey ON public.price_list USING btree (id) |
| `price_list_status_field` | `priceList_StatusField_id_unique` | CREATE UNIQUE INDEX "priceList_StatusField_id_unique" ON public.price_list_status_field USING btree (id) |
| `price_list_status_field` | `priceList_StatusField_pkey` | CREATE UNIQUE INDEX "priceList_StatusField_pkey" ON public.price_list_status_field USING btree (id) |
| `price_list_status_field` | `uq_price_list_status_field__code` | CREATE UNIQUE INDEX uq_price_list_status_field__code ON public.price_list_status_field USING btree (code) WHERE (deleted_at IS NULL) |
| `price_list_status_field` | `uq_price_list_status_field__id_uuid` | CREATE UNIQUE INDEX uq_price_list_status_field__id_uuid ON public.price_list_status_field USING btree (id_uuid) |
| `professional_licenses` | `idx_professional_licenses__file_id` | CREATE INDEX idx_professional_licenses__file_id ON public.professional_licenses USING btree (file_id) WHERE (deleted_at IS NULL) |
| `professional_licenses` | `idx_professional_licenses__license_number` | CREATE INDEX idx_professional_licenses__license_number ON public.professional_licenses USING btree (lower(license_number)) WHERE ((deleted_at IS NULL) AND (license_number IS NOT NULL)) |
| `professional_licenses` | `idx_professional_licenses__license_type_id` | CREATE INDEX idx_professional_licenses__license_type_id ON public.professional_licenses USING btree (license_type_id) WHERE (deleted_at IS NULL) |
| `professional_licenses` | `idx_professional_licenses__status_id` | CREATE INDEX idx_professional_licenses__status_id ON public.professional_licenses USING btree (status_id) WHERE (deleted_at IS NULL) |
| `professional_licenses` | `professional_licenses_pkey` | CREATE UNIQUE INDEX professional_licenses_pkey ON public.professional_licenses USING btree (id) |
| `professional_licenses__bcp_qualified_services` | `professional_licenses__bcp_qualified_services_pkey` | CREATE UNIQUE INDEX professional_licenses__bcp_qualified_services_pkey ON public.professional_licenses__bcp_qualified_services USING btree (id) |
| `professional_licenses__bcp_qualified_services` | `uq_professional_licenses__bcp_qualified_services` | CREATE UNIQUE INDEX uq_professional_licenses__bcp_qualified_services ON public.professional_licenses__bcp_qualified_services USING btree (professional_license_id, bcp_qualified_service_id) WHERE (d... |
| `professional_licenses_status_field` | `professionalLicenses_StatusField_id_unique` | CREATE UNIQUE INDEX "professionalLicenses_StatusField_id_unique" ON public.professional_licenses_status_field USING btree (id) |
| `professional_licenses_status_field` | `professionalLicenses_StatusField_pkey` | CREATE UNIQUE INDEX "professionalLicenses_StatusField_pkey" ON public.professional_licenses_status_field USING btree (id) |
| `professional_licenses_status_field` | `uq_professional_licenses_status_field__code` | CREATE UNIQUE INDEX uq_professional_licenses_status_field__code ON public.professional_licenses_status_field USING btree (code) WHERE (deleted_at IS NULL) |
| `professional_licenses_status_field` | `uq_professional_licenses_status_field__id_uuid` | CREATE UNIQUE INDEX uq_professional_licenses_status_field__id_uuid ON public.professional_licenses_status_field USING btree (id_uuid) |
| `professional_licenses_type_field` | `professionalLicenses_TypeField_id_unique` | CREATE UNIQUE INDEX "professionalLicenses_TypeField_id_unique" ON public.professional_licenses_type_field USING btree (id) |
| `professional_licenses_type_field` | `professionalLicenses_TypeField_pkey` | CREATE UNIQUE INDEX "professionalLicenses_TypeField_pkey" ON public.professional_licenses_type_field USING btree (id) |
| `professional_licenses_type_field` | `uq_professional_licenses_type_field__code` | CREATE UNIQUE INDEX uq_professional_licenses_type_field__code ON public.professional_licenses_type_field USING btree (code) WHERE (deleted_at IS NULL) |
| `professional_licenses_type_field` | `uq_professional_licenses_type_field__id_uuid` | CREATE UNIQUE INDEX uq_professional_licenses_type_field__id_uuid ON public.professional_licenses_type_field USING btree (id_uuid) |
| `project_media` | `idx_project_media__project_id` | CREATE INDEX idx_project_media__project_id ON public.project_media USING btree (project_id) WHERE (deleted_at IS NULL) |
| `project_media` | `idx_project_media__upload_method_id` | CREATE INDEX idx_project_media__upload_method_id ON public.project_media USING btree (upload_method_id) WHERE (deleted_at IS NULL) |
| `project_media` | `project_media_pkey` | CREATE UNIQUE INDEX project_media_pkey ON public.project_media USING btree (id) |
| `project_media_upload_method_field` | `project_media_upload_method_field_pkey` | CREATE UNIQUE INDEX project_media_upload_method_field_pkey ON public.project_media_upload_method_field USING btree (id) |
| `project_media_upload_method_field` | `uq_project_media_upload_method_field__code` | CREATE UNIQUE INDEX uq_project_media_upload_method_field__code ON public.project_media_upload_method_field USING btree (code) WHERE (deleted_at IS NULL) |
| `project_phases` | `projectPhases_id_unique` | CREATE UNIQUE INDEX "projectPhases_id_unique" ON public.project_phases USING btree (id) |
| `project_phases` | `projectPhases_pkey` | CREATE UNIQUE INDEX "projectPhases_pkey" ON public.project_phases USING btree (id) |
| `project_phases` | `project_phases_name_uniq` | CREATE UNIQUE INDEX project_phases_name_uniq ON public.project_phases USING btree (name) |
| `project_phases` | `uq_project_phases__code` | CREATE UNIQUE INDEX uq_project_phases__code ON public.project_phases USING btree (code) WHERE (deleted_at IS NULL) |
| `project_phases` | `uq_project_phases__id_uuid` | CREATE UNIQUE INDEX uq_project_phases__id_uuid ON public.project_phases USING btree (id_uuid) |
| `project_phases` | `ux_project_phases_name` | CREATE UNIQUE INDEX ux_project_phases_name ON public.project_phases USING btree (name) |
| `project_phases_status_field` | `idx_project_phases_status_field__phase_id` | CREATE INDEX idx_project_phases_status_field__phase_id ON public.project_phases_status_field USING btree (phase_id) WHERE (deleted_at IS NULL) |
| `project_phases_status_field` | `projectPhases_StatusField_id_unique` | CREATE UNIQUE INDEX "projectPhases_StatusField_id_unique" ON public.project_phases_status_field USING btree (id) |
| `project_phases_status_field` | `projectPhases_StatusField_pkey` | CREATE UNIQUE INDEX "projectPhases_StatusField_pkey" ON public.project_phases_status_field USING btree (id) |
| `project_phases_status_field` | `project_phase_statuses_name_uniq` | CREATE UNIQUE INDEX project_phase_statuses_name_uniq ON public.project_phases_status_field USING btree (name) |
| `project_phases_status_field` | `uq_project_phases_status_field__code` | CREATE UNIQUE INDEX uq_project_phases_status_field__code ON public.project_phases_status_field USING btree (code) WHERE (deleted_at IS NULL) |
| `project_phases_status_field` | `uq_project_phases_status_field__id_uuid` | CREATE UNIQUE INDEX uq_project_phases_status_field__id_uuid ON public.project_phases_status_field USING btree (id_uuid) |
| `project_types` | `idx_project_types__construction_type_id` | CREATE INDEX idx_project_types__construction_type_id ON public.project_types USING btree (construction_type_id) WHERE (deleted_at IS NULL) |
| `project_types` | `project_types_pkey` | CREATE UNIQUE INDEX project_types_pkey ON public.project_types USING btree (id) |
| `project_types` | `uq_project_types__code` | CREATE UNIQUE INDEX uq_project_types__code ON public.project_types USING btree (code) WHERE (deleted_at IS NULL) |
| `projects` | `idx_projects__company_id` | CREATE INDEX idx_projects__company_id ON public.projects USING btree (company_id) WHERE (deleted_at IS NULL) |
| `projects` | `idx_projects__construction_type_id` | CREATE INDEX idx_projects__construction_type_id ON public.projects USING btree (construction_type_id) |
| `projects` | `idx_projects__occupancy_id` | CREATE INDEX idx_projects__occupancy_id ON public.projects USING btree (occupancy_id) WHERE (deleted_at IS NULL) |
| `projects` | `idx_projects__phase_id` | CREATE INDEX idx_projects__phase_id ON public.projects USING btree (phase_id) WHERE (deleted_at IS NULL) |
| `projects` | `idx_projects__project_type_id` | CREATE INDEX idx_projects__project_type_id ON public.projects USING btree (project_type_id) |
| `projects` | `idx_projects__status_id` | CREATE INDEX idx_projects__status_id ON public.projects USING btree (status_id) WHERE (deleted_at IS NULL) |
| `projects` | `projects_pkey` | CREATE UNIQUE INDEX projects_pkey ON public.projects USING btree (id) |
| `projects__services` | `idx_projects__services__deleted_at` | CREATE INDEX idx_projects__services__deleted_at ON public.projects__services USING btree (deleted_at) |
| `projects__services` | `uq_projects__services__project_id__service_id` | CREATE UNIQUE INDEX uq_projects__services__project_id__service_id ON public.projects__services USING btree (project_id, service_id) WHERE (deleted_at IS NULL) |
| `projects__services` | `zjunction_projects_services_pkey` | CREATE UNIQUE INDEX zjunction_projects_services_pkey ON public.projects__services USING btree (id) |
| `quotes` | `idx_quotes__deleted_at` | CREATE INDEX idx_quotes__deleted_at ON public.quotes USING btree (deleted_at) |
| `quotes` | `idx_quotes__project_id` | CREATE INDEX idx_quotes__project_id ON public.quotes USING btree (project_id) WHERE (deleted_at IS NULL) |
| `quotes` | `idx_quotes__quote_status_id` | CREATE INDEX idx_quotes__quote_status_id ON public.quotes USING btree (quote_status_id) WHERE (deleted_at IS NULL) |
| `quotes` | `quotes_pkey` | CREATE UNIQUE INDEX quotes_pkey ON public.quotes USING btree (id) |
| `quotes` | `uq_quotes__quote_number` | CREATE UNIQUE INDEX uq_quotes__quote_number ON public.quotes USING btree (quote_number) WHERE ((quote_number IS NOT NULL) AND (deleted_at IS NULL)) |
| `quotes_status_field` | `quotes_StatusField_id_unique` | CREATE UNIQUE INDEX "quotes_StatusField_id_unique" ON public.quotes_status_field USING btree (id) |
| `quotes_status_field` | `quotes_StatusField_pkey` | CREATE UNIQUE INDEX "quotes_StatusField_pkey" ON public.quotes_status_field USING btree (id) |
| `quotes_status_field` | `uq_quotes_status_field__code` | CREATE UNIQUE INDEX uq_quotes_status_field__code ON public.quotes_status_field USING btree (code) WHERE (deleted_at IS NULL) |
| `quotes_status_field` | `uq_quotes_status_field__id_uuid` | CREATE UNIQUE INDEX uq_quotes_status_field__id_uuid ON public.quotes_status_field USING btree (id_uuid) |
| `rls_permissions` | `idx_rls_permissions__app_role_active` | CREATE INDEX idx_rls_permissions__app_role_active ON public.rls_permissions USING btree (app_id, role_code) WHERE (disabled_at IS NULL) |
| `rls_permissions` | `idx_rls_permissions__table_name` | CREATE INDEX idx_rls_permissions__table_name ON public.rls_permissions USING btree (table_name) WHERE (disabled_at IS NULL) |
| `rls_permissions` | `rls_permissions_pkey` | CREATE UNIQUE INDEX rls_permissions_pkey ON public.rls_permissions USING btree (id) |
| `rls_permissions` | `uq_rls_permissions__table_name__app_id__role_code` | CREATE UNIQUE INDEX uq_rls_permissions__table_name__app_id__role_code ON public.rls_permissions USING btree (table_name, app_id, role_code) |
| `rls_permissions_audit` | `idx_rls_permissions_audit__app_role` | CREATE INDEX idx_rls_permissions_audit__app_role ON public.rls_permissions_audit USING btree (app_id, role_code) |
| `rls_permissions_audit` | `idx_rls_permissions_audit__changed_at` | CREATE INDEX idx_rls_permissions_audit__changed_at ON public.rls_permissions_audit USING btree (changed_at DESC) |
| `rls_permissions_audit` | `idx_rls_permissions_audit__table_name` | CREATE INDEX idx_rls_permissions_audit__table_name ON public.rls_permissions_audit USING btree (table_name) |
| `rls_permissions_audit` | `rls_permissions_audit_pkey` | CREATE UNIQUE INDEX rls_permissions_audit_pkey ON public.rls_permissions_audit USING btree (id) |
| `roles` | `roles_pkey` | CREATE UNIQUE INDEX roles_pkey ON public.roles USING btree (code) |
| `roles` | `uq_roles__code` | CREATE UNIQUE INDEX uq_roles__code ON public.roles USING btree (code) WHERE (deleted_at IS NULL) |
| `roles` | `uq_roles__id` | CREATE UNIQUE INDEX uq_roles__id ON public.roles USING btree (id) |
| `services` | `idx_services__service_type_id` | CREATE INDEX idx_services__service_type_id ON public.services USING btree (service_type_id) WHERE (deleted_at IS NULL) |
| `services` | `services_name_uniq` | CREATE UNIQUE INDEX services_name_uniq ON public.services USING btree (name) |
| `services` | `services_pkey` | CREATE UNIQUE INDEX services_pkey ON public.services USING btree (id) |
| `services` | `uq_services__code` | CREATE UNIQUE INDEX uq_services__code ON public.services USING btree (code) WHERE (deleted_at IS NULL) |
| `services` | `uq_services__id_uuid` | CREATE UNIQUE INDEX uq_services__id_uuid ON public.services USING btree (id_uuid) |
| `services__deals` | `idx_services__deals__deleted_at` | CREATE INDEX idx_services__deals__deleted_at ON public.services__deals USING btree (deleted_at) |
| `services__deals` | `services__deals_pkey` | CREATE UNIQUE INDEX services__deals_pkey ON public.services__deals USING btree (id) |
| `services__deals` | `uq_services__deals__service_id__deal_id` | CREATE UNIQUE INDEX uq_services__deals__service_id__deal_id ON public.services__deals USING btree (service_id, deal_id) WHERE (deleted_at IS NULL) |
| `services_type_field` | `services_TypeField_id_unique` | CREATE UNIQUE INDEX "services_TypeField_id_unique" ON public.services_type_field USING btree (id) |
| `services_type_field` | `services_type_field_legacy_id_uniq` | CREATE UNIQUE INDEX services_type_field_legacy_id_uniq ON public.services_type_field USING btree (id) |
| `services_type_field` | `services_type_field_pkey` | CREATE UNIQUE INDEX services_type_field_pkey ON public.services_type_field USING btree (id_uuid) |
| `services_type_field` | `uq_services_type_field__code` | CREATE UNIQUE INDEX uq_services_type_field__code ON public.services_type_field USING btree (lower(code)) WHERE ((deleted_at IS NULL) AND (code IS NOT NULL)) |
| `services_type_field` | `uq_services_type_field__name` | CREATE UNIQUE INDEX uq_services_type_field__name ON public.services_type_field USING btree (lower(name)) WHERE ((deleted_at IS NULL) AND (name IS NOT NULL)) |
| `spatial_ref_sys` | `spatial_ref_sys_pkey` | CREATE UNIQUE INDEX spatial_ref_sys_pkey ON public.spatial_ref_sys USING btree (srid) |
| `standard_inspection_types` | `idx_standard_inspection_types__trade_id` | CREATE INDEX idx_standard_inspection_types__trade_id ON public.standard_inspection_types USING btree (trade_id) WHERE (deleted_at IS NULL) |
| `standard_inspection_types` | `standard_inspection_types_name_uniq` | CREATE UNIQUE INDEX standard_inspection_types_name_uniq ON public.standard_inspection_types USING btree (name) WHERE (name IS NOT NULL) |
| `standard_inspection_types` | `standard_inspection_types_pkey` | CREATE UNIQUE INDEX standard_inspection_types_pkey ON public.standard_inspection_types USING btree (id) |
| `standard_inspection_types` | `uq_standard_inspection_types__code` | CREATE UNIQUE INDEX uq_standard_inspection_types__code ON public.standard_inspection_types USING btree (code) WHERE (deleted_at IS NULL) |
| `standard_inspection_types` | `uq_standard_inspection_types__id_uuid` | CREATE UNIQUE INDEX uq_standard_inspection_types__id_uuid ON public.standard_inspection_types USING btree (id) |
| `standard_inspection_types__inspection_modes` | `standard_inspection_types__inspection_modes_pkey` | CREATE UNIQUE INDEX standard_inspection_types__inspection_modes_pkey ON public.standard_inspection_types__inspection_modes USING btree (id) |
| `standard_inspection_types__inspection_modes` | `uq_standard_inspection_types__inspection_modes` | CREATE UNIQUE INDEX uq_standard_inspection_types__inspection_modes ON public.standard_inspection_types__inspection_modes USING btree (standard_inspection_type_id, inspection_mode_id) WHERE (deleted... |
| `test_records` | `idx_test_records_run_id` | CREATE INDEX idx_test_records_run_id ON public.test_records USING btree (run_id) |
| `test_records` | `idx_test_records_scenario_id` | CREATE INDEX idx_test_records_scenario_id ON public.test_records USING btree (scenario_id) |
| `test_records` | `idx_test_records_table_name` | CREATE INDEX idx_test_records_table_name ON public.test_records USING btree (table_name) |
| `test_records` | `idx_test_records_table_record` | CREATE INDEX idx_test_records_table_record ON public.test_records USING btree (table_name, record_id) |
| `test_records` | `test_records_pkey` | CREATE UNIQUE INDEX test_records_pkey ON public.test_records USING btree (id) |
| `test_runs` | `idx_test_runs_purged_at` | CREATE INDEX idx_test_runs_purged_at ON public.test_runs USING btree (purged_at) |
| `test_runs` | `idx_test_runs_run_by` | CREATE INDEX idx_test_runs_run_by ON public.test_runs USING btree (run_by) |
| `test_runs` | `idx_test_runs_scenario_id` | CREATE INDEX idx_test_runs_scenario_id ON public.test_runs USING btree (scenario_id) |
| `test_runs` | `test_runs_pkey` | CREATE UNIQUE INDEX test_runs_pkey ON public.test_runs USING btree (id) |
| `test_scenarios` | `test_scenarios_pkey` | CREATE UNIQUE INDEX test_scenarios_pkey ON public.test_scenarios USING btree (id) |
| `threads` | `idx_threads_is_closed` | CREATE INDEX idx_threads_is_closed ON public.threads USING btree (is_closed) WHERE (is_closed = false) |
| `threads` | `idx_threads_last_activity` | CREATE INDEX idx_threads_last_activity ON public.threads USING btree (last_activity_at DESC) |
| `threads` | `idx_threads_target` | CREATE INDEX idx_threads_target ON public.threads USING btree (target_type, target_id) |
| `threads` | `idx_threads_target_type_closed` | CREATE INDEX idx_threads_target_type_closed ON public.threads USING btree (target_type, target_id, is_closed) WHERE (is_closed = false) |
| `threads` | `threads_pkey` | CREATE UNIQUE INDEX threads_pkey ON public.threads USING btree (id) |
| `threads` | `threads_target_type_target_id_key` | CREATE UNIQUE INDEX threads_target_type_target_id_key ON public.threads USING btree (target_type, target_id) |
| `trades` | `fk_permit_exp_trades_bq_04sfvsf` | CREATE INDEX fk_permit_exp_trades_bq_04sfvsf ON public.trades USING btree (permit_expediting_id) |
| `trades` | `trades_name_uniq` | CREATE UNIQUE INDEX trades_name_uniq ON public.trades USING btree (name) |
| `trades` | `trades_pkey` | CREATE UNIQUE INDEX trades_pkey ON public.trades USING btree (id) |
| `trades` | `uq_trades__code` | CREATE UNIQUE INDEX uq_trades__code ON public.trades USING btree (code) WHERE (deleted_at IS NULL) |
| `trades` | `uq_trades__id_uuid` | CREATE UNIQUE INDEX uq_trades__id_uuid ON public.trades USING btree (id) |
| `user_profiles` | `idx_user_profiles__app_id` | CREATE INDEX idx_user_profiles__app_id ON public.user_profiles USING btree (app_id) WHERE (deleted_at IS NULL) |
| `user_profiles` | `idx_user_profiles__contact_id` | CREATE INDEX idx_user_profiles__contact_id ON public.user_profiles USING btree (contact_id) WHERE (deleted_at IS NULL) |
| `user_profiles` | `idx_user_profiles__role_code` | CREATE INDEX idx_user_profiles__role_code ON public.user_profiles USING btree (role_code) WHERE (deleted_at IS NULL) |
| `user_profiles` | `idx_user_profiles__status_id` | CREATE INDEX idx_user_profiles__status_id ON public.user_profiles USING btree (status_id) WHERE (deleted_at IS NULL) |
| `user_profiles` | `user_profiles_pkey` | CREATE UNIQUE INDEX user_profiles_pkey ON public.user_profiles USING btree (id) |
| `user_profiles_status_field` | `uq_user_profiles_status_field__code` | CREATE UNIQUE INDEX uq_user_profiles_status_field__code ON public.user_profiles_status_field USING btree (code) WHERE (deleted_at IS NULL) |
| `user_profiles_status_field` | `uq_user_profiles_status_field__id_uuid` | CREATE UNIQUE INDEX uq_user_profiles_status_field__id_uuid ON public.user_profiles_status_field USING btree (id_uuid) |
| `user_profiles_status_field` | `userProfiles_StatusField_id_unique` | CREATE UNIQUE INDEX "userProfiles_StatusField_id_unique" ON public.user_profiles_status_field USING btree (id) |
| `user_profiles_status_field` | `userProfiles_StatusField_pkey` | CREATE UNIQUE INDEX "userProfiles_StatusField_pkey" ON public.user_profiles_status_field USING btree (id) |

---

## Row Level Security (RLS) Policies

### Public Schema RLS Policies

| Table | Policy Name | Command | Roles |
|-------|-------------|---------|-------|
| `agreements` | agreementsDelete | DELETE | authenticated |
| `agreements` | agreementsInsert | INSERT | authenticated |
| `agreements` | agreementsSelect | SELECT | authenticated |
| `agreements` | agreementsUpdate | UPDATE | authenticated |
| `agreements_status_field` | agreements_StatusField_select_authenticated | SELECT | authenticated |
| `apps` | apps_select_authenticated | SELECT | authenticated |
| `apps__roles` | apps_roles_select_authenticated | SELECT | authenticated |
| `apps__roles` | zjunction_apps_roles_insert_authenticated | INSERT | authenticated |
| `apps__roles` | zjunction_apps_roles_update_authenticated | UPDATE | authenticated |
| `bcp` | bcpDelete | DELETE | authenticated |
| `bcp` | bcpInsert | INSERT | authenticated |
| `bcp` | bcpSelect | SELECT | authenticated |
| `bcp` | bcpUpdate | UPDATE | authenticated |
| `bcp_availability_field` | bcp_AvailabilityField_select_authenticated | SELECT | authenticated |
| `bcp_qualified_services` | bcpQualifiedServices_select_authenticated | SELECT | authenticated |
| `bd_inspection_types` | bdInspectionTypes_select_authenticated | SELECT | authenticated |
| `building_departments` | building_departmentsDelete | DELETE | authenticated |
| `building_departments` | building_departmentsInsert | INSERT | authenticated |
| `building_departments` | building_departmentsSelect | SELECT | authenticated |
| `building_departments` | building_departmentsUpdate | UPDATE | authenticated |
| `building_departments__bcp` | bd_bcp_select_authenticated | SELECT | authenticated |
| `building_departments__bcp` | zjunction_buildingdepartments_bcp_insert_authenticated | INSERT | authenticated |
| `building_departments__bcp` | zjunction_buildingdepartments_bcp_update_authenticated | UPDATE | authenticated |
| `building_departments_registration_status_field` | buildingDepartments_RegistrationStatusField_select_authenticate | SELECT | authenticated |
| `client_users` | clientusersdelete | DELETE | authenticated |
| `client_users` | clientusersinsert | INSERT | authenticated |
| `client_users` | clientusersselect | SELECT | authenticated |
| `client_users` | clientusersupdate | UPDATE | authenticated |
| `companies` | companiesDelete | DELETE | authenticated |
| `companies` | companiesInsert | INSERT | authenticated |
| `companies` | companiesSelect | SELECT | authenticated |
| `companies` | companiesUpdate | UPDATE | authenticated |
| `companies__building_departments` | zJunction_Companies_BuildingDepartments_delete_authenticated | DELETE | authenticated |
| `companies__building_departments` | zJunction_Companies_BuildingDepartments_insert_authenticated | INSERT | authenticated |
| `companies__building_departments` | zJunction_Companies_BuildingDepartments_select_authenticated | SELECT | authenticated |
| `companies__building_departments` | zJunction_Companies_BuildingDepartments_update_authenticated | UPDATE | authenticated |
| `companies__building_departments` | zjunction_companies_buildingdepartments_insert_authenticated | INSERT | authenticated |
| `companies__building_departments` | zjunction_companies_buildingdepartments_update_authenticated | UPDATE | authenticated |
| `companies__contacts` | zJunction_Companies_Contacts_select_authenticated | SELECT | authenticated |
| `companies__contacts` | zjunction_companies_contacts_insert_authenticated | INSERT | authenticated |
| `companies__contacts` | zjunction_companies_contacts_update_authenticated | UPDATE | authenticated |
| `companies__industry_roles` | companies_industry_select_company_users | SELECT | authenticated |
| `companies__industry_roles` | zJunction_Companies_CompaniesIndustryRolesField_select_authenti | SELECT | authenticated |
| `companies__industry_roles` | zjunction_companies_companiesindustryrolesfield_insert_authenti | INSERT | authenticated |
| `companies__industry_roles` | zjunction_companies_companiesindustryrolesfield_update_authenti | UPDATE | authenticated |
| `companies__permit_expediting` | companies_pe_select_company_users | SELECT | authenticated |
| `companies__permit_expediting` | zjunction_companies_permitexpediting_insert_authenticated | INSERT | authenticated |
| `companies__permit_expediting` | zjunction_companies_permitexpediting_update_authenticated | UPDATE | authenticated |
| `companies__professional_licenses` | companies_licenses_select_company_users | SELECT | authenticated |
| `companies__professional_licenses` | zjunction_companies_professionallicenses_insert_authenticated | INSERT | authenticated |
| `companies__professional_licenses` | zjunction_companies_professionallicenses_update_authenticated | UPDATE | authenticated |
| `companies__services` | zJunction_Companies_Services_select_authenticated | SELECT | authenticated |
| `companies__services` | zjunction_companies_services_insert_authenticated | INSERT | authenticated |
| `companies__services` | zjunction_companies_services_update_authenticated | UPDATE | authenticated |
| `companies__subcontractors` | companies_subcontractors_select_company_users | SELECT | authenticated |
| `companies__subcontractors` | zjunction_companies_companiessubcontractors_insert_authenticate | INSERT | authenticated |
| `companies__subcontractors` | zjunction_companies_companiessubcontractors_update_authenticate | UPDATE | authenticated |
| `companies__tech_tools` | zJunction_Companies_CompaniesTechToolsField_select_authenticate | SELECT | authenticated |
| `companies__tech_tools` | zjunction_companies_companiestechtoolsfield_insert_authenticate | INSERT | authenticated |
| `companies__tech_tools` | zjunction_companies_companiestechtoolsfield_update_authenticate | UPDATE | authenticated |
| `companies__work_types` | zJunction_Companies_CompaniesWorkTypesField_select_authenticate | SELECT | authenticated |
| `companies__work_types` | zjunction_companies_companiesworktypesfield_insert_authenticate | INSERT | authenticated |
| `companies__work_types` | zjunction_companies_companiesworktypesfield_update_authenticate | UPDATE | authenticated |
| `companies_account_type_field` | companies_AccountTypeField_select_authenticated | SELECT | authenticated |
| `companies_annual_revenue_field` | companies_AnnualRevenueField_select_authenticated | SELECT | authenticated |
| `companies_client_stage_field` | companies_ClientStageField_select_authenticated | SELECT | authenticated |
| `companies_industry_role_field` | companies_IndustryRoleField_select_anon | SELECT | public |
| `companies_industry_role_field` | companies_IndustryRoleField_select_authenticated | SELECT | authenticated |
| `companies_interest_field` | companies_InterestField_select_anon | SELECT | public |
| `companies_interest_field` | companies_InterestField_select_authenticated | SELECT | authenticated |
| `companies_organization_field` | companies_OrganizationField_select_anon | SELECT | public |
| `companies_organization_field` | companies_OrganizationField_select_authenticated | SELECT | authenticated |
| `companies_referral_source_field` | companies_ReferralSourceField_select_anon | SELECT | public |
| `companies_referral_source_field` | companies_ReferralSourceField_select_authenticated | SELECT | authenticated |
| `companies_tech_savvy_field` | companies_TechSavvyField_select_anon | SELECT | public |
| `companies_tech_savvy_field` | companies_TechSavvyField_select_authenticated | SELECT | authenticated |
| `companies_tech_tools_field` | companies_TechToolsField_select_anon | SELECT | public |
| `companies_tech_tools_field` | companies_TechToolsField_select_authenticated | SELECT | authenticated |
| `companies_work_types_field` | companies_WorkTypesField_select_anon | SELECT | public |
| `companies_work_types_field` | companies_WorkTypesField_select_authenticated | SELECT | authenticated |
| `construction_types` | constructionTypes_select_authenticated | SELECT | authenticated |
| `construction_types__project_types` | ct_pt_select_authenticated | SELECT | authenticated |
| `construction_types__project_types` | zjunction_constructiontypes_projecttypes_insert_authenticated | INSERT | authenticated |
| `construction_types__project_types` | zjunction_constructiontypes_projecttypes_update_authenticated | UPDATE | authenticated |
| `contacts` | contactsDelete | DELETE | authenticated |
| `contacts` | contactsInsert | INSERT | authenticated |
| `contacts` | contactsSelect | SELECT | authenticated |
| `contacts` | contactsUpdate | UPDATE | authenticated |
| `contacts__building_departments` | contacts_bd_select_company_users | SELECT | authenticated |
| `contacts__building_departments` | zjunction_contacts_buildingdepartments_insert_authenticated | INSERT | authenticated |
| `contacts__building_departments` | zjunction_contacts_buildingdepartments_update_authenticated | UPDATE | authenticated |
| `contacts__projects` | contacts_projects_select_company_users | SELECT | authenticated |
| `contacts__projects` | zjunction_contacts_projects_insert_authenticated | INSERT | authenticated |
| `contacts__projects` | zjunction_contacts_projects_update_authenticated | UPDATE | authenticated |
| `contacts_type_field` | contacts_TypeField_select_authenticated | SELECT | authenticated |
| `deal_phase_field` | deal_PhaseField_select_authenticated | SELECT | authenticated |
| `deal_qualification_field` | deal_QualificationField_select_authenticated | SELECT | authenticated |
| `deals` | dealsDelete | DELETE | authenticated |
| `deals` | dealsInsert | INSERT | authenticated |
| `deals` | dealsSelect | SELECT | authenticated |
| `deals` | dealsUpdate | UPDATE | authenticated |
| `deals__other_contacts` | zJunction_Deals_ContactsOtherContactsField_select_authenticated | SELECT | authenticated |
| `deals__other_contacts` | zjunction_deals_contactsothercontactsfield_insert_authenticated | INSERT | authenticated |
| `deals__other_contacts` | zjunction_deals_contactsothercontactsfield_update_authenticated | UPDATE | authenticated |
| `disciplines` | disciplines_select_authenticated | SELECT | authenticated |
| `employee_users` | employeeusersdelete | DELETE | authenticated |
| `employee_users` | employeeusersinsert | INSERT | authenticated |
| `employee_users` | employeeusersselect | SELECT | authenticated |
| `employee_users` | employeeusersupdate | UPDATE | authenticated |
| `files` | filesDelete | DELETE | authenticated |
| `files` | filesInsert | INSERT | authenticated |
| `files` | filesSelect | SELECT | authenticated |
| `files` | filesUpdate | UPDATE | authenticated |
| `inspection_modes` | inspectionModes_select_authenticated | SELECT | authenticated |
| `inspection_sessions` | inspectionSessionsDelete | DELETE | authenticated |
| `inspection_sessions` | inspectionSessionsInsert | INSERT | authenticated |
| `inspection_sessions` | inspectionSessionsSelect | SELECT | authenticated |
| `inspection_sessions` | inspectionSessionsUpdate | UPDATE | authenticated |
| `inspection_sessions__contacts` | contacts_insp_sessions_select_company_users | SELECT | authenticated |
| `inspection_sessions__contacts` | zjunction_contacts_inspectionsessions_insert_authenticated | INSERT | authenticated |
| `inspection_sessions__contacts` | zjunction_contacts_inspectionsessions_update_authenticated | UPDATE | authenticated |
| `inspection_sessions__project_media` | ispm_select_company_users | SELECT | authenticated |
| `inspection_sessions__project_media` | zjunction_inspectionsessions_projectmedia_insert_authenticated | INSERT | authenticated |
| `inspection_sessions__project_media` | zjunction_inspectionsessions_projectmedia_update_authenticated | UPDATE | authenticated |
| `inspection_sessions_status_field` | inspectionSessions_StatusField_select_authenticated | SELECT | authenticated |
| `inspections` | inspectionsDelete | DELETE | authenticated |
| `inspections` | inspectionsInsert | INSERT | authenticated |
| `inspections` | inspectionsSelect | SELECT | authenticated |
| `inspections` | inspectionsUpdate | UPDATE | authenticated |
| `inspections_result_field` | inspections_ResultField_select_authenticated | SELECT | authenticated |
| `invoice_line_items` | invoiceLineItemsDelete | DELETE | authenticated |
| `invoice_line_items` | invoiceLineItemsInsert | INSERT | authenticated |
| `invoice_line_items` | invoiceLineItemsSelect | SELECT | authenticated |
| `invoice_line_items` | invoiceLineItemsUpdate | UPDATE | authenticated |
| `invoice_line_items_status_field` | invoiceLineItems_StatusField_select_authenticated | SELECT | authenticated |
| `invoices` | invoicesDelete | DELETE | authenticated |
| `invoices` | invoicesInsert | INSERT | authenticated |
| `invoices` | invoicesSelect | SELECT | authenticated |
| `invoices` | invoicesUpdate | UPDATE | authenticated |
| `invoices_collection_status_field` | invoices_CollectionStatusField_select_authenticated | SELECT | authenticated |
| `invoices_payment_status_field` | invoices_PaymentStatusField_select_authenticated | SELECT | authenticated |
| `issue_comments` | issueCommentsDelete | DELETE | authenticated |
| `issue_comments` | issueCommentsInsert | INSERT | authenticated |
| `issue_comments` | issueCommentsSelect | SELECT | authenticated |
| `issue_comments` | issueCommentsUpdate | UPDATE | authenticated |
| `occupancies` | occupancies_select_authenticated | SELECT | authenticated |
| `payment_processors` | paymentProcessors_delete_admin | DELETE | authenticated |
| `payment_processors` | paymentProcessors_insert_admin | INSERT | authenticated |
| `payment_processors` | paymentProcessors_select_admin | SELECT | authenticated |
| `payment_processors` | paymentProcessors_update_admin | UPDATE | authenticated |
| `payments` | paymentsDelete | DELETE | authenticated |
| `payments` | paymentsInsert | INSERT | authenticated |
| `payments` | paymentsSelect | SELECT | authenticated |
| `payments` | paymentsUpdate | UPDATE | authenticated |
| `payments__invoices` | zJunction_Payments_InvoicesDelete | DELETE | authenticated |
| `payments__invoices` | zJunction_Payments_InvoicesInsert | INSERT | authenticated |
| `payments__invoices` | zJunction_Payments_InvoicesSelect | SELECT | authenticated |
| `payments__invoices` | zJunction_Payments_InvoicesUpdate | UPDATE | authenticated |
| `payments__invoices` | zjunction_payments_invoices_insert_authenticated | INSERT | authenticated |
| `payments__invoices` | zjunction_payments_invoices_update_authenticated | UPDATE | authenticated |
| `permit_expediting` | permit_expeditingDelete | DELETE | authenticated |
| `permit_expediting` | permit_expeditingInsert | INSERT | authenticated |
| `permit_expediting` | permit_expeditingSelect | SELECT | authenticated |
| `permit_expediting` | permit_expeditingUpdate | UPDATE | authenticated |
| `permit_expediting_document_status_field` | permitExpediting_DocumentStatusField_select_authenticated | SELECT | authenticated |
| `permit_expediting_fees_status_field` | permitExpediting_FeesStatusField_select_authenticated | SELECT | authenticated |
| `permit_expediting_noc_status_field` | permitExpediting_NOCStatusField_select_authenticated | SELECT | authenticated |
| `permit_expediting_ntbo_status_field` | permitExpediting_NTBOStatusField_select_authenticated | SELECT | authenticated |
| `permit_expediting_permit_app_status_field` | permitExpediting_PermitAppStatusField_select_authenticated | SELECT | authenticated |
| `permit_expediting_private_provider_field` | permitExpediting_PrivateProviderField_select_authenticated | SELECT | authenticated |
| `permit_expediting_status_field` | permitExpediting_StatusField_select_authenticated | SELECT | authenticated |
| `permit_expediting_sub_form_field` | permitExpediting_SubFormField_select_authenticated | SELECT | authenticated |
| `permit_expediting_sub_permit_type_field` | permitExpediting_SubPermitTypeField_select_authenticated | SELECT | authenticated |
| `permit_expediting_subcontractor_info_field` | permitExpediting_SubcontractorInfoField_select_authenticated | SELECT | authenticated |
| `permit_expediting_workability_field` | permitExpediting_WorkabilityField_select_authenticated | SELECT | authenticated |
| `plan_review_result_field` | planReview_ResultField_select_authenticated | SELECT | authenticated |
| `plan_reviews` | planReviewsDelete | DELETE | authenticated |
| `plan_reviews` | planReviewsInsert | INSERT | authenticated |
| `plan_reviews` | planReviewsSelect | SELECT | authenticated |
| `plan_reviews` | planReviewsUpdate | UPDATE | authenticated |
| `plan_reviews_status_field` | planReviews_StatusField_select_authenticated | SELECT | authenticated |
| `plan_sets` | planSetsDelete | DELETE | authenticated |
| `plan_sets` | planSetsInsert | INSERT | authenticated |
| `plan_sets` | planSetsSelect | SELECT | authenticated |
| `plan_sets` | planSetsUpdate | UPDATE | authenticated |
| `plan_sets__files` | plansets_files_select_company_users | SELECT | authenticated |
| `plan_sets__files` | zjunction_plansets_files_insert_authenticated | INSERT | authenticated |
| `plan_sets__files` | zjunction_plansets_files_update_authenticated | UPDATE | authenticated |
| `plan_sets_document_review_field` | planSets_DocumentReviewField_select_authenticated | SELECT | authenticated |
| `plan_sets_file_types` | plan_sets_file_typesDelete | DELETE | authenticated |
| `plan_sets_file_types` | plan_sets_file_typesInsert | INSERT | authenticated |
| `plan_sets_file_types` | plan_sets_file_typesSelect | SELECT | authenticated |
| `plan_sets_file_types` | plan_sets_file_typesUpdate | UPDATE | authenticated |
| `plan_sets_type_field` | planSets_TypeField_select_authenticated | SELECT | authenticated |
| `plan_sets_working_set_field` | planSets_WorkingSetField_select_authenticated | SELECT | authenticated |
| `price_list` | priceListDelete | DELETE | authenticated |
| `price_list` | priceListInsert | INSERT | authenticated |
| `price_list` | priceListSelect | SELECT | authenticated |
| `price_list` | priceListUpdate | UPDATE | authenticated |
| `price_list_status_field` | priceList_StatusField_select_authenticated | SELECT | authenticated |
| `professional_licenses` | professionalLicensesDelete | DELETE | authenticated |
| `professional_licenses` | professionalLicensesInsert | INSERT | authenticated |
| `professional_licenses` | professionalLicensesSelect | SELECT | authenticated |
| `professional_licenses` | professionalLicensesUpdate | UPDATE | authenticated |
| `professional_licenses__bcp_qualified_services` | pl_bqs_select_authenticated | SELECT | authenticated |
| `professional_licenses__bcp_qualified_services` | zjunction_professionallicenses_bcpqualifiedservices_insert_auth | INSERT | authenticated |
| `professional_licenses__bcp_qualified_services` | zjunction_professionallicenses_bcpqualifiedservices_update_auth | UPDATE | authenticated |
| `professional_licenses_status_field` | professionalLicenses_StatusField_select_authenticated | SELECT | authenticated |
| `professional_licenses_type_field` | professionalLicenses_TypeField_select_authenticated | SELECT | authenticated |
| `project_media` | projects_files_select_company_users | SELECT | authenticated |
| `project_media` | zjunction_projects_files_insert_authenticated | INSERT | authenticated |
| `project_media` | zjunction_projects_files_update_authenticated | UPDATE | authenticated |
| `project_media_upload_method_field` | projectMedia_UploadMethodField_select_authenticated | SELECT | authenticated |
| `project_phases` | projectPhases_select_authenticated | SELECT | authenticated |
| `project_phases_status_field` | project_phases_status_fieldDelete | DELETE | authenticated |
| `project_phases_status_field` | project_phases_status_fieldInsert | INSERT | authenticated |
| `project_phases_status_field` | project_phases_status_fieldSelect | SELECT | authenticated |
| `project_phases_status_field` | project_phases_status_fieldUpdate | UPDATE | authenticated |
| `project_types` | projectTypes_select_authenticated | SELECT | authenticated |
| `projects` | projectsDelete | DELETE | authenticated |
| `projects` | projectsInsert | INSERT | authenticated |
| `projects` | projectsSelect | SELECT | authenticated |
| `projects` | projectsUpdate | UPDATE | authenticated |
| `projects__services` | projects_services_select_company_users | SELECT | authenticated |
| `projects__services` | zjunction_projects_services_insert_authenticated | INSERT | authenticated |
| `projects__services` | zjunction_projects_services_update_authenticated | UPDATE | authenticated |
| `quotes` | quotesDelete | DELETE | authenticated |
| `quotes` | quotesInsert | INSERT | authenticated |
| `quotes` | quotesSelect | SELECT | authenticated |
| `quotes` | quotesUpdate | UPDATE | authenticated |
| `quotes_status_field` | quotes_StatusField_select_authenticated | SELECT | authenticated |
| `rls_permissions` | rlspermissionsadminrw | ALL | authenticated |
| `rls_permissions_audit` | rlspermissions_audit_delete_admin | DELETE | authenticated |
| `rls_permissions_audit` | rlspermissions_audit_insert_admin | INSERT | authenticated |
| `rls_permissions_audit` | rlspermissions_audit_select_admin | SELECT | authenticated |
| `rls_permissions_audit` | rlspermissions_audit_update_admin | UPDATE | authenticated |
| `roles` | roles_select_authenticated | SELECT | authenticated |
| `services` | services_select_authenticated | SELECT | authenticated |
| `services__deals` | zJunction_Services_DealsDelete | DELETE | authenticated |
| `services__deals` | zJunction_Services_DealsInsert | INSERT | authenticated |
| `services__deals` | zJunction_Services_DealsSelect | SELECT | authenticated |
| `services__deals` | zJunction_Services_DealsUpdate | UPDATE | authenticated |
| `services__deals` | zjunction_services_deals_insert_authenticated | INSERT | authenticated |
| `services__deals` | zjunction_services_deals_update_authenticated | UPDATE | authenticated |
| `services_type_field` | services_TypeField_select_authenticated | SELECT | authenticated |
| `standard_inspection_types` | standardInspectionTypes_select_authenticated | SELECT | authenticated |
| `standard_inspection_types__inspection_modes` | sit_im_select_authenticated | SELECT | authenticated |
| `standard_inspection_types__inspection_modes` | zjunction_standardinspectiontypes_inspectionmodes_insert_authen | INSERT | authenticated |
| `standard_inspection_types__inspection_modes` | zjunction_standardinspectiontypes_inspectionmodes_update_authen | UPDATE | authenticated |
| `threads` | Users can create threads | INSERT | public |
| `threads` | Users can read threads | SELECT | public |
| `threads` | Users can update threads | UPDATE | public |
| `trades` | trades_select_authenticated | SELECT | authenticated |
| `user_profiles` | userprofilesdelete | DELETE | authenticated |
| `user_profiles` | userprofilesinsert | INSERT | authenticated |
| `user_profiles` | userprofilesselect | SELECT | authenticated |
| `user_profiles` | userprofilesupdate | UPDATE | authenticated |
| `user_profiles_status_field` | userProfiles_StatusField_select_authenticated | SELECT | authenticated |

---

## Functions

### Public Schema Functions

#### _postgis_deprecate

- **Type**: function
- **Arguments**: oldname text, newname text, version text
- **Returns**: void

#### _postgis_index_extent

- **Type**: function
- **Arguments**: tbl regclass, col text
- **Returns**: box2d

#### _postgis_join_selectivity

- **Type**: function
- **Arguments**: regclass, text, regclass, text, text DEFAULT '2'::text
- **Returns**: double precision

#### _postgis_pgsql_version

- **Type**: function
- **Arguments**: 
- **Returns**: text

#### _postgis_scripts_pgsql_version

- **Type**: function
- **Arguments**: 
- **Returns**: text

#### _postgis_selectivity

- **Type**: function
- **Arguments**: tbl regclass, att_name text, geom geometry, mode text DEFAULT '2'::text
- **Returns**: double precision

#### _postgis_stats

- **Type**: function
- **Arguments**: tbl regclass, att_name text, text DEFAULT '2'::text
- **Returns**: text

#### _st_3ddfullywithin

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry, double precision
- **Returns**: boolean

#### _st_3ddwithin

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry, double precision
- **Returns**: boolean

#### _st_3dintersects

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### _st_asgml

- **Type**: function
- **Arguments**: integer, geometry, integer, integer, text, text
- **Returns**: text

#### _st_asx3d

- **Type**: function
- **Arguments**: integer, geometry, integer, integer, text
- **Returns**: text

#### _st_bestsrid

- **Type**: function
- **Arguments**: geography
- **Returns**: integer

#### _st_bestsrid

- **Type**: function
- **Arguments**: geography, geography
- **Returns**: integer

#### _st_contains

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### _st_containsproperly

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### _st_coveredby

- **Type**: function
- **Arguments**: geog1 geography, geog2 geography
- **Returns**: boolean

#### _st_coveredby

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### _st_covers

- **Type**: function
- **Arguments**: geog1 geography, geog2 geography
- **Returns**: boolean

#### _st_covers

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### _st_crosses

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### _st_dfullywithin

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry, double precision
- **Returns**: boolean

#### _st_distancetree

- **Type**: function
- **Arguments**: geography, geography, double precision, boolean
- **Returns**: double precision

#### _st_distancetree

- **Type**: function
- **Arguments**: geography, geography
- **Returns**: double precision

#### _st_distanceuncached

- **Type**: function
- **Arguments**: geography, geography, boolean
- **Returns**: double precision

#### _st_distanceuncached

- **Type**: function
- **Arguments**: geography, geography, double precision, boolean
- **Returns**: double precision

#### _st_distanceuncached

- **Type**: function
- **Arguments**: geography, geography
- **Returns**: double precision

#### _st_dwithin

- **Type**: function
- **Arguments**: geog1 geography, geog2 geography, tolerance double precision, use_spheroid boolean DEFAULT true
- **Returns**: boolean

#### _st_dwithin

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry, double precision
- **Returns**: boolean

#### _st_dwithinuncached

- **Type**: function
- **Arguments**: geography, geography, double precision
- **Returns**: boolean

#### _st_dwithinuncached

- **Type**: function
- **Arguments**: geography, geography, double precision, boolean
- **Returns**: boolean

#### _st_equals

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### _st_expand

- **Type**: function
- **Arguments**: geography, double precision
- **Returns**: geography

#### _st_geomfromgml

- **Type**: function
- **Arguments**: text, integer
- **Returns**: geometry

#### _st_intersects

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### _st_linecrossingdirection

- **Type**: function
- **Arguments**: line1 geometry, line2 geometry
- **Returns**: integer

#### _st_longestline

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: geometry

#### _st_maxdistance

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: double precision

#### _st_orderingequals

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### _st_overlaps

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### _st_pointoutside

- **Type**: function
- **Arguments**: geography
- **Returns**: geography

#### _st_sortablehash

- **Type**: function
- **Arguments**: geom geometry
- **Returns**: bigint

#### _st_touches

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### _st_voronoi

- **Type**: function
- **Arguments**: g1 geometry, clip geometry DEFAULT NULL::geometry, tolerance double precision DEFAULT 0.0, return_polygons boolean DEFAULT true
- **Returns**: geometry

#### _st_within

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### addauth

- **Type**: function
- **Arguments**: text
- **Returns**: boolean

#### addgeometrycolumn

- **Type**: function
- **Arguments**: table_name character varying, column_name character varying, new_srid integer, new_type character varying, new_dim integer, use_typmod boolean DEFAULT true
- **Returns**: text

#### addgeometrycolumn

- **Type**: function
- **Arguments**: schema_name character varying, table_name character varying, column_name character varying, new_srid integer, new_type character varying, new_dim integer, use_typmod boolean DEFAULT true
- **Returns**: text

#### addgeometrycolumn

- **Type**: function
- **Arguments**: catalog_name character varying, schema_name character varying, table_name character varying, column_name character varying, new_srid_in integer, new_type character varying, new_dim integer, use_typmod boolean DEFAULT true
- **Returns**: text

#### audit_rls_permissions

- **Type**: function
- **Arguments**: 
- **Returns**: trigger

#### box

- **Type**: function
- **Arguments**: box3d
- **Returns**: box

#### box

- **Type**: function
- **Arguments**: geometry
- **Returns**: box

#### box2d

- **Type**: function
- **Arguments**: geometry
- **Returns**: box2d

#### box2d

- **Type**: function
- **Arguments**: box3d
- **Returns**: box2d

#### box2d_in

- **Type**: function
- **Arguments**: cstring
- **Returns**: box2d

#### box2d_out

- **Type**: function
- **Arguments**: box2d
- **Returns**: cstring

#### box2df_in

- **Type**: function
- **Arguments**: cstring
- **Returns**: box2df

#### box2df_out

- **Type**: function
- **Arguments**: box2df
- **Returns**: cstring

#### box3d

- **Type**: function
- **Arguments**: geometry
- **Returns**: box3d

#### box3d

- **Type**: function
- **Arguments**: box2d
- **Returns**: box3d

#### box3d_in

- **Type**: function
- **Arguments**: cstring
- **Returns**: box3d

#### box3d_out

- **Type**: function
- **Arguments**: box3d
- **Returns**: cstring

#### box3dtobox

- **Type**: function
- **Arguments**: box3d
- **Returns**: box

#### bytea

- **Type**: function
- **Arguments**: geometry
- **Returns**: bytea

#### bytea

- **Type**: function
- **Arguments**: geography
- **Returns**: bytea

#### check_table_scoping

- **Type**: function
- **Arguments**: p_table_name text, p_record_id uuid, p_user_id uuid DEFAULT NULL::uuid
- **Returns**: boolean

#### check_table_scoping

- **Type**: function
- **Arguments**: p_table_name text, p_record_id integer, p_user_id uuid DEFAULT auth.uid()
- **Returns**: boolean

#### checkauth

- **Type**: function
- **Arguments**: text, text, text
- **Returns**: integer

#### checkauth

- **Type**: function
- **Arguments**: text, text
- **Returns**: integer

#### checkauthtrigger

- **Type**: function
- **Arguments**: 
- **Returns**: trigger

#### close_thread

- **Type**: function
- **Arguments**: p_thread_id uuid, p_user_id uuid, p_closure_message text DEFAULT NULL::text, p_is_resolved boolean DEFAULT false
- **Returns**: json

#### contains_2d

- **Type**: function
- **Arguments**: box2df, geometry
- **Returns**: boolean

#### contains_2d

- **Type**: function
- **Arguments**: geometry, box2df
- **Returns**: boolean

#### contains_2d

- **Type**: function
- **Arguments**: box2df, box2df
- **Returns**: boolean

#### create_standard_policies

- **Type**: function
- **Arguments**: p_table regclass, p_use_scoping boolean DEFAULT true
- **Returns**: void

#### disablelongtransactions

- **Type**: function
- **Arguments**: 
- **Returns**: text

#### dropgeometrycolumn

- **Type**: function
- **Arguments**: table_name character varying, column_name character varying
- **Returns**: text

#### dropgeometrycolumn

- **Type**: function
- **Arguments**: catalog_name character varying, schema_name character varying, table_name character varying, column_name character varying
- **Returns**: text

#### dropgeometrycolumn

- **Type**: function
- **Arguments**: schema_name character varying, table_name character varying, column_name character varying
- **Returns**: text

#### dropgeometrytable

- **Type**: function
- **Arguments**: table_name character varying
- **Returns**: text

#### dropgeometrytable

- **Type**: function
- **Arguments**: schema_name character varying, table_name character varying
- **Returns**: text

#### dropgeometrytable

- **Type**: function
- **Arguments**: catalog_name character varying, schema_name character varying, table_name character varying
- **Returns**: text

#### enablelongtransactions

- **Type**: function
- **Arguments**: 
- **Returns**: text

#### ensure_contact_for_user_profile

- **Type**: function
- **Arguments**: 
- **Returns**: trigger

#### equals

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### find_srid

- **Type**: function
- **Arguments**: character varying, character varying, character varying
- **Returns**: integer

#### generate_app_api_key

- **Type**: function
- **Arguments**: p_app_code text
- **Returns**: text

#### geog_brin_inclusion_add_value

- **Type**: function
- **Arguments**: internal, internal, internal, internal
- **Returns**: boolean

#### geography

- **Type**: function
- **Arguments**: geography, integer, boolean
- **Returns**: geography

#### geography

- **Type**: function
- **Arguments**: bytea
- **Returns**: geography

#### geography

- **Type**: function
- **Arguments**: geometry
- **Returns**: geography

#### geography_analyze

- **Type**: function
- **Arguments**: internal
- **Returns**: boolean

#### geography_cmp

- **Type**: function
- **Arguments**: geography, geography
- **Returns**: integer

#### geography_distance_knn

- **Type**: function
- **Arguments**: geography, geography
- **Returns**: double precision

#### geography_eq

- **Type**: function
- **Arguments**: geography, geography
- **Returns**: boolean

#### geography_ge

- **Type**: function
- **Arguments**: geography, geography
- **Returns**: boolean

#### geography_gist_compress

- **Type**: function
- **Arguments**: internal
- **Returns**: internal

#### geography_gist_consistent

- **Type**: function
- **Arguments**: internal, geography, integer
- **Returns**: boolean

#### geography_gist_decompress

- **Type**: function
- **Arguments**: internal
- **Returns**: internal

#### geography_gist_distance

- **Type**: function
- **Arguments**: internal, geography, integer
- **Returns**: double precision

#### geography_gist_penalty

- **Type**: function
- **Arguments**: internal, internal, internal
- **Returns**: internal

#### geography_gist_picksplit

- **Type**: function
- **Arguments**: internal, internal
- **Returns**: internal

#### geography_gist_same

- **Type**: function
- **Arguments**: box2d, box2d, internal
- **Returns**: internal

#### geography_gist_union

- **Type**: function
- **Arguments**: bytea, internal
- **Returns**: internal

#### geography_gt

- **Type**: function
- **Arguments**: geography, geography
- **Returns**: boolean

#### geography_in

- **Type**: function
- **Arguments**: cstring, oid, integer
- **Returns**: geography

#### geography_le

- **Type**: function
- **Arguments**: geography, geography
- **Returns**: boolean

#### geography_lt

- **Type**: function
- **Arguments**: geography, geography
- **Returns**: boolean

#### geography_out

- **Type**: function
- **Arguments**: geography
- **Returns**: cstring

#### geography_overlaps

- **Type**: function
- **Arguments**: geography, geography
- **Returns**: boolean

#### geography_recv

- **Type**: function
- **Arguments**: internal, oid, integer
- **Returns**: geography

#### geography_send

- **Type**: function
- **Arguments**: geography
- **Returns**: bytea

#### geography_spgist_choose_nd

- **Type**: function
- **Arguments**: internal, internal
- **Returns**: void

#### geography_spgist_compress_nd

- **Type**: function
- **Arguments**: internal
- **Returns**: internal

#### geography_spgist_config_nd

- **Type**: function
- **Arguments**: internal, internal
- **Returns**: void

#### geography_spgist_inner_consistent_nd

- **Type**: function
- **Arguments**: internal, internal
- **Returns**: void

#### geography_spgist_leaf_consistent_nd

- **Type**: function
- **Arguments**: internal, internal
- **Returns**: boolean

#### geography_spgist_picksplit_nd

- **Type**: function
- **Arguments**: internal, internal
- **Returns**: void

#### geography_typmod_in

- **Type**: function
- **Arguments**: cstring[]
- **Returns**: integer

#### geography_typmod_out

- **Type**: function
- **Arguments**: integer
- **Returns**: cstring

#### geom2d_brin_inclusion_add_value

- **Type**: function
- **Arguments**: internal, internal, internal, internal
- **Returns**: boolean

#### geom3d_brin_inclusion_add_value

- **Type**: function
- **Arguments**: internal, internal, internal, internal
- **Returns**: boolean

#### geom4d_brin_inclusion_add_value

- **Type**: function
- **Arguments**: internal, internal, internal, internal
- **Returns**: boolean

#### geometry

- **Type**: function
- **Arguments**: polygon
- **Returns**: geometry

#### geometry

- **Type**: function
- **Arguments**: geography
- **Returns**: geometry

#### geometry

- **Type**: function
- **Arguments**: bytea
- **Returns**: geometry

#### geometry

- **Type**: function
- **Arguments**: geometry, integer, boolean
- **Returns**: geometry

#### geometry

- **Type**: function
- **Arguments**: point
- **Returns**: geometry

#### geometry

- **Type**: function
- **Arguments**: path
- **Returns**: geometry

#### geometry

- **Type**: function
- **Arguments**: text
- **Returns**: geometry

#### geometry

- **Type**: function
- **Arguments**: box2d
- **Returns**: geometry

#### geometry

- **Type**: function
- **Arguments**: box3d
- **Returns**: geometry

#### geometry_above

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### geometry_analyze

- **Type**: function
- **Arguments**: internal
- **Returns**: boolean

#### geometry_below

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### geometry_cmp

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: integer

#### geometry_contained_3d

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### geometry_contains

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### geometry_contains_3d

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### geometry_contains_nd

- **Type**: function
- **Arguments**: geometry, geometry
- **Returns**: boolean

#### geometry_distance_box

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: double precision

#### geometry_distance_centroid

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: double precision

#### geometry_distance_centroid_nd

- **Type**: function
- **Arguments**: geometry, geometry
- **Returns**: double precision

#### geometry_distance_cpa

- **Type**: function
- **Arguments**: geometry, geometry
- **Returns**: double precision

#### geometry_eq

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### geometry_ge

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### geometry_gist_compress_2d

- **Type**: function
- **Arguments**: internal
- **Returns**: internal

#### geometry_gist_compress_nd

- **Type**: function
- **Arguments**: internal
- **Returns**: internal

#### geometry_gist_consistent_2d

- **Type**: function
- **Arguments**: internal, geometry, integer
- **Returns**: boolean

#### geometry_gist_consistent_nd

- **Type**: function
- **Arguments**: internal, geometry, integer
- **Returns**: boolean

#### geometry_gist_decompress_2d

- **Type**: function
- **Arguments**: internal
- **Returns**: internal

#### geometry_gist_decompress_nd

- **Type**: function
- **Arguments**: internal
- **Returns**: internal

#### geometry_gist_distance_2d

- **Type**: function
- **Arguments**: internal, geometry, integer
- **Returns**: double precision

#### geometry_gist_distance_nd

- **Type**: function
- **Arguments**: internal, geometry, integer
- **Returns**: double precision

#### geometry_gist_penalty_2d

- **Type**: function
- **Arguments**: internal, internal, internal
- **Returns**: internal

#### geometry_gist_penalty_nd

- **Type**: function
- **Arguments**: internal, internal, internal
- **Returns**: internal

#### geometry_gist_picksplit_2d

- **Type**: function
- **Arguments**: internal, internal
- **Returns**: internal

#### geometry_gist_picksplit_nd

- **Type**: function
- **Arguments**: internal, internal
- **Returns**: internal

#### geometry_gist_same_2d

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry, internal
- **Returns**: internal

#### geometry_gist_same_nd

- **Type**: function
- **Arguments**: geometry, geometry, internal
- **Returns**: internal

#### geometry_gist_sortsupport_2d

- **Type**: function
- **Arguments**: internal
- **Returns**: void

#### geometry_gist_union_2d

- **Type**: function
- **Arguments**: bytea, internal
- **Returns**: internal

#### geometry_gist_union_nd

- **Type**: function
- **Arguments**: bytea, internal
- **Returns**: internal

#### geometry_gt

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### geometry_hash

- **Type**: function
- **Arguments**: geometry
- **Returns**: integer

#### geometry_in

- **Type**: function
- **Arguments**: cstring
- **Returns**: geometry

#### geometry_le

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### geometry_left

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### geometry_lt

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### geometry_out

- **Type**: function
- **Arguments**: geometry
- **Returns**: cstring

#### geometry_overabove

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### geometry_overbelow

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### geometry_overlaps

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### geometry_overlaps_3d

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### geometry_overlaps_nd

- **Type**: function
- **Arguments**: geometry, geometry
- **Returns**: boolean

#### geometry_overleft

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### geometry_overright

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### geometry_recv

- **Type**: function
- **Arguments**: internal
- **Returns**: geometry

#### geometry_right

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### geometry_same

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### geometry_same_3d

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### geometry_same_nd

- **Type**: function
- **Arguments**: geometry, geometry
- **Returns**: boolean

#### geometry_send

- **Type**: function
- **Arguments**: geometry
- **Returns**: bytea

#### geometry_sortsupport

- **Type**: function
- **Arguments**: internal
- **Returns**: void

#### geometry_spgist_choose_2d

- **Type**: function
- **Arguments**: internal, internal
- **Returns**: void

#### geometry_spgist_choose_3d

- **Type**: function
- **Arguments**: internal, internal
- **Returns**: void

#### geometry_spgist_choose_nd

- **Type**: function
- **Arguments**: internal, internal
- **Returns**: void

#### geometry_spgist_compress_2d

- **Type**: function
- **Arguments**: internal
- **Returns**: internal

#### geometry_spgist_compress_3d

- **Type**: function
- **Arguments**: internal
- **Returns**: internal

#### geometry_spgist_compress_nd

- **Type**: function
- **Arguments**: internal
- **Returns**: internal

#### geometry_spgist_config_2d

- **Type**: function
- **Arguments**: internal, internal
- **Returns**: void

#### geometry_spgist_config_3d

- **Type**: function
- **Arguments**: internal, internal
- **Returns**: void

#### geometry_spgist_config_nd

- **Type**: function
- **Arguments**: internal, internal
- **Returns**: void

#### geometry_spgist_inner_consistent_2d

- **Type**: function
- **Arguments**: internal, internal
- **Returns**: void

#### geometry_spgist_inner_consistent_3d

- **Type**: function
- **Arguments**: internal, internal
- **Returns**: void

#### geometry_spgist_inner_consistent_nd

- **Type**: function
- **Arguments**: internal, internal
- **Returns**: void

#### geometry_spgist_leaf_consistent_2d

- **Type**: function
- **Arguments**: internal, internal
- **Returns**: boolean

#### geometry_spgist_leaf_consistent_3d

- **Type**: function
- **Arguments**: internal, internal
- **Returns**: boolean

#### geometry_spgist_leaf_consistent_nd

- **Type**: function
- **Arguments**: internal, internal
- **Returns**: boolean

#### geometry_spgist_picksplit_2d

- **Type**: function
- **Arguments**: internal, internal
- **Returns**: void

#### geometry_spgist_picksplit_3d

- **Type**: function
- **Arguments**: internal, internal
- **Returns**: void

#### geometry_spgist_picksplit_nd

- **Type**: function
- **Arguments**: internal, internal
- **Returns**: void

#### geometry_typmod_in

- **Type**: function
- **Arguments**: cstring[]
- **Returns**: integer

#### geometry_typmod_out

- **Type**: function
- **Arguments**: integer
- **Returns**: cstring

#### geometry_within

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### geometry_within_nd

- **Type**: function
- **Arguments**: geometry, geometry
- **Returns**: boolean

#### geometrytype

- **Type**: function
- **Arguments**: geography
- **Returns**: text

#### geometrytype

- **Type**: function
- **Arguments**: geometry
- **Returns**: text

#### geomfromewkb

- **Type**: function
- **Arguments**: bytea
- **Returns**: geometry

#### geomfromewkt

- **Type**: function
- **Arguments**: text
- **Returns**: geometry

#### get_contact_sync_data

- **Type**: function
- **Arguments**: p_contact_id uuid
- **Returns**: TABLE(user_id uuid, email text, first_name text, last_name text, phone text)

#### get_current_profile

- **Type**: function
- **Arguments**: 
- **Returns**: TABLE(id uuid, email text, "firstName" text, "lastName" text, "roleCode" text, "appCode" text)

#### get_proj4_from_srid

- **Type**: function
- **Arguments**: integer
- **Returns**: text

#### get_user_company_id

- **Type**: function
- **Arguments**: 
- **Returns**: uuid

#### gettransactionid

- **Type**: function
- **Arguments**: 
- **Returns**: xid

#### gidx_in

- **Type**: function
- **Arguments**: cstring
- **Returns**: gidx

#### gidx_out

- **Type**: function
- **Arguments**: gidx
- **Returns**: cstring

#### gserialized_gist_joinsel_2d

- **Type**: function
- **Arguments**: internal, oid, internal, smallint
- **Returns**: double precision

#### gserialized_gist_joinsel_nd

- **Type**: function
- **Arguments**: internal, oid, internal, smallint
- **Returns**: double precision

#### gserialized_gist_sel_2d

- **Type**: function
- **Arguments**: internal, oid, internal, integer
- **Returns**: double precision

#### gserialized_gist_sel_nd

- **Type**: function
- **Arguments**: internal, oid, internal, integer
- **Returns**: double precision

#### is_contained_2d

- **Type**: function
- **Arguments**: box2df, geometry
- **Returns**: boolean

#### is_contained_2d

- **Type**: function
- **Arguments**: geometry, box2df
- **Returns**: boolean

#### is_contained_2d

- **Type**: function
- **Arguments**: box2df, box2df
- **Returns**: boolean

#### json

- **Type**: function
- **Arguments**: geometry
- **Returns**: json

#### jsonb

- **Type**: function
- **Arguments**: geometry
- **Returns**: jsonb

#### lockrow

- **Type**: function
- **Arguments**: text, text, text, text
- **Returns**: integer

#### lockrow

- **Type**: function
- **Arguments**: text, text, text, text, timestamp without time zone
- **Returns**: integer

#### lockrow

- **Type**: function
- **Arguments**: text, text, text, timestamp without time zone
- **Returns**: integer

#### lockrow

- **Type**: function
- **Arguments**: text, text, text
- **Returns**: integer

#### longtransactionsenabled

- **Type**: function
- **Arguments**: 
- **Returns**: boolean

#### overlaps_2d

- **Type**: function
- **Arguments**: geometry, box2df
- **Returns**: boolean

#### overlaps_2d

- **Type**: function
- **Arguments**: box2df, box2df
- **Returns**: boolean

#### overlaps_2d

- **Type**: function
- **Arguments**: box2df, geometry
- **Returns**: boolean

#### overlaps_geog

- **Type**: function
- **Arguments**: geography, gidx
- **Returns**: boolean

#### overlaps_geog

- **Type**: function
- **Arguments**: gidx, gidx
- **Returns**: boolean

#### overlaps_geog

- **Type**: function
- **Arguments**: gidx, geography
- **Returns**: boolean

#### overlaps_nd

- **Type**: function
- **Arguments**: gidx, gidx
- **Returns**: boolean

#### overlaps_nd

- **Type**: function
- **Arguments**: geometry, gidx
- **Returns**: boolean

#### overlaps_nd

- **Type**: function
- **Arguments**: gidx, geometry
- **Returns**: boolean

#### path

- **Type**: function
- **Arguments**: geometry
- **Returns**: path

#### pgis_asflatgeobuf_finalfn

- **Type**: function
- **Arguments**: internal
- **Returns**: bytea

#### pgis_asflatgeobuf_transfn

- **Type**: function
- **Arguments**: internal, anyelement, boolean, text
- **Returns**: internal

#### pgis_asflatgeobuf_transfn

- **Type**: function
- **Arguments**: internal, anyelement, boolean
- **Returns**: internal

#### pgis_asflatgeobuf_transfn

- **Type**: function
- **Arguments**: internal, anyelement
- **Returns**: internal

#### pgis_asgeobuf_finalfn

- **Type**: function
- **Arguments**: internal
- **Returns**: bytea

#### pgis_asgeobuf_transfn

- **Type**: function
- **Arguments**: internal, anyelement
- **Returns**: internal

#### pgis_asgeobuf_transfn

- **Type**: function
- **Arguments**: internal, anyelement, text
- **Returns**: internal

#### pgis_asmvt_combinefn

- **Type**: function
- **Arguments**: internal, internal
- **Returns**: internal

#### pgis_asmvt_deserialfn

- **Type**: function
- **Arguments**: bytea, internal
- **Returns**: internal

#### pgis_asmvt_finalfn

- **Type**: function
- **Arguments**: internal
- **Returns**: bytea

#### pgis_asmvt_serialfn

- **Type**: function
- **Arguments**: internal
- **Returns**: bytea

#### pgis_asmvt_transfn

- **Type**: function
- **Arguments**: internal, anyelement
- **Returns**: internal

#### pgis_asmvt_transfn

- **Type**: function
- **Arguments**: internal, anyelement, text
- **Returns**: internal

#### pgis_asmvt_transfn

- **Type**: function
- **Arguments**: internal, anyelement, text, integer, text, text
- **Returns**: internal

#### pgis_asmvt_transfn

- **Type**: function
- **Arguments**: internal, anyelement, text, integer
- **Returns**: internal

#### pgis_asmvt_transfn

- **Type**: function
- **Arguments**: internal, anyelement, text, integer, text
- **Returns**: internal

#### pgis_geometry_accum_transfn

- **Type**: function
- **Arguments**: internal, geometry
- **Returns**: internal

#### pgis_geometry_accum_transfn

- **Type**: function
- **Arguments**: internal, geometry, double precision
- **Returns**: internal

#### pgis_geometry_accum_transfn

- **Type**: function
- **Arguments**: internal, geometry, double precision, integer
- **Returns**: internal

#### pgis_geometry_clusterintersecting_finalfn

- **Type**: function
- **Arguments**: internal
- **Returns**: geometry[]

#### pgis_geometry_clusterwithin_finalfn

- **Type**: function
- **Arguments**: internal
- **Returns**: geometry[]

#### pgis_geometry_collect_finalfn

- **Type**: function
- **Arguments**: internal
- **Returns**: geometry

#### pgis_geometry_makeline_finalfn

- **Type**: function
- **Arguments**: internal
- **Returns**: geometry

#### pgis_geometry_polygonize_finalfn

- **Type**: function
- **Arguments**: internal
- **Returns**: geometry

#### pgis_geometry_union_parallel_combinefn

- **Type**: function
- **Arguments**: internal, internal
- **Returns**: internal

#### pgis_geometry_union_parallel_deserialfn

- **Type**: function
- **Arguments**: bytea, internal
- **Returns**: internal

#### pgis_geometry_union_parallel_finalfn

- **Type**: function
- **Arguments**: internal
- **Returns**: geometry

#### pgis_geometry_union_parallel_serialfn

- **Type**: function
- **Arguments**: internal
- **Returns**: bytea

#### pgis_geometry_union_parallel_transfn

- **Type**: function
- **Arguments**: internal, geometry
- **Returns**: internal

#### pgis_geometry_union_parallel_transfn

- **Type**: function
- **Arguments**: internal, geometry, double precision
- **Returns**: internal

#### point

- **Type**: function
- **Arguments**: geometry
- **Returns**: point

#### polygon

- **Type**: function
- **Arguments**: geometry
- **Returns**: polygon

#### populate_geometry_columns

- **Type**: function
- **Arguments**: tbl_oid oid, use_typmod boolean DEFAULT true
- **Returns**: integer

#### populate_geometry_columns

- **Type**: function
- **Arguments**: use_typmod boolean DEFAULT true
- **Returns**: text

#### postgis_addbbox

- **Type**: function
- **Arguments**: geometry
- **Returns**: geometry

#### postgis_cache_bbox

- **Type**: function
- **Arguments**: 
- **Returns**: trigger

#### postgis_constraint_dims

- **Type**: function
- **Arguments**: geomschema text, geomtable text, geomcolumn text
- **Returns**: integer

#### postgis_constraint_srid

- **Type**: function
- **Arguments**: geomschema text, geomtable text, geomcolumn text
- **Returns**: integer

#### postgis_constraint_type

- **Type**: function
- **Arguments**: geomschema text, geomtable text, geomcolumn text
- **Returns**: character varying

#### postgis_dropbbox

- **Type**: function
- **Arguments**: geometry
- **Returns**: geometry

#### postgis_extensions_upgrade

- **Type**: function
- **Arguments**: 
- **Returns**: text

#### postgis_full_version

- **Type**: function
- **Arguments**: 
- **Returns**: text

#### postgis_geos_noop

- **Type**: function
- **Arguments**: geometry
- **Returns**: geometry

#### postgis_geos_version

- **Type**: function
- **Arguments**: 
- **Returns**: text

#### postgis_getbbox

- **Type**: function
- **Arguments**: geometry
- **Returns**: box2d

#### postgis_hasbbox

- **Type**: function
- **Arguments**: geometry
- **Returns**: boolean

#### postgis_index_supportfn

- **Type**: function
- **Arguments**: internal
- **Returns**: internal

#### postgis_lib_build_date

- **Type**: function
- **Arguments**: 
- **Returns**: text

#### postgis_lib_revision

- **Type**: function
- **Arguments**: 
- **Returns**: text

#### postgis_lib_version

- **Type**: function
- **Arguments**: 
- **Returns**: text

#### postgis_libjson_version

- **Type**: function
- **Arguments**: 
- **Returns**: text

#### postgis_liblwgeom_version

- **Type**: function
- **Arguments**: 
- **Returns**: text

#### postgis_libprotobuf_version

- **Type**: function
- **Arguments**: 
- **Returns**: text

#### postgis_libxml_version

- **Type**: function
- **Arguments**: 
- **Returns**: text

#### postgis_noop

- **Type**: function
- **Arguments**: geometry
- **Returns**: geometry

#### postgis_proj_version

- **Type**: function
- **Arguments**: 
- **Returns**: text

#### postgis_scripts_build_date

- **Type**: function
- **Arguments**: 
- **Returns**: text

#### postgis_scripts_installed

- **Type**: function
- **Arguments**: 
- **Returns**: text

#### postgis_scripts_released

- **Type**: function
- **Arguments**: 
- **Returns**: text

#### postgis_svn_version

- **Type**: function
- **Arguments**: 
- **Returns**: text

#### postgis_transform_geometry

- **Type**: function
- **Arguments**: geom geometry, text, text, integer
- **Returns**: geometry

#### postgis_type_name

- **Type**: function
- **Arguments**: geomname character varying, coord_dimension integer, use_new_name boolean DEFAULT true
- **Returns**: character varying

#### postgis_typmod_dims

- **Type**: function
- **Arguments**: integer
- **Returns**: integer

#### postgis_typmod_srid

- **Type**: function
- **Arguments**: integer
- **Returns**: integer

#### postgis_typmod_type

- **Type**: function
- **Arguments**: integer
- **Returns**: text

#### postgis_version

- **Type**: function
- **Arguments**: 
- **Returns**: text

#### postgis_wagyu_version

- **Type**: function
- **Arguments**: 
- **Returns**: text

#### prevent_inspection_session_id_change

- **Type**: function
- **Arguments**: 
- **Returns**: trigger

#### prevent_inspectionsession_project_id_change

- **Type**: function
- **Arguments**: 
- **Returns**: trigger

#### prevent_planreview_planset_id_change

- **Type**: function
- **Arguments**: 
- **Returns**: trigger

#### prevent_planset_project_id_change

- **Type**: function
- **Arguments**: 
- **Returns**: trigger

#### prevent_project_company_id_change

- **Type**: function
- **Arguments**: 
- **Returns**: trigger

#### reopen_thread

- **Type**: function
- **Arguments**: p_thread_id uuid, p_user_id uuid, p_reopening_message text DEFAULT NULL::text
- **Returns**: json

#### set_project_company_id

- **Type**: function
- **Arguments**: 
- **Returns**: trigger

#### set_updated_at

- **Type**: function
- **Arguments**: 
- **Returns**: trigger

#### spheroid_in

- **Type**: function
- **Arguments**: cstring
- **Returns**: spheroid

#### spheroid_out

- **Type**: function
- **Arguments**: spheroid
- **Returns**: cstring

#### st_3dclosestpoint

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: geometry

#### st_3ddfullywithin

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry, double precision
- **Returns**: boolean

#### st_3ddistance

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: double precision

#### st_3ddwithin

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry, double precision
- **Returns**: boolean

#### st_3dextent

- **Type**: aggregate
- **Arguments**: geometry
- **Returns**: box3d

#### st_3dintersects

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### st_3dlength

- **Type**: function
- **Arguments**: geometry
- **Returns**: double precision

#### st_3dlineinterpolatepoint

- **Type**: function
- **Arguments**: geometry, double precision
- **Returns**: geometry

#### st_3dlongestline

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: geometry

#### st_3dmakebox

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: box3d

#### st_3dmaxdistance

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: double precision

#### st_3dperimeter

- **Type**: function
- **Arguments**: geometry
- **Returns**: double precision

#### st_3dshortestline

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: geometry

#### st_addmeasure

- **Type**: function
- **Arguments**: geometry, double precision, double precision
- **Returns**: geometry

#### st_addpoint

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry, integer
- **Returns**: geometry

#### st_addpoint

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: geometry

#### st_affine

- **Type**: function
- **Arguments**: geometry, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision
- **Returns**: geometry

#### st_affine

- **Type**: function
- **Arguments**: geometry, double precision, double precision, double precision, double precision, double precision, double precision
- **Returns**: geometry

#### st_angle

- **Type**: function
- **Arguments**: pt1 geometry, pt2 geometry, pt3 geometry, pt4 geometry DEFAULT '0101000000000000000000F87F000000000000F87F'::geometry
- **Returns**: double precision

#### st_angle

- **Type**: function
- **Arguments**: line1 geometry, line2 geometry
- **Returns**: double precision

#### st_area

- **Type**: function
- **Arguments**: text
- **Returns**: double precision

#### st_area

- **Type**: function
- **Arguments**: geometry
- **Returns**: double precision

#### st_area

- **Type**: function
- **Arguments**: geog geography, use_spheroid boolean DEFAULT true
- **Returns**: double precision

#### st_area2d

- **Type**: function
- **Arguments**: geometry
- **Returns**: double precision

#### st_asbinary

- **Type**: function
- **Arguments**: geography
- **Returns**: bytea

#### st_asbinary

- **Type**: function
- **Arguments**: geometry, text
- **Returns**: bytea

#### st_asbinary

- **Type**: function
- **Arguments**: geometry
- **Returns**: bytea

#### st_asbinary

- **Type**: function
- **Arguments**: geography, text
- **Returns**: bytea

#### st_asencodedpolyline

- **Type**: function
- **Arguments**: geom geometry, nprecision integer DEFAULT 5
- **Returns**: text

#### st_asewkb

- **Type**: function
- **Arguments**: geometry
- **Returns**: bytea

#### st_asewkb

- **Type**: function
- **Arguments**: geometry, text
- **Returns**: bytea

#### st_asewkt

- **Type**: function
- **Arguments**: geometry, integer
- **Returns**: text

#### st_asewkt

- **Type**: function
- **Arguments**: text
- **Returns**: text

#### st_asewkt

- **Type**: function
- **Arguments**: geography, integer
- **Returns**: text

#### st_asewkt

- **Type**: function
- **Arguments**: geography
- **Returns**: text

#### st_asewkt

- **Type**: function
- **Arguments**: geometry
- **Returns**: text

#### st_asflatgeobuf

- **Type**: aggregate
- **Arguments**: anyelement, boolean, text
- **Returns**: bytea

#### st_asflatgeobuf

- **Type**: aggregate
- **Arguments**: anyelement, boolean
- **Returns**: bytea

#### st_asflatgeobuf

- **Type**: aggregate
- **Arguments**: anyelement
- **Returns**: bytea

#### st_asgeobuf

- **Type**: aggregate
- **Arguments**: anyelement, text
- **Returns**: bytea

#### st_asgeobuf

- **Type**: aggregate
- **Arguments**: anyelement
- **Returns**: bytea

#### st_asgeojson

- **Type**: function
- **Arguments**: text
- **Returns**: text

#### st_asgeojson

- **Type**: function
- **Arguments**: geog geography, maxdecimaldigits integer DEFAULT 9, options integer DEFAULT 0
- **Returns**: text

#### st_asgeojson

- **Type**: function
- **Arguments**: geom geometry, maxdecimaldigits integer DEFAULT 9, options integer DEFAULT 8
- **Returns**: text

#### st_asgeojson

- **Type**: function
- **Arguments**: r record, geom_column text DEFAULT ''::text, maxdecimaldigits integer DEFAULT 9, pretty_bool boolean DEFAULT false
- **Returns**: text

#### st_asgml

- **Type**: function
- **Arguments**: geog geography, maxdecimaldigits integer DEFAULT 15, options integer DEFAULT 0, nprefix text DEFAULT 'gml'::text, id text DEFAULT ''::text
- **Returns**: text

#### st_asgml

- **Type**: function
- **Arguments**: version integer, geom geometry, maxdecimaldigits integer DEFAULT 15, options integer DEFAULT 0, nprefix text DEFAULT NULL::text, id text DEFAULT NULL::text
- **Returns**: text

#### st_asgml

- **Type**: function
- **Arguments**: geom geometry, maxdecimaldigits integer DEFAULT 15, options integer DEFAULT 0
- **Returns**: text

#### st_asgml

- **Type**: function
- **Arguments**: version integer, geog geography, maxdecimaldigits integer DEFAULT 15, options integer DEFAULT 0, nprefix text DEFAULT 'gml'::text, id text DEFAULT ''::text
- **Returns**: text

#### st_asgml

- **Type**: function
- **Arguments**: text
- **Returns**: text

#### st_ashexewkb

- **Type**: function
- **Arguments**: geometry, text
- **Returns**: text

#### st_ashexewkb

- **Type**: function
- **Arguments**: geometry
- **Returns**: text

#### st_askml

- **Type**: function
- **Arguments**: geog geography, maxdecimaldigits integer DEFAULT 15, nprefix text DEFAULT ''::text
- **Returns**: text

#### st_askml

- **Type**: function
- **Arguments**: geom geometry, maxdecimaldigits integer DEFAULT 15, nprefix text DEFAULT ''::text
- **Returns**: text

#### st_askml

- **Type**: function
- **Arguments**: text
- **Returns**: text

#### st_aslatlontext

- **Type**: function
- **Arguments**: geom geometry, tmpl text DEFAULT ''::text
- **Returns**: text

#### st_asmarc21

- **Type**: function
- **Arguments**: geom geometry, format text DEFAULT 'hdddmmss'::text
- **Returns**: text

#### st_asmvt

- **Type**: aggregate
- **Arguments**: anyelement, text
- **Returns**: bytea

#### st_asmvt

- **Type**: aggregate
- **Arguments**: anyelement, text, integer
- **Returns**: bytea

#### st_asmvt

- **Type**: aggregate
- **Arguments**: anyelement
- **Returns**: bytea

#### st_asmvt

- **Type**: aggregate
- **Arguments**: anyelement, text, integer, text
- **Returns**: bytea

#### st_asmvt

- **Type**: aggregate
- **Arguments**: anyelement, text, integer, text, text
- **Returns**: bytea

#### st_asmvtgeom

- **Type**: function
- **Arguments**: geom geometry, bounds box2d, extent integer DEFAULT 4096, buffer integer DEFAULT 256, clip_geom boolean DEFAULT true
- **Returns**: geometry

#### st_assvg

- **Type**: function
- **Arguments**: geom geometry, rel integer DEFAULT 0, maxdecimaldigits integer DEFAULT 15
- **Returns**: text

#### st_assvg

- **Type**: function
- **Arguments**: geog geography, rel integer DEFAULT 0, maxdecimaldigits integer DEFAULT 15
- **Returns**: text

#### st_assvg

- **Type**: function
- **Arguments**: text
- **Returns**: text

#### st_astext

- **Type**: function
- **Arguments**: geometry
- **Returns**: text

#### st_astext

- **Type**: function
- **Arguments**: text
- **Returns**: text

#### st_astext

- **Type**: function
- **Arguments**: geography
- **Returns**: text

#### st_astext

- **Type**: function
- **Arguments**: geography, integer
- **Returns**: text

#### st_astext

- **Type**: function
- **Arguments**: geometry, integer
- **Returns**: text

#### st_astwkb

- **Type**: function
- **Arguments**: geom geometry[], ids bigint[], prec integer DEFAULT NULL::integer, prec_z integer DEFAULT NULL::integer, prec_m integer DEFAULT NULL::integer, with_sizes boolean DEFAULT NULL::boolean, with_boxes boolean DEFAULT NULL::boolean
- **Returns**: bytea

#### st_astwkb

- **Type**: function
- **Arguments**: geom geometry, prec integer DEFAULT NULL::integer, prec_z integer DEFAULT NULL::integer, prec_m integer DEFAULT NULL::integer, with_sizes boolean DEFAULT NULL::boolean, with_boxes boolean DEFAULT NULL::boolean
- **Returns**: bytea

#### st_asx3d

- **Type**: function
- **Arguments**: geom geometry, maxdecimaldigits integer DEFAULT 15, options integer DEFAULT 0
- **Returns**: text

#### st_azimuth

- **Type**: function
- **Arguments**: geog1 geography, geog2 geography
- **Returns**: double precision

#### st_azimuth

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: double precision

#### st_bdmpolyfromtext

- **Type**: function
- **Arguments**: text, integer
- **Returns**: geometry

#### st_bdpolyfromtext

- **Type**: function
- **Arguments**: text, integer
- **Returns**: geometry

#### st_boundary

- **Type**: function
- **Arguments**: geometry
- **Returns**: geometry

#### st_boundingdiagonal

- **Type**: function
- **Arguments**: geom geometry, fits boolean DEFAULT false
- **Returns**: geometry

#### st_box2dfromgeohash

- **Type**: function
- **Arguments**: text, integer DEFAULT NULL::integer
- **Returns**: box2d

#### st_buffer

- **Type**: function
- **Arguments**: geom geometry, radius double precision, options text DEFAULT ''::text
- **Returns**: geometry

#### st_buffer

- **Type**: function
- **Arguments**: geography, double precision
- **Returns**: geography

#### st_buffer

- **Type**: function
- **Arguments**: geography, double precision, integer
- **Returns**: geography

#### st_buffer

- **Type**: function
- **Arguments**: geography, double precision, text
- **Returns**: geography

#### st_buffer

- **Type**: function
- **Arguments**: text, double precision
- **Returns**: geometry

#### st_buffer

- **Type**: function
- **Arguments**: text, double precision, integer
- **Returns**: geometry

#### st_buffer

- **Type**: function
- **Arguments**: text, double precision, text
- **Returns**: geometry

#### st_buffer

- **Type**: function
- **Arguments**: geom geometry, radius double precision, quadsegs integer
- **Returns**: geometry

#### st_buildarea

- **Type**: function
- **Arguments**: geometry
- **Returns**: geometry

#### st_centroid

- **Type**: function
- **Arguments**: geography, use_spheroid boolean DEFAULT true
- **Returns**: geography

#### st_centroid

- **Type**: function
- **Arguments**: text
- **Returns**: geometry

#### st_centroid

- **Type**: function
- **Arguments**: geometry
- **Returns**: geometry

#### st_chaikinsmoothing

- **Type**: function
- **Arguments**: geometry, integer DEFAULT 1, boolean DEFAULT false
- **Returns**: geometry

#### st_cleangeometry

- **Type**: function
- **Arguments**: geometry
- **Returns**: geometry

#### st_clipbybox2d

- **Type**: function
- **Arguments**: geom geometry, box box2d
- **Returns**: geometry

#### st_closestpoint

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: geometry

#### st_closestpointofapproach

- **Type**: function
- **Arguments**: geometry, geometry
- **Returns**: double precision

#### st_clusterdbscan

- **Type**: window
- **Arguments**: geometry, eps double precision, minpoints integer
- **Returns**: integer

#### st_clusterintersecting

- **Type**: aggregate
- **Arguments**: geometry
- **Returns**: geometry[]

#### st_clusterintersecting

- **Type**: function
- **Arguments**: geometry[]
- **Returns**: geometry[]

#### st_clusterkmeans

- **Type**: window
- **Arguments**: geom geometry, k integer, max_radius double precision DEFAULT NULL::double precision
- **Returns**: integer

#### st_clusterwithin

- **Type**: aggregate
- **Arguments**: geometry, double precision
- **Returns**: geometry[]

#### st_clusterwithin

- **Type**: function
- **Arguments**: geometry[], double precision
- **Returns**: geometry[]

#### st_collect

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: geometry

#### st_collect

- **Type**: aggregate
- **Arguments**: geometry
- **Returns**: geometry

#### st_collect

- **Type**: function
- **Arguments**: geometry[]
- **Returns**: geometry

#### st_collectionextract

- **Type**: function
- **Arguments**: geometry, integer
- **Returns**: geometry

#### st_collectionextract

- **Type**: function
- **Arguments**: geometry
- **Returns**: geometry

#### st_collectionhomogenize

- **Type**: function
- **Arguments**: geometry
- **Returns**: geometry

#### st_combinebbox

- **Type**: function
- **Arguments**: box2d, geometry
- **Returns**: box2d

#### st_combinebbox

- **Type**: function
- **Arguments**: box3d, geometry
- **Returns**: box3d

#### st_combinebbox

- **Type**: function
- **Arguments**: box3d, box3d
- **Returns**: box3d

#### st_concavehull

- **Type**: function
- **Arguments**: param_geom geometry, param_pctconvex double precision, param_allow_holes boolean DEFAULT false
- **Returns**: geometry

#### st_contains

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### st_containsproperly

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### st_convexhull

- **Type**: function
- **Arguments**: geometry
- **Returns**: geometry

#### st_coorddim

- **Type**: function
- **Arguments**: geometry geometry
- **Returns**: smallint

#### st_coveredby

- **Type**: function
- **Arguments**: geog1 geography, geog2 geography
- **Returns**: boolean

#### st_coveredby

- **Type**: function
- **Arguments**: text, text
- **Returns**: boolean

#### st_coveredby

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### st_covers

- **Type**: function
- **Arguments**: text, text
- **Returns**: boolean

#### st_covers

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### st_covers

- **Type**: function
- **Arguments**: geog1 geography, geog2 geography
- **Returns**: boolean

#### st_cpawithin

- **Type**: function
- **Arguments**: geometry, geometry, double precision
- **Returns**: boolean

#### st_crosses

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### st_curvetoline

- **Type**: function
- **Arguments**: geom geometry, tol double precision DEFAULT 32, toltype integer DEFAULT 0, flags integer DEFAULT 0
- **Returns**: geometry

#### st_delaunaytriangles

- **Type**: function
- **Arguments**: g1 geometry, tolerance double precision DEFAULT 0.0, flags integer DEFAULT 0
- **Returns**: geometry

#### st_dfullywithin

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry, double precision
- **Returns**: boolean

#### st_difference

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry, gridsize double precision DEFAULT '-1.0'::numeric
- **Returns**: geometry

#### st_dimension

- **Type**: function
- **Arguments**: geometry
- **Returns**: integer

#### st_disjoint

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### st_distance

- **Type**: function
- **Arguments**: geog1 geography, geog2 geography, use_spheroid boolean DEFAULT true
- **Returns**: double precision

#### st_distance

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: double precision

#### st_distance

- **Type**: function
- **Arguments**: text, text
- **Returns**: double precision

#### st_distancecpa

- **Type**: function
- **Arguments**: geometry, geometry
- **Returns**: double precision

#### st_distancesphere

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry, radius double precision
- **Returns**: double precision

#### st_distancesphere

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: double precision

#### st_distancespheroid

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry, spheroid
- **Returns**: double precision

#### st_distancespheroid

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: double precision

#### st_dump

- **Type**: function
- **Arguments**: geometry
- **Returns**: SETOF geometry_dump

#### st_dumppoints

- **Type**: function
- **Arguments**: geometry
- **Returns**: SETOF geometry_dump

#### st_dumprings

- **Type**: function
- **Arguments**: geometry
- **Returns**: SETOF geometry_dump

#### st_dumpsegments

- **Type**: function
- **Arguments**: geometry
- **Returns**: SETOF geometry_dump

#### st_dwithin

- **Type**: function
- **Arguments**: geog1 geography, geog2 geography, tolerance double precision, use_spheroid boolean DEFAULT true
- **Returns**: boolean

#### st_dwithin

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry, double precision
- **Returns**: boolean

#### st_dwithin

- **Type**: function
- **Arguments**: text, text, double precision
- **Returns**: boolean

#### st_endpoint

- **Type**: function
- **Arguments**: geometry
- **Returns**: geometry

#### st_envelope

- **Type**: function
- **Arguments**: geometry
- **Returns**: geometry

#### st_equals

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### st_estimatedextent

- **Type**: function
- **Arguments**: text, text, text, boolean
- **Returns**: box2d

#### st_estimatedextent

- **Type**: function
- **Arguments**: text, text, text
- **Returns**: box2d

#### st_estimatedextent

- **Type**: function
- **Arguments**: text, text
- **Returns**: box2d

#### st_expand

- **Type**: function
- **Arguments**: geom geometry, dx double precision, dy double precision, dz double precision DEFAULT 0, dm double precision DEFAULT 0
- **Returns**: geometry

#### st_expand

- **Type**: function
- **Arguments**: box2d, double precision
- **Returns**: box2d

#### st_expand

- **Type**: function
- **Arguments**: box box2d, dx double precision, dy double precision
- **Returns**: box2d

#### st_expand

- **Type**: function
- **Arguments**: box3d, double precision
- **Returns**: box3d

#### st_expand

- **Type**: function
- **Arguments**: geometry, double precision
- **Returns**: geometry

#### st_expand

- **Type**: function
- **Arguments**: box box3d, dx double precision, dy double precision, dz double precision DEFAULT 0
- **Returns**: box3d

#### st_extent

- **Type**: aggregate
- **Arguments**: geometry
- **Returns**: box2d

#### st_exteriorring

- **Type**: function
- **Arguments**: geometry
- **Returns**: geometry

#### st_filterbym

- **Type**: function
- **Arguments**: geometry, double precision, double precision DEFAULT NULL::double precision, boolean DEFAULT false
- **Returns**: geometry

#### st_findextent

- **Type**: function
- **Arguments**: text, text, text
- **Returns**: box2d

#### st_findextent

- **Type**: function
- **Arguments**: text, text
- **Returns**: box2d

#### st_flipcoordinates

- **Type**: function
- **Arguments**: geometry
- **Returns**: geometry

#### st_force2d

- **Type**: function
- **Arguments**: geometry
- **Returns**: geometry

#### st_force3d

- **Type**: function
- **Arguments**: geom geometry, zvalue double precision DEFAULT 0.0
- **Returns**: geometry

#### st_force3dm

- **Type**: function
- **Arguments**: geom geometry, mvalue double precision DEFAULT 0.0
- **Returns**: geometry

#### st_force3dz

- **Type**: function
- **Arguments**: geom geometry, zvalue double precision DEFAULT 0.0
- **Returns**: geometry

#### st_force4d

- **Type**: function
- **Arguments**: geom geometry, zvalue double precision DEFAULT 0.0, mvalue double precision DEFAULT 0.0
- **Returns**: geometry

#### st_forcecollection

- **Type**: function
- **Arguments**: geometry
- **Returns**: geometry

#### st_forcecurve

- **Type**: function
- **Arguments**: geometry
- **Returns**: geometry

#### st_forcepolygonccw

- **Type**: function
- **Arguments**: geometry
- **Returns**: geometry

#### st_forcepolygoncw

- **Type**: function
- **Arguments**: geometry
- **Returns**: geometry

#### st_forcerhr

- **Type**: function
- **Arguments**: geometry
- **Returns**: geometry

#### st_forcesfs

- **Type**: function
- **Arguments**: geometry, version text
- **Returns**: geometry

#### st_forcesfs

- **Type**: function
- **Arguments**: geometry
- **Returns**: geometry

#### st_frechetdistance

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry, double precision DEFAULT '-1'::integer
- **Returns**: double precision

#### st_fromflatgeobuf

- **Type**: function
- **Arguments**: anyelement, bytea
- **Returns**: SETOF anyelement

#### st_fromflatgeobuftotable

- **Type**: function
- **Arguments**: text, text, bytea
- **Returns**: void

#### st_generatepoints

- **Type**: function
- **Arguments**: area geometry, npoints integer
- **Returns**: geometry

#### st_generatepoints

- **Type**: function
- **Arguments**: area geometry, npoints integer, seed integer
- **Returns**: geometry

#### st_geogfromtext

- **Type**: function
- **Arguments**: text
- **Returns**: geography

#### st_geogfromwkb

- **Type**: function
- **Arguments**: bytea
- **Returns**: geography

#### st_geographyfromtext

- **Type**: function
- **Arguments**: text
- **Returns**: geography

#### st_geohash

- **Type**: function
- **Arguments**: geog geography, maxchars integer DEFAULT 0
- **Returns**: text

#### st_geohash

- **Type**: function
- **Arguments**: geom geometry, maxchars integer DEFAULT 0
- **Returns**: text

#### st_geomcollfromtext

- **Type**: function
- **Arguments**: text
- **Returns**: geometry

#### st_geomcollfromtext

- **Type**: function
- **Arguments**: text, integer
- **Returns**: geometry

#### st_geomcollfromwkb

- **Type**: function
- **Arguments**: bytea, integer
- **Returns**: geometry

#### st_geomcollfromwkb

- **Type**: function
- **Arguments**: bytea
- **Returns**: geometry

#### st_geometricmedian

- **Type**: function
- **Arguments**: g geometry, tolerance double precision DEFAULT NULL::double precision, max_iter integer DEFAULT 10000, fail_if_not_converged boolean DEFAULT false
- **Returns**: geometry

#### st_geometryfromtext

- **Type**: function
- **Arguments**: text, integer
- **Returns**: geometry

#### st_geometryfromtext

- **Type**: function
- **Arguments**: text
- **Returns**: geometry

#### st_geometryn

- **Type**: function
- **Arguments**: geometry, integer
- **Returns**: geometry

#### st_geometrytype

- **Type**: function
- **Arguments**: geometry
- **Returns**: text

#### st_geomfromewkb

- **Type**: function
- **Arguments**: bytea
- **Returns**: geometry

#### st_geomfromewkt

- **Type**: function
- **Arguments**: text
- **Returns**: geometry

#### st_geomfromgeohash

- **Type**: function
- **Arguments**: text, integer DEFAULT NULL::integer
- **Returns**: geometry

#### st_geomfromgeojson

- **Type**: function
- **Arguments**: text
- **Returns**: geometry

#### st_geomfromgeojson

- **Type**: function
- **Arguments**: json
- **Returns**: geometry

#### st_geomfromgeojson

- **Type**: function
- **Arguments**: jsonb
- **Returns**: geometry

#### st_geomfromgml

- **Type**: function
- **Arguments**: text, integer
- **Returns**: geometry

#### st_geomfromgml

- **Type**: function
- **Arguments**: text
- **Returns**: geometry

#### st_geomfromkml

- **Type**: function
- **Arguments**: text
- **Returns**: geometry

#### st_geomfrommarc21

- **Type**: function
- **Arguments**: marc21xml text
- **Returns**: geometry

#### st_geomfromtext

- **Type**: function
- **Arguments**: text, integer
- **Returns**: geometry

#### st_geomfromtext

- **Type**: function
- **Arguments**: text
- **Returns**: geometry

#### st_geomfromtwkb

- **Type**: function
- **Arguments**: bytea
- **Returns**: geometry

#### st_geomfromwkb

- **Type**: function
- **Arguments**: bytea
- **Returns**: geometry

#### st_geomfromwkb

- **Type**: function
- **Arguments**: bytea, integer
- **Returns**: geometry

#### st_gmltosql

- **Type**: function
- **Arguments**: text
- **Returns**: geometry

#### st_gmltosql

- **Type**: function
- **Arguments**: text, integer
- **Returns**: geometry

#### st_hasarc

- **Type**: function
- **Arguments**: geometry geometry
- **Returns**: boolean

#### st_hausdorffdistance

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry, double precision
- **Returns**: double precision

#### st_hausdorffdistance

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: double precision

#### st_hexagon

- **Type**: function
- **Arguments**: size double precision, cell_i integer, cell_j integer, origin geometry DEFAULT '010100000000000000000000000000000000000000'::geometry
- **Returns**: geometry

#### st_hexagongrid

- **Type**: function
- **Arguments**: size double precision, bounds geometry, OUT geom geometry, OUT i integer, OUT j integer
- **Returns**: SETOF record

#### st_interiorringn

- **Type**: function
- **Arguments**: geometry, integer
- **Returns**: geometry

#### st_interpolatepoint

- **Type**: function
- **Arguments**: line geometry, point geometry
- **Returns**: double precision

#### st_intersection

- **Type**: function
- **Arguments**: text, text
- **Returns**: geometry

#### st_intersection

- **Type**: function
- **Arguments**: geography, geography
- **Returns**: geography

#### st_intersection

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry, gridsize double precision DEFAULT '-1'::integer
- **Returns**: geometry

#### st_intersects

- **Type**: function
- **Arguments**: text, text
- **Returns**: boolean

#### st_intersects

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### st_intersects

- **Type**: function
- **Arguments**: geog1 geography, geog2 geography
- **Returns**: boolean

#### st_isclosed

- **Type**: function
- **Arguments**: geometry
- **Returns**: boolean

#### st_iscollection

- **Type**: function
- **Arguments**: geometry
- **Returns**: boolean

#### st_isempty

- **Type**: function
- **Arguments**: geometry
- **Returns**: boolean

#### st_ispolygonccw

- **Type**: function
- **Arguments**: geometry
- **Returns**: boolean

#### st_ispolygoncw

- **Type**: function
- **Arguments**: geometry
- **Returns**: boolean

#### st_isring

- **Type**: function
- **Arguments**: geometry
- **Returns**: boolean

#### st_issimple

- **Type**: function
- **Arguments**: geometry
- **Returns**: boolean

#### st_isvalid

- **Type**: function
- **Arguments**: geometry
- **Returns**: boolean

#### st_isvalid

- **Type**: function
- **Arguments**: geometry, integer
- **Returns**: boolean

#### st_isvaliddetail

- **Type**: function
- **Arguments**: geom geometry, flags integer DEFAULT 0
- **Returns**: valid_detail

#### st_isvalidreason

- **Type**: function
- **Arguments**: geometry
- **Returns**: text

#### st_isvalidreason

- **Type**: function
- **Arguments**: geometry, integer
- **Returns**: text

#### st_isvalidtrajectory

- **Type**: function
- **Arguments**: geometry
- **Returns**: boolean

#### st_length

- **Type**: function
- **Arguments**: geog geography, use_spheroid boolean DEFAULT true
- **Returns**: double precision

#### st_length

- **Type**: function
- **Arguments**: geometry
- **Returns**: double precision

#### st_length

- **Type**: function
- **Arguments**: text
- **Returns**: double precision

#### st_length2d

- **Type**: function
- **Arguments**: geometry
- **Returns**: double precision

#### st_length2dspheroid

- **Type**: function
- **Arguments**: geometry, spheroid
- **Returns**: double precision

#### st_lengthspheroid

- **Type**: function
- **Arguments**: geometry, spheroid
- **Returns**: double precision

#### st_letters

- **Type**: function
- **Arguments**: letters text, font json DEFAULT NULL::json
- **Returns**: geometry

#### st_linecrossingdirection

- **Type**: function
- **Arguments**: line1 geometry, line2 geometry
- **Returns**: integer

#### st_linefromencodedpolyline

- **Type**: function
- **Arguments**: txtin text, nprecision integer DEFAULT 5
- **Returns**: geometry

#### st_linefrommultipoint

- **Type**: function
- **Arguments**: geometry
- **Returns**: geometry

#### st_linefromtext

- **Type**: function
- **Arguments**: text, integer
- **Returns**: geometry

#### st_linefromtext

- **Type**: function
- **Arguments**: text
- **Returns**: geometry

#### st_linefromwkb

- **Type**: function
- **Arguments**: bytea
- **Returns**: geometry

#### st_linefromwkb

- **Type**: function
- **Arguments**: bytea, integer
- **Returns**: geometry

#### st_lineinterpolatepoint

- **Type**: function
- **Arguments**: geometry, double precision
- **Returns**: geometry

#### st_lineinterpolatepoints

- **Type**: function
- **Arguments**: geometry, double precision, repeat boolean DEFAULT true
- **Returns**: geometry

#### st_linelocatepoint

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: double precision

#### st_linemerge

- **Type**: function
- **Arguments**: geometry, boolean
- **Returns**: geometry

#### st_linemerge

- **Type**: function
- **Arguments**: geometry
- **Returns**: geometry

#### st_linestringfromwkb

- **Type**: function
- **Arguments**: bytea, integer
- **Returns**: geometry

#### st_linestringfromwkb

- **Type**: function
- **Arguments**: bytea
- **Returns**: geometry

#### st_linesubstring

- **Type**: function
- **Arguments**: geometry, double precision, double precision
- **Returns**: geometry

#### st_linetocurve

- **Type**: function
- **Arguments**: geometry geometry
- **Returns**: geometry

#### st_locatealong

- **Type**: function
- **Arguments**: geometry geometry, measure double precision, leftrightoffset double precision DEFAULT 0.0
- **Returns**: geometry

#### st_locatebetween

- **Type**: function
- **Arguments**: geometry geometry, frommeasure double precision, tomeasure double precision, leftrightoffset double precision DEFAULT 0.0
- **Returns**: geometry

#### st_locatebetweenelevations

- **Type**: function
- **Arguments**: geometry geometry, fromelevation double precision, toelevation double precision
- **Returns**: geometry

#### st_longestline

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: geometry

#### st_m

- **Type**: function
- **Arguments**: geometry
- **Returns**: double precision

#### st_makebox2d

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: box2d

#### st_makeenvelope

- **Type**: function
- **Arguments**: double precision, double precision, double precision, double precision, integer DEFAULT 0
- **Returns**: geometry

#### st_makeline

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: geometry

#### st_makeline

- **Type**: aggregate
- **Arguments**: geometry
- **Returns**: geometry

#### st_makeline

- **Type**: function
- **Arguments**: geometry[]
- **Returns**: geometry

#### st_makepoint

- **Type**: function
- **Arguments**: double precision, double precision, double precision
- **Returns**: geometry

#### st_makepoint

- **Type**: function
- **Arguments**: double precision, double precision, double precision, double precision
- **Returns**: geometry

#### st_makepoint

- **Type**: function
- **Arguments**: double precision, double precision
- **Returns**: geometry

#### st_makepointm

- **Type**: function
- **Arguments**: double precision, double precision, double precision
- **Returns**: geometry

#### st_makepolygon

- **Type**: function
- **Arguments**: geometry, geometry[]
- **Returns**: geometry

#### st_makepolygon

- **Type**: function
- **Arguments**: geometry
- **Returns**: geometry

#### st_makevalid

- **Type**: function
- **Arguments**: geom geometry, params text
- **Returns**: geometry

#### st_makevalid

- **Type**: function
- **Arguments**: geometry
- **Returns**: geometry

#### st_maxdistance

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: double precision

#### st_maximuminscribedcircle

- **Type**: function
- **Arguments**: geometry, OUT center geometry, OUT nearest geometry, OUT radius double precision
- **Returns**: record

#### st_memcollect

- **Type**: aggregate
- **Arguments**: geometry
- **Returns**: geometry

#### st_memsize

- **Type**: function
- **Arguments**: geometry
- **Returns**: integer

#### st_memunion

- **Type**: aggregate
- **Arguments**: geometry
- **Returns**: geometry

#### st_minimumboundingcircle

- **Type**: function
- **Arguments**: inputgeom geometry, segs_per_quarter integer DEFAULT 48
- **Returns**: geometry

#### st_minimumboundingradius

- **Type**: function
- **Arguments**: geometry, OUT center geometry, OUT radius double precision
- **Returns**: record

#### st_minimumclearance

- **Type**: function
- **Arguments**: geometry
- **Returns**: double precision

#### st_minimumclearanceline

- **Type**: function
- **Arguments**: geometry
- **Returns**: geometry

#### st_mlinefromtext

- **Type**: function
- **Arguments**: text
- **Returns**: geometry

#### st_mlinefromtext

- **Type**: function
- **Arguments**: text, integer
- **Returns**: geometry

#### st_mlinefromwkb

- **Type**: function
- **Arguments**: bytea
- **Returns**: geometry

#### st_mlinefromwkb

- **Type**: function
- **Arguments**: bytea, integer
- **Returns**: geometry

#### st_mpointfromtext

- **Type**: function
- **Arguments**: text
- **Returns**: geometry

#### st_mpointfromtext

- **Type**: function
- **Arguments**: text, integer
- **Returns**: geometry

#### st_mpointfromwkb

- **Type**: function
- **Arguments**: bytea
- **Returns**: geometry

#### st_mpointfromwkb

- **Type**: function
- **Arguments**: bytea, integer
- **Returns**: geometry

#### st_mpolyfromtext

- **Type**: function
- **Arguments**: text, integer
- **Returns**: geometry

#### st_mpolyfromtext

- **Type**: function
- **Arguments**: text
- **Returns**: geometry

#### st_mpolyfromwkb

- **Type**: function
- **Arguments**: bytea
- **Returns**: geometry

#### st_mpolyfromwkb

- **Type**: function
- **Arguments**: bytea, integer
- **Returns**: geometry

#### st_multi

- **Type**: function
- **Arguments**: geometry
- **Returns**: geometry

#### st_multilinefromwkb

- **Type**: function
- **Arguments**: bytea
- **Returns**: geometry

#### st_multilinestringfromtext

- **Type**: function
- **Arguments**: text
- **Returns**: geometry

#### st_multilinestringfromtext

- **Type**: function
- **Arguments**: text, integer
- **Returns**: geometry

#### st_multipointfromtext

- **Type**: function
- **Arguments**: text
- **Returns**: geometry

#### st_multipointfromwkb

- **Type**: function
- **Arguments**: bytea, integer
- **Returns**: geometry

#### st_multipointfromwkb

- **Type**: function
- **Arguments**: bytea
- **Returns**: geometry

#### st_multipolyfromwkb

- **Type**: function
- **Arguments**: bytea
- **Returns**: geometry

#### st_multipolyfromwkb

- **Type**: function
- **Arguments**: bytea, integer
- **Returns**: geometry

#### st_multipolygonfromtext

- **Type**: function
- **Arguments**: text
- **Returns**: geometry

#### st_multipolygonfromtext

- **Type**: function
- **Arguments**: text, integer
- **Returns**: geometry

#### st_ndims

- **Type**: function
- **Arguments**: geometry
- **Returns**: smallint

#### st_node

- **Type**: function
- **Arguments**: g geometry
- **Returns**: geometry

#### st_normalize

- **Type**: function
- **Arguments**: geom geometry
- **Returns**: geometry

#### st_npoints

- **Type**: function
- **Arguments**: geometry
- **Returns**: integer

#### st_nrings

- **Type**: function
- **Arguments**: geometry
- **Returns**: integer

#### st_numgeometries

- **Type**: function
- **Arguments**: geometry
- **Returns**: integer

#### st_numinteriorring

- **Type**: function
- **Arguments**: geometry
- **Returns**: integer

#### st_numinteriorrings

- **Type**: function
- **Arguments**: geometry
- **Returns**: integer

#### st_numpatches

- **Type**: function
- **Arguments**: geometry
- **Returns**: integer

#### st_numpoints

- **Type**: function
- **Arguments**: geometry
- **Returns**: integer

#### st_offsetcurve

- **Type**: function
- **Arguments**: line geometry, distance double precision, params text DEFAULT ''::text
- **Returns**: geometry

#### st_orderingequals

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### st_orientedenvelope

- **Type**: function
- **Arguments**: geometry
- **Returns**: geometry

#### st_overlaps

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### st_patchn

- **Type**: function
- **Arguments**: geometry, integer
- **Returns**: geometry

#### st_perimeter

- **Type**: function
- **Arguments**: geog geography, use_spheroid boolean DEFAULT true
- **Returns**: double precision

#### st_perimeter

- **Type**: function
- **Arguments**: geometry
- **Returns**: double precision

#### st_perimeter2d

- **Type**: function
- **Arguments**: geometry
- **Returns**: double precision

#### st_point

- **Type**: function
- **Arguments**: double precision, double precision, srid integer
- **Returns**: geometry

#### st_point

- **Type**: function
- **Arguments**: double precision, double precision
- **Returns**: geometry

#### st_pointfromgeohash

- **Type**: function
- **Arguments**: text, integer DEFAULT NULL::integer
- **Returns**: geometry

#### st_pointfromtext

- **Type**: function
- **Arguments**: text, integer
- **Returns**: geometry

#### st_pointfromtext

- **Type**: function
- **Arguments**: text
- **Returns**: geometry

#### st_pointfromwkb

- **Type**: function
- **Arguments**: bytea, integer
- **Returns**: geometry

#### st_pointfromwkb

- **Type**: function
- **Arguments**: bytea
- **Returns**: geometry

#### st_pointinsidecircle

- **Type**: function
- **Arguments**: geometry, double precision, double precision, double precision
- **Returns**: boolean

#### st_pointm

- **Type**: function
- **Arguments**: xcoordinate double precision, ycoordinate double precision, mcoordinate double precision, srid integer DEFAULT 0
- **Returns**: geometry

#### st_pointn

- **Type**: function
- **Arguments**: geometry, integer
- **Returns**: geometry

#### st_pointonsurface

- **Type**: function
- **Arguments**: geometry
- **Returns**: geometry

#### st_points

- **Type**: function
- **Arguments**: geometry
- **Returns**: geometry

#### st_pointz

- **Type**: function
- **Arguments**: xcoordinate double precision, ycoordinate double precision, zcoordinate double precision, srid integer DEFAULT 0
- **Returns**: geometry

#### st_pointzm

- **Type**: function
- **Arguments**: xcoordinate double precision, ycoordinate double precision, zcoordinate double precision, mcoordinate double precision, srid integer DEFAULT 0
- **Returns**: geometry

#### st_polyfromtext

- **Type**: function
- **Arguments**: text
- **Returns**: geometry

#### st_polyfromtext

- **Type**: function
- **Arguments**: text, integer
- **Returns**: geometry

#### st_polyfromwkb

- **Type**: function
- **Arguments**: bytea
- **Returns**: geometry

#### st_polyfromwkb

- **Type**: function
- **Arguments**: bytea, integer
- **Returns**: geometry

#### st_polygon

- **Type**: function
- **Arguments**: geometry, integer
- **Returns**: geometry

#### st_polygonfromtext

- **Type**: function
- **Arguments**: text, integer
- **Returns**: geometry

#### st_polygonfromtext

- **Type**: function
- **Arguments**: text
- **Returns**: geometry

#### st_polygonfromwkb

- **Type**: function
- **Arguments**: bytea, integer
- **Returns**: geometry

#### st_polygonfromwkb

- **Type**: function
- **Arguments**: bytea
- **Returns**: geometry

#### st_polygonize

- **Type**: aggregate
- **Arguments**: geometry
- **Returns**: geometry

#### st_polygonize

- **Type**: function
- **Arguments**: geometry[]
- **Returns**: geometry

#### st_project

- **Type**: function
- **Arguments**: geog geography, distance double precision, azimuth double precision
- **Returns**: geography

#### st_quantizecoordinates

- **Type**: function
- **Arguments**: g geometry, prec_x integer, prec_y integer DEFAULT NULL::integer, prec_z integer DEFAULT NULL::integer, prec_m integer DEFAULT NULL::integer
- **Returns**: geometry

#### st_reduceprecision

- **Type**: function
- **Arguments**: geom geometry, gridsize double precision
- **Returns**: geometry

#### st_relate

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry, integer
- **Returns**: text

#### st_relate

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: text

#### st_relate

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry, text
- **Returns**: boolean

#### st_relatematch

- **Type**: function
- **Arguments**: text, text
- **Returns**: boolean

#### st_removepoint

- **Type**: function
- **Arguments**: geometry, integer
- **Returns**: geometry

#### st_removerepeatedpoints

- **Type**: function
- **Arguments**: geom geometry, tolerance double precision DEFAULT 0.0
- **Returns**: geometry

#### st_reverse

- **Type**: function
- **Arguments**: geometry
- **Returns**: geometry

#### st_rotate

- **Type**: function
- **Arguments**: geometry, double precision, geometry
- **Returns**: geometry

#### st_rotate

- **Type**: function
- **Arguments**: geometry, double precision, double precision, double precision
- **Returns**: geometry

#### st_rotate

- **Type**: function
- **Arguments**: geometry, double precision
- **Returns**: geometry

#### st_rotatex

- **Type**: function
- **Arguments**: geometry, double precision
- **Returns**: geometry

#### st_rotatey

- **Type**: function
- **Arguments**: geometry, double precision
- **Returns**: geometry

#### st_rotatez

- **Type**: function
- **Arguments**: geometry, double precision
- **Returns**: geometry

#### st_scale

- **Type**: function
- **Arguments**: geometry, geometry, origin geometry
- **Returns**: geometry

#### st_scale

- **Type**: function
- **Arguments**: geometry, double precision, double precision, double precision
- **Returns**: geometry

#### st_scale

- **Type**: function
- **Arguments**: geometry, geometry
- **Returns**: geometry

#### st_scale

- **Type**: function
- **Arguments**: geometry, double precision, double precision
- **Returns**: geometry

#### st_scroll

- **Type**: function
- **Arguments**: geometry, geometry
- **Returns**: geometry

#### st_segmentize

- **Type**: function
- **Arguments**: geog geography, max_segment_length double precision
- **Returns**: geography

#### st_segmentize

- **Type**: function
- **Arguments**: geometry, double precision
- **Returns**: geometry

#### st_seteffectivearea

- **Type**: function
- **Arguments**: geometry, double precision DEFAULT '-1'::integer, integer DEFAULT 1
- **Returns**: geometry

#### st_setpoint

- **Type**: function
- **Arguments**: geometry, integer, geometry
- **Returns**: geometry

#### st_setsrid

- **Type**: function
- **Arguments**: geog geography, srid integer
- **Returns**: geography

#### st_setsrid

- **Type**: function
- **Arguments**: geom geometry, srid integer
- **Returns**: geometry

#### st_sharedpaths

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: geometry

#### st_shiftlongitude

- **Type**: function
- **Arguments**: geometry
- **Returns**: geometry

#### st_shortestline

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: geometry

#### st_simplify

- **Type**: function
- **Arguments**: geometry, double precision
- **Returns**: geometry

#### st_simplify

- **Type**: function
- **Arguments**: geometry, double precision, boolean
- **Returns**: geometry

#### st_simplifypolygonhull

- **Type**: function
- **Arguments**: geom geometry, vertex_fraction double precision, is_outer boolean DEFAULT true
- **Returns**: geometry

#### st_simplifypreservetopology

- **Type**: function
- **Arguments**: geometry, double precision
- **Returns**: geometry

#### st_simplifyvw

- **Type**: function
- **Arguments**: geometry, double precision
- **Returns**: geometry

#### st_snap

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry, double precision
- **Returns**: geometry

#### st_snaptogrid

- **Type**: function
- **Arguments**: geometry, double precision, double precision, double precision, double precision
- **Returns**: geometry

#### st_snaptogrid

- **Type**: function
- **Arguments**: geometry, double precision, double precision
- **Returns**: geometry

#### st_snaptogrid

- **Type**: function
- **Arguments**: geometry, double precision
- **Returns**: geometry

#### st_snaptogrid

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry, double precision, double precision, double precision, double precision
- **Returns**: geometry

#### st_split

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: geometry

#### st_square

- **Type**: function
- **Arguments**: size double precision, cell_i integer, cell_j integer, origin geometry DEFAULT '010100000000000000000000000000000000000000'::geometry
- **Returns**: geometry

#### st_squaregrid

- **Type**: function
- **Arguments**: size double precision, bounds geometry, OUT geom geometry, OUT i integer, OUT j integer
- **Returns**: SETOF record

#### st_srid

- **Type**: function
- **Arguments**: geom geometry
- **Returns**: integer

#### st_srid

- **Type**: function
- **Arguments**: geog geography
- **Returns**: integer

#### st_startpoint

- **Type**: function
- **Arguments**: geometry
- **Returns**: geometry

#### st_subdivide

- **Type**: function
- **Arguments**: geom geometry, maxvertices integer DEFAULT 256, gridsize double precision DEFAULT '-1.0'::numeric
- **Returns**: SETOF geometry

#### st_summary

- **Type**: function
- **Arguments**: geometry
- **Returns**: text

#### st_summary

- **Type**: function
- **Arguments**: geography
- **Returns**: text

#### st_swapordinates

- **Type**: function
- **Arguments**: geom geometry, ords cstring
- **Returns**: geometry

#### st_symdifference

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry, gridsize double precision DEFAULT '-1.0'::numeric
- **Returns**: geometry

#### st_symmetricdifference

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: geometry

#### st_tileenvelope

- **Type**: function
- **Arguments**: zoom integer, x integer, y integer, bounds geometry DEFAULT '0102000020110F00000200000093107C45F81B73C193107C45F81B73C193107C45F81B734193107C45F81B7341'::geometry, margin double precision DEFAULT 0.0
- **Returns**: geometry

#### st_touches

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### st_transform

- **Type**: function
- **Arguments**: geom geometry, to_proj text
- **Returns**: geometry

#### st_transform

- **Type**: function
- **Arguments**: geometry, integer
- **Returns**: geometry

#### st_transform

- **Type**: function
- **Arguments**: geom geometry, from_proj text, to_srid integer
- **Returns**: geometry

#### st_transform

- **Type**: function
- **Arguments**: geom geometry, from_proj text, to_proj text
- **Returns**: geometry

#### st_translate

- **Type**: function
- **Arguments**: geometry, double precision, double precision, double precision
- **Returns**: geometry

#### st_translate

- **Type**: function
- **Arguments**: geometry, double precision, double precision
- **Returns**: geometry

#### st_transscale

- **Type**: function
- **Arguments**: geometry, double precision, double precision, double precision, double precision
- **Returns**: geometry

#### st_triangulatepolygon

- **Type**: function
- **Arguments**: g1 geometry
- **Returns**: geometry

#### st_unaryunion

- **Type**: function
- **Arguments**: geometry, gridsize double precision DEFAULT '-1.0'::numeric
- **Returns**: geometry

#### st_union

- **Type**: function
- **Arguments**: geometry[]
- **Returns**: geometry

#### st_union

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry, gridsize double precision
- **Returns**: geometry

#### st_union

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: geometry

#### st_union

- **Type**: aggregate
- **Arguments**: geometry, gridsize double precision
- **Returns**: geometry

#### st_union

- **Type**: aggregate
- **Arguments**: geometry
- **Returns**: geometry

#### st_voronoilines

- **Type**: function
- **Arguments**: g1 geometry, tolerance double precision DEFAULT 0.0, extend_to geometry DEFAULT NULL::geometry
- **Returns**: geometry

#### st_voronoipolygons

- **Type**: function
- **Arguments**: g1 geometry, tolerance double precision DEFAULT 0.0, extend_to geometry DEFAULT NULL::geometry
- **Returns**: geometry

#### st_within

- **Type**: function
- **Arguments**: geom1 geometry, geom2 geometry
- **Returns**: boolean

#### st_wkbtosql

- **Type**: function
- **Arguments**: wkb bytea
- **Returns**: geometry

#### st_wkttosql

- **Type**: function
- **Arguments**: text
- **Returns**: geometry

#### st_wrapx

- **Type**: function
- **Arguments**: geom geometry, wrap double precision, move double precision
- **Returns**: geometry

#### st_x

- **Type**: function
- **Arguments**: geometry
- **Returns**: double precision

#### st_xmax

- **Type**: function
- **Arguments**: box3d
- **Returns**: double precision

#### st_xmin

- **Type**: function
- **Arguments**: box3d
- **Returns**: double precision

#### st_y

- **Type**: function
- **Arguments**: geometry
- **Returns**: double precision

#### st_ymax

- **Type**: function
- **Arguments**: box3d
- **Returns**: double precision

#### st_ymin

- **Type**: function
- **Arguments**: box3d
- **Returns**: double precision

#### st_z

- **Type**: function
- **Arguments**: geometry
- **Returns**: double precision

#### st_zmax

- **Type**: function
- **Arguments**: box3d
- **Returns**: double precision

#### st_zmflag

- **Type**: function
- **Arguments**: geometry
- **Returns**: smallint

#### st_zmin

- **Type**: function
- **Arguments**: box3d
- **Returns**: double precision

#### testlab_create_run

- **Type**: function
- **Arguments**: p_scenario_id uuid, p_run_by uuid
- **Returns**: uuid

#### testlab_log_record

- **Type**: function
- **Arguments**: p_run_id uuid, p_scenario_id uuid, p_table_name text, p_record_id uuid, p_created_by uuid, p_table_id text DEFAULT NULL::text
- **Returns**: void

#### text

- **Type**: function
- **Arguments**: geometry
- **Returns**: text

#### unlockrows

- **Type**: function
- **Arguments**: text
- **Returns**: integer

#### updategeometrysrid

- **Type**: function
- **Arguments**: character varying, character varying, integer
- **Returns**: text

#### updategeometrysrid

- **Type**: function
- **Arguments**: catalogn_name character varying, schema_name character varying, table_name character varying, column_name character varying, new_srid_in integer
- **Returns**: text

#### updategeometrysrid

- **Type**: function
- **Arguments**: character varying, character varying, character varying, integer
- **Returns**: text

#### upsert_user_profile

- **Type**: function
- **Arguments**: "pUserId" uuid, "pRoleCode" text, "pAppCode" text, "pContactId" uuid DEFAULT NULL::uuid
- **Returns**: void

#### upsert_user_profile_by_email

- **Type**: function
- **Arguments**: p_email text, p_role_code text, p_app_code text, p_first_name text, p_last_name text, p_phone text
- **Returns**: void

#### upsert_user_profile_by_email

- **Type**: function
- **Arguments**: p_email text, p_role_code text, p_app_code text
- **Returns**: void

#### user_can_access_table

- **Type**: function
- **Arguments**: p_table_name text, p_operation text, p_user_id uuid DEFAULT NULL::uuid
- **Returns**: boolean

#### user_is_admin_or_superadmin

- **Type**: function
- **Arguments**: p_user_id uuid DEFAULT NULL::uuid
- **Returns**: boolean

#### uuid_v7

- **Type**: function
- **Arguments**: 
- **Returns**: uuid

#### validate_app_access

- **Type**: function
- **Arguments**: "pApiKey" text, "pUserId" uuid, "pRoleCode" text
- **Returns**: TABLE(is_valid boolean, "appCode" text, "appName" text, "appId" uuid)

#### verify_rls_coverage

- **Type**: function
- **Arguments**: 
- **Returns**: TABLE(table_name text, expected_policies integer, actual_policies integer, missing_policies integer, status text)

---

## Triggers

### Public Schema Triggers

| Table | Trigger Name | Event | Timing |
|-------|--------------|-------|--------|
| `agreements` | `trg_agreements__set_updated_at` | UPDATE | BEFORE |
| `agreements_status_field` | `trg_agreements_status_field__set_updated_at` | UPDATE | BEFORE |
| `apps` | `trg_apps__set_updated_at` | UPDATE | BEFORE |
| `apps__roles` | `trg_apps__roles__set_updated_at` | UPDATE | BEFORE |
| `bcp` | `trg_bcp__set_updated_at` | UPDATE | BEFORE |
| `bcp` | `trg_building_code_professionals_updated_at` | UPDATE | BEFORE |
| `bcp_availability_field` | `trg_bcp_availability_field__set_updated_at` | UPDATE | BEFORE |
| `bcp_qualified_services` | `trg_bcp_qualified_services__set_updated_at` | UPDATE | BEFORE |
| `bd_inspection_types` | `trg_bd_inspection_types__set_updated_at` | UPDATE | BEFORE |
| `bd_inspection_types` | `trg_bd_inspection_types_updated_at` | UPDATE | BEFORE |
| `building_departments` | `trg_building_departments__set_updated_at` | UPDATE | BEFORE |
| `building_departments__bcp` | `trg_building_departments__bcp__set_updated_at` | UPDATE | BEFORE |
| `building_departments_registration_status_field` | `trg_building_departments_registration_status_field__set_updated` | UPDATE | BEFORE |
| `client_users` | `trg_client_users__set_updated_at` | UPDATE | BEFORE |
| `companies` | `trg_companies__set_updated_at` | UPDATE | BEFORE |
| `companies__building_departments` | `trg_companies__building_departments__set_updated_at` | UPDATE | BEFORE |
| `companies__industry_roles` | `trg_companies__industry_roles__set_updated_at` | UPDATE | BEFORE |
| `companies__permit_expediting` | `trg_companies__permit_expediting__set_updated_at` | UPDATE | BEFORE |
| `companies__professional_licenses` | `trg_companies__professional_licenses__set_updated_at` | UPDATE | BEFORE |
| `companies__services` | `trg_companies__services__set_updated_at` | UPDATE | BEFORE |
| `companies__subcontractors` | `trg_companies__subcontractors__set_updated_at` | UPDATE | BEFORE |
| `companies__tech_tools` | `trg_companies__tech_tools__set_updated_at` | UPDATE | BEFORE |
| `companies__work_types` | `trg_companies__work_types__set_updated_at` | UPDATE | BEFORE |
| `companies_account_type_field` | `trg_companies_account_type_field__set_updated_at` | UPDATE | BEFORE |
| `companies_annual_revenue_field` | `trg_companies_annual_revenue_field__set_updated_at` | UPDATE | BEFORE |
| `companies_client_stage_field` | `trg_companies_client_stage_field__set_updated_at` | UPDATE | BEFORE |
| `companies_industry_role_field` | `trg_companies_industry_role_field__set_updated_at` | UPDATE | BEFORE |
| `companies_interest_field` | `trg_companies_interest_field__set_updated_at` | UPDATE | BEFORE |
| `companies_organization_field` | `trg_companies_organization_field__set_updated_at` | UPDATE | BEFORE |
| `companies_referral_source_field` | `trg_companies_referral_source_field__set_updated_at` | UPDATE | BEFORE |
| `companies_tech_savvy_field` | `trg_companies_tech_savvy_field__set_updated_at` | UPDATE | BEFORE |
| `companies_tech_tools_field` | `trg_companies_tech_tools_field__set_updated_at` | UPDATE | BEFORE |
| `companies_work_types_field` | `trg_companies_work_types_field__set_updated_at` | UPDATE | BEFORE |
| `construction_types` | `trg_construction_types__set_updated_at` | UPDATE | BEFORE |
| `construction_types__project_types` | `trg_construction_types__project_types__set_updated_at` | UPDATE | BEFORE |
| `contacts` | `trg_contacts__set_updated_at` | UPDATE | BEFORE |
| `contacts__building_departments` | `trg_contacts__building_departments__set_updated_at` | UPDATE | BEFORE |
| `contacts__projects` | `trg_contacts__projects__set_updated_at` | UPDATE | BEFORE |
| `contacts_type_field` | `trg_contacts_type_field__set_updated_at` | UPDATE | BEFORE |
| `deal_phase_field` | `trg_deal_phase_field__set_updated_at` | UPDATE | BEFORE |
| `deal_qualification_field` | `trg_deal_qualification_field__set_updated_at` | UPDATE | BEFORE |
| `deals` | `trg_deals__set_updated_at` | UPDATE | BEFORE |
| `deals__other_contacts` | `trg_deals__other_contacts__set_updated_at` | UPDATE | BEFORE |
| `disciplines` | `trg_disciplines__set_updated_at` | UPDATE | BEFORE |
| `employee_users` | `trg_employee_users__set_updated_at` | UPDATE | BEFORE |
| `files` | `trg_files__set_updated_at` | UPDATE | BEFORE |
| `inspection_modes` | `trg_inspection_modes__set_updated_at` | UPDATE | BEFORE |
| `inspection_modes` | `trg_inspection_modes_updated_at` | UPDATE | BEFORE |
| `inspection_sessions` | `prevent_inspectionsession_project_id_change_trigger` | UPDATE | BEFORE |
| `inspection_sessions` | `trg_inspection_sessions__set_updated_at` | UPDATE | BEFORE |
| `inspection_sessions__contacts` | `trg_inspection_sessions__contacts__set_updated_at` | UPDATE | BEFORE |
| `inspection_sessions__project_media` | `trg_inspection_sessions__project_media__set_updated_at` | UPDATE | BEFORE |
| `inspection_sessions_status_field` | `trg_inspection_sessions_status_field__set_updated_at` | UPDATE | BEFORE |
| `inspections` | `prevent_inspection_session_id_change_trigger` | UPDATE | BEFORE |
| `inspections` | `trg_inspections_updated_at` | UPDATE | BEFORE |
| `inspections_result_field` | `trg_inspections_result_field__set_updated_at` | UPDATE | BEFORE |
| `invoice_line_items` | `trg_invoice_line_items__set_updated_at` | UPDATE | BEFORE |
| `invoice_line_items` | `trg_invoice_line_items_updated_at` | UPDATE | BEFORE |
| `invoice_line_items_status_field` | `trg_invoice_line_items_status_field__set_updated_at` | UPDATE | BEFORE |
| `invoices` | `trg_invoices__set_updated_at` | UPDATE | BEFORE |
| `invoices_collection_status_field` | `trg_invoices_collection_status_field__set_updated_at` | UPDATE | BEFORE |
| `invoices_payment_status_field` | `trg_invoices_payment_status_field__set_updated_at` | UPDATE | BEFORE |
| `issue_comments` | `trg_issue_comments__set_updated_at` | UPDATE | BEFORE |
| `issue_comments` | `trg_issue_comments_updated_at` | UPDATE | BEFORE |
| `occupancies` | `trg_occupancies__set_updated_at` | UPDATE | BEFORE |
| `payment_processors` | `trg_payment_processors__set_updated_at` | UPDATE | BEFORE |
| `payments` | `trg_payments__set_updated_at` | UPDATE | BEFORE |
| `payments__invoices` | `trg_payments__invoices__set_updated_at` | UPDATE | BEFORE |
| `permit_expediting` | `trg_permit_expediting__set_updated_at` | UPDATE | BEFORE |
| `permit_expediting_document_status_field` | `trg_permit_expediting_document_status_field__set_updated_at` | UPDATE | BEFORE |
| `permit_expediting_fees_status_field` | `permit_expediting_fees_status_field__set_updated_at` | UPDATE | BEFORE |
| `permit_expediting_fees_status_field` | `trg_permit_expediting_fees_status_field__set_updated_at` | UPDATE | BEFORE |
| `permit_expediting_noc_status_field` | `trg_permit_expediting_noc_status_field__set_updated_at` | UPDATE | BEFORE |
| `permit_expediting_ntbo_status_field` | `trg_permit_expediting_ntbo_status_field__set_updated_at` | UPDATE | BEFORE |
| `permit_expediting_permit_app_status_field` | `trg_permit_expediting_permit_app_status_field__set_updated_at` | UPDATE | BEFORE |
| `permit_expediting_private_provider_field` | `trg_permit_expediting_private_provider_field__set_updated_at` | UPDATE | BEFORE |
| `permit_expediting_status_field` | `trg_permit_expediting_status_field__set_updated_at` | UPDATE | BEFORE |
| `permit_expediting_sub_form_field` | `trg_permit_expediting_sub_form_field__set_updated_at` | UPDATE | BEFORE |
| `permit_expediting_sub_permit_type_field` | `permit_expediting_sub_permit_type_field__set_updated_at` | UPDATE | BEFORE |
| `permit_expediting_sub_permit_type_field` | `trg_permit_expediting_sub_permit_type_field__set_updated_at` | UPDATE | BEFORE |
| `permit_expediting_subcontractor_info_field` | `trg_permit_expediting_subcontractor_info_field__set_updated_at` | UPDATE | BEFORE |
| `permit_expediting_workability_field` | `trg_permit_expediting_workability_field__set_updated_at` | UPDATE | BEFORE |
| `plan_review_result_field` | `trg_plan_review_result_field__set_updated_at` | UPDATE | BEFORE |
| `plan_reviews` | `prevent_planreview_planset_id_change_trigger` | UPDATE | BEFORE |
| `plan_reviews` | `trg_plan_reviews__set_updated_at` | UPDATE | BEFORE |
| `plan_reviews_status_field` | `trg_plan_reviews_status_field__set_updated_at` | UPDATE | BEFORE |
| `plan_sets` | `prevent_planset_project_id_change_trigger` | UPDATE | BEFORE |
| `plan_sets` | `trg_plan_sets__set_updated_at` | UPDATE | BEFORE |
| `plan_sets__files` | `trg_plan_set_files_updated_at` | UPDATE | BEFORE |
| `plan_sets__files` | `trg_plan_sets__files__set_updated_at` | UPDATE | BEFORE |
| `plan_sets_document_review_field` | `trg_plan_sets_document_review_field__set_updated_at` | UPDATE | BEFORE |
| `plan_sets_file_types` | `trg_plan_sets_file_types__set_updated_at` | UPDATE | BEFORE |
| `plan_sets_type_field` | `trg_plan_sets_type_field__set_updated_at` | UPDATE | BEFORE |
| `plan_sets_working_set_field` | `trg_plan_sets_working_set_field__set_updated_at` | UPDATE | BEFORE |
| `price_list` | `trg_price_list__set_updated_at` | UPDATE | BEFORE |
| `price_list_status_field` | `trg_price_list_status_field__set_updated_at` | UPDATE | BEFORE |
| `professional_licenses` | `trg_professional_licenses__set_updated_at` | UPDATE | BEFORE |
| `professional_licenses__bcp_qualified_services` | `trg_professional_licenses__bcp_qualified_services__set_updated_` | UPDATE | BEFORE |
| `professional_licenses_status_field` | `trg_professional_licenses_status_field__set_updated_at` | UPDATE | BEFORE |
| `professional_licenses_type_field` | `trg_professional_licenses_type_field__set_updated_at` | UPDATE | BEFORE |
| `project_media` | `trg_project_media__set_updated_at` | UPDATE | BEFORE |
| `project_media` | `trg_project_media_updated_at` | UPDATE | BEFORE |
| `project_media_upload_method_field` | `trg_project_media_upload_method_field__set_updated_at` | UPDATE | BEFORE |
| `project_phases` | `trg_project_phases__set_updated_at` | UPDATE | BEFORE |
| `project_phases_status_field` | `trg_project_phases_status_field__set_updated_at` | UPDATE | BEFORE |
| `project_types` | `trg_project_types__set_updated_at` | UPDATE | BEFORE |
| `projects` | `prevent_project_company_id_change_trigger` | UPDATE | BEFORE |
| `projects` | `set_project_company_id_trigger` | INSERT | BEFORE |
| `projects` | `trg_projects__set_updated_at` | UPDATE | BEFORE |
| `projects` | `trg_projects_updated_at` | UPDATE | BEFORE |
| `projects__services` | `trg_projects__services__set_updated_at` | UPDATE | BEFORE |
| `quotes` | `trg_quotes__set_updated_at` | UPDATE | BEFORE |
| `quotes_status_field` | `trg_quotes_status_field__set_updated_at` | UPDATE | BEFORE |
| `rls_permissions` | `trg_rls_permissions__audit` | DELETE | AFTER |
| `rls_permissions` | `trg_rls_permissions__audit` | UPDATE | AFTER |
| `rls_permissions` | `trg_rls_permissions__audit` | INSERT | AFTER |
| `roles` | `trg_roles__set_updated_at` | UPDATE | BEFORE |
| `services` | `trg_services__set_updated_at` | UPDATE | BEFORE |
| `services` | `trg_services_updated_at` | UPDATE | BEFORE |
| `services__deals` | `trg_services__deals__set_updated_at` | UPDATE | BEFORE |
| `standard_inspection_types` | `trg_standard_inspection_types__set_updated_at` | UPDATE | BEFORE |
| `standard_inspection_types__inspection_modes` | `trg_standard_inspection_types__inspection_modes__set_updated_at` | UPDATE | BEFORE |
| `trades` | `trg_trades__set_updated_at` | UPDATE | BEFORE |
| `user_profiles` | `trg_ensure_contact_for_user_profile` | INSERT | BEFORE |
| `user_profiles` | `trg_user_profiles__set_updated_at` | UPDATE | BEFORE |
| `user_profiles_status_field` | `trg_user_profiles_status_field__set_updated_at` | UPDATE | BEFORE |

---

## Summary Statistics

- **Total Tables**: 115
- **Public Schema Tables**: 115
- **Auth Schema Tables**: 0
- **Storage Schema Tables**: 0
- **Custom Functions**: 772
- **Triggers**: 126
- **Extensions Installed**: 6

---

## Notes

1. This schema uses Row Level Security (RLS) extensively for data access control.
2. Many tables use UUID primary keys generated with `uuid_v7()` or `gen_random_uuid()`.
3. Timestamps use `timestamp with time zone` (timestamptz) for timezone-aware storage.
4. The schema includes comprehensive audit trails via `rls_permissions_audit` table.
5. Junction tables use snake_case naming (e.g., `companies__contacts`).
6. Reference/lookup tables often use the `_field` suffix.
7. This schema reflects the standardized naming conventions after the migration on 2025-11-13.
8. Standardized fields include `created_at`, `created_by`, `updated_at`, `updated_by` across relevant tables.
9. Soft deletes are implemented using `deleted_at` timestamp fields.

---

*End of Schema Documentation*