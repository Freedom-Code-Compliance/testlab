# FCC Test Lab

Internal tool for generating, managing, logging, and purging test workflow data across FCC applications (FCC Apply, FCC CRM, MyFCC, FCCPRO, and fccOPS).

## Overview

FCC Test Lab eliminates manual test data creation and ensures reproducible, isolated, and safe-to-purge test environments. It provides a comprehensive dashboard for monitoring test runs, scenario execution, and data management.

## Features

### ✅ Completed Features

1. **Dashboard**
   - Real-time analytics with Recharts visualizations
   - Metrics: Total runs, success rate, completed/failed counts
   - Charts: Runs over time (line chart), Success vs Failure (pie chart), Runs by scenario (bar chart)
   - Filters: Date range (7/30/90/365 days) and scenario filter
   - Modular design for easy extension

2. **Testing Page**
   - Expandable scenario list with three scenario types:
   
   **a. New Application**
   - Simple one-click execution
   - Creates company, contact, and deal via `apply_form_submitted` edge function
   - Displays run results with record counts
   
   **b. Create New Project - Manual**
   - Slide-out form with comprehensive project creation
   - 6 file upload fields (one per `plan_sets_file_types`)
   - Searchable dropdowns for Project Type and Construction Type
   - Dynamic contact filtering based on selected company
   - Auto-sets phase to Intake (ID: 2)
   - All dropdowns populated from Supabase tables
   
   **c. Create Project from Monday.com**
   - Fetches all projects from Completed Projects 2 board
   - Searchable dropdown (by name and address)
   - Displays project name with address as helper text
   - Side-by-side mapping view (FCC fields vs Monday.com values)
   - Fetches plan set files from Monday.com Plan Sets board
   - Filters by Initial Submission plan set type

3. **History Page**
   - Lists all test runs with status badges
   - Shows scenario name, run timestamp, and status
   - Click to view detailed run information
   - Groups test records by table type

4. **Purge Runs Page**
   - Multi-select runs for batch purging
   - Preview counts before deletion
   - Requires purge reason for audit trail
   - Safe purge operations via `testlab_purge_by_run` edge function

5. **Design System**
   - Full dark/light mode support
   - FCC design system implementation
   - Responsive sidebar with hover expansion
   - Theme-aware logo switching
   - Consistent color system and typography

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS with custom FCC design system
- **Charts**: Recharts
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL, Edge Functions, Storage)
- **Routing**: React Router v7
- **Date Handling**: date-fns

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Layout.tsx          # Main layout with header and sidebar
│   │   ├── Sidebar.tsx          # Navigation sidebar with hover expansion
│   │   └── Logo.tsx             # Theme-aware logo component
│   ├── ui/
│   │   ├── PrimaryButton.tsx
│   │   ├── SecondaryButton.tsx
│   │   ├── StyledInput.tsx
│   │   ├── StyledSelect.tsx
│   │   ├── SearchableSelect.tsx # Searchable dropdown component
│   │   ├── FileUpload.tsx
│   │   ├── SummaryCard.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── StatusBadge.tsx
│   │   └── ThemeToggle.tsx
│   ├── testing/
│   │   ├── NewApplicationForm.tsx
│   │   ├── ManualProjectForm.tsx
│   │   └── MondayProjectForm.tsx
│   └── ErrorBoundary.tsx
├── context/
│   └── SettingsContext.tsx      # Theme management
├── pages/
│   ├── Dashboard.tsx            # Analytics dashboard
│   ├── Testing.tsx              # Scenario execution page
│   ├── Runs.tsx                 # History page
│   ├── RunDetail.tsx           # Run detail view
│   └── Purge.tsx               # Purge operations
├── lib/
│   ├── supabase.ts             # Supabase client and helpers
│   └── utils.ts                # Utility functions
└── types/
    └── index.ts                # TypeScript type definitions
```

## Setup

### Prerequisites

- Node.js 18+ and npm
- Supabase project with test lab tables configured
- Monday.com API key (for Monday.com integration)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Freedom-Code-Compliance/testlab.git
cd testlab
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:

Create a `.env` file:
```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_MONDAY_API_KEY=your_monday_api_key_here
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key_here
```

**Note**: The Monday.com API key is also stored as a Supabase secret (`MONDAY_API_KEY`) for use in edge functions. Set it via:
```bash
supabase secrets set MONDAY_API_KEY=your_monday_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Edge Functions

The following edge functions are deployed and active:

1. **apply_form_submitted**
   - Creates new company, contact, and deal
   - Used by New Application scenario

2. **create_test_project**
   - Creates projects from manual form or Monday.com
   - Supports both manual and Monday.com modes
   - Handles file uploads and plan set creation

3. **testlab_purge_by_run**
   - Safely purges test data for specified runs
   - Respects FK relationships and purge rules

4. **monday_fetch_projects** (v3)
   - Fetches all projects from Monday.com Completed Projects 2 board
   - Handles CORS properly
   - Returns project data with column values

5. **monday_fetch_plan_sets** (v3)
   - Fetches plan set files from Monday.com Plan Sets board
   - Filters by Initial Submission type
   - Links files to specific projects

## Database Schema

### Key Tables

- **test_scenarios**: Active test scenarios
- **test_runs**: Test run executions
- **test_records**: Logged records created during test runs
- **activity_log**: Activity tracking (run created, completed, failed, purged)

### Default Test Fixtures

- **Default Company**: `79a05b0d-0f3b-404e-9fa3-ddbd13b37ad3` ("Test Project Company 1")
- **Default Contact**: `019a7da9-cde3-7a9b-fc4d-0416789a0a46` ("John Client")

These are NOT logged in `test_records` and NEVER purged.

## Monday.com Integration

### Board IDs

- **Completed Projects 2 Board**: `18369402312` (TODO: Verify actual board ID)
- **Plan Sets Board**: `5307810845`

### API Configuration

- Monday.com API calls are made server-side through Supabase Edge Functions
- API key stored as Supabase secret: `MONDAY_API_KEY`
- All edge functions handle CORS properly

## Design System

The application follows the FCC Design System documented in `DESIGN_SYSTEM.md`:

- **Dark Mode First**: Default theme is dark mode
- **System Color**: #3366FF (consistent across apps)
- **CSS Variables**: All colors use CSS variables for seamless theme switching
- **Tailwind CSS**: Utility-first approach with custom FCC color palette

### Color Palette

- `fcc-black`: Primary background (#000000 dark / #ffffff light)
- `fcc-dark`: Secondary backgrounds (#1a1a1a dark / #f5f5f5 light)
- `fcc-divider`: Borders and dividers (#2a2a2a dark / #e5e5e5 light)
- `fcc-cyan`: System color (#3366FF - same in both modes)
- `fcc-blue`: Hover states (#0066ff)
- `fcc-white`: Primary text (#ffffff dark / #000000 light)

## Usage

### Running a Scenario

1. Navigate to **Testing** page
2. Click on a scenario to expand it
3. Fill in required fields (scenario-specific)
4. Click "Run Scenario" or "Create Project"
5. View results with run ID and created record counts

### Viewing Run History

1. Navigate to **History** page
2. View all runs with status indicators
3. Click on a run to see detailed test records grouped by table

### Purging Test Data

1. Navigate to **Purge Runs** page
2. Select runs to purge (multi-select)
3. Review preview counts
4. Enter purge reason (required)
5. Click "Purge Selected Run(s)"

## Development

### Adding New Scenarios

1. Create scenario record in `test_scenarios` table
2. Add scenario form component in `src/components/testing/`
3. Update `Testing.tsx` to route to new form based on scenario type
4. Create/update edge function if needed

### Adding New Metrics

1. Update `Dashboard.tsx` to fetch new data
2. Add new chart component using Recharts
3. Update filters if needed

## Known Issues / TODOs

1. **Monday.com Board ID**: Verify correct "Completed Projects 2" board ID (currently using `18369402312`)
2. **File Upload Fields**: Verify `plan_sets_file_types` table has active records
3. **Edge Function Error Handling**: Some edge functions may need additional error handling
4. **Mapping UI**: Monday.com field mapping UI is displayed but mapping logic needs implementation

## Environment Variables

### Required

- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
- `VITE_GOOGLE_MAPS_API_KEY`: Google Maps API key (for address autocomplete)
- `VITE_OPENAI_API_KEY`: OpenAI API key (for AI form filling)

### Optional

- `VITE_MONDAY_API_KEY`: Monday.com API key (also stored as Supabase secret)
- `VITE_SUPABASE_SERVICE_ROLE_KEY`: Service role key (for server-side operations only)

## API Endpoints

### Supabase RPC Functions

- `testlab_create_run(p_scenario_id, p_run_by)`: Creates a new test run
- `testlab_log_record(...)`: Logs a test record

### Edge Functions

- `POST /functions/v1/apply_form_submitted`: New application scenario
- `POST /functions/v1/create_test_project`: Create project (manual or Monday)
- `POST /functions/v1/testlab_purge_by_run`: Purge test runs
- `POST /functions/v1/monday_fetch_projects`: Fetch Monday.com projects
- `POST /functions/v1/monday_fetch_plan_sets`: Fetch Monday.com plan sets

## Contributing

This is an internal tool for FCC development team. For questions or issues, contact the development team.

## License

Internal use only - Freedom Code Compliance
