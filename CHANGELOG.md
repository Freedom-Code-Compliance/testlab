# Changelog

All notable changes to FCC Test Lab will be documented in this file.

## [1.0.0] - 2025-01-14

### Added
- Initial project setup with Vite + React + TypeScript
- Complete FCC design system implementation
- Dashboard page with Recharts analytics
  - Total runs, success rate metrics
  - Runs over time line chart
  - Success vs failure pie chart
  - Runs by scenario bar chart
  - Date range and scenario filters
- Testing page with expandable scenario list
- Three scenario implementations:
  - New Application (one-click execution)
  - Manual Project Creation (comprehensive form with file uploads)
  - Monday.com Project Creation (with searchable dropdown and mapping view)
- History page (runs list with status tracking)
- Run detail page (grouped test records)
- Purge page (multi-select with preview)
- Responsive sidebar with hover expansion
- Theme switching (dark/light mode)
- Searchable select component
- File upload component with progress
- All UI components following FCC design system
- Error boundary for error handling
- Supabase integration with RPC functions
- Edge functions for Monday.com integration:
  - `monday_fetch_projects` (v3)
  - `monday_fetch_plan_sets` (v3)
- CORS handling for edge functions
- Comprehensive error handling and loading states

### Technical Details
- React 19.2.0
- TypeScript 5.9.3
- Vite 7.2.2
- Tailwind CSS 3.4.18
- Recharts for data visualization
- Lucide React for icons
- date-fns for date formatting
- Supabase JS client 2.81.1

### Database Integration
- All dropdowns query Supabase tables:
  - building_departments
  - project_types
  - occupancies
  - construction_types
  - companies
  - contacts (filtered by company)
  - plan_sets_file_types
- Test lab tables:
  - test_scenarios
  - test_runs
  - test_records
  - activity_log

### Edge Functions Deployed
1. `monday_fetch_projects` - Fetches Monday.com projects (v3, ACTIVE)
2. `monday_fetch_plan_sets` - Fetches Monday.com plan sets (v3, ACTIVE)
3. `apply_form_submitted` - Creates new application (existing)
4. `create_test_project` - Creates test project (existing)
5. `testlab_purge_by_run` - Purges test runs (existing)

### Fixed
- CORS errors for Monday.com API calls (moved to edge functions)
- Header spacing and color consistency
- TypeScript compilation errors
- Edge function OPTIONS request handling
- File upload field visibility
- Searchable dropdown implementation

### Known Issues
- Monday.com "Completed Projects 2" board ID needs verification
- Field mapping logic for Monday.com needs implementation
- File types visibility depends on active records in database



