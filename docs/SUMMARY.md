# FCC Test Lab - Documentation Summary

**Last Updated**: 2025-01-XX  
**Version**: 1.0.0

## Quick Overview

FCC Test Lab is an internal tool for generating, managing, logging, and purging test workflow data across FCC applications (FCC Apply, FCC CRM, MyFCC, FCCPRO, and fccOPS).

### Key Features
- ✅ Dashboard with analytics (Recharts)
- ✅ Three test scenarios (New Application, Manual Project, Monday.com Project)
- ✅ Test run history and tracking
- ✅ Safe purge operations with audit trail
- ✅ Monday.com integration
- ✅ File uploads for plan sets
- ✅ Dark/light theme support

### Tech Stack
- React 19 + TypeScript + Vite
- Tailwind CSS (FCC design system)
- Supabase (PostgreSQL + Edge Functions)
- Recharts for analytics

## Documentation Structure

```
docs/
├── README.md                          # Documentation index
├── SUMMARY.md                         # This file - quick summary
├── MAINTENANCE.md                     # Documentation maintenance guide
├── QUICK_START.md                     # Setup and getting started
├── API_REFERENCE.md                   # Complete API docs
├── DESIGN_SYSTEM.md                   # UI/UX guidelines
├── IMPLEMENTATION_STATUS.md           # Current state
├── IMPLEMENTATION_GUIDE.md            # Enhancement patterns
├── SHARED_PATTERNS_FROM_OTHER_PROJECTS.md  # Best practices
├── EDGE_FUNCTIONS_SETUP.md           # Edge function guide
├── CHANGELOG.md                       # Version history
├── DOCUMENTATION.md                   # Detailed doc index
├── FCC_Test_Lab_PRD_v1.2.md          # Product requirements
├── Plan_Set_File_Upload_Payload_Comparison.md
└── CORS Error.md                     # Troubleshooting
```

## Current Status

### ✅ Completed (100%)
- Full application implementation
- All three scenarios working
- Dashboard with analytics
- Monday.com integration (server-side)
- File uploads
- Purge operations
- Theme switching
- Responsive design

### 🔄 Needs Verification
- Monday.com "Completed Projects 2" board ID
- File types visibility (check database)
- Field mapping logic implementation

### 📋 Future Enhancements
- Enhanced error handling
- Additional metrics
- Bulk operations
- Export functionality
- Advanced search/filtering

## Quick Links

| Need | Document |
|------|----------|
| Get started | [QUICK_START.md](./QUICK_START.md) |
| API details | [API_REFERENCE.md](./API_REFERENCE.md) |
| Design guidelines | [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) |
| Current status | [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) |
| Edge functions | [EDGE_FUNCTIONS_SETUP.md](./EDGE_FUNCTIONS_SETUP.md) |
| All changes | [CHANGELOG.md](./CHANGELOG.md) |

## Key Concepts

### Test Scenarios
1. **New Application** - Creates company, contact, and deal
2. **Manual Project** - Creates project with file uploads
3. **Monday.com Project** - Imports project from Monday.com

### Test Data Flow
1. User runs scenario → Creates test run
2. Edge function executes → Creates records
3. Records logged → Tracked in `test_records`
4. Purge when done → Safe deletion with audit trail

### Database Tables
- `test_scenarios` - Scenario definitions
- `test_runs` - Run executions
- `test_records` - Created records tracking
- `activity_log` - Activity audit trail

## Environment Variables

**Required:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GOOGLE_MAPS_API_KEY`
- `VITE_OPENAI_API_KEY`

**Optional:**
- `VITE_MONDAY_API_KEY` (also stored as Supabase secret)

## Edge Functions

1. `apply_form_submitted` - New application scenario
2. `create_test_project` - Project creation
3. `testlab_purge_by_run` - Safe data purging
4. `monday_fetch_projects` - Monday.com projects
5. `monday_fetch_plan_sets` - Monday.com plan sets

## Recent Updates

- Fixed New Application test records logging
- Fixed purge foreign key constraint errors
- Added cascading deletes for plan sets
- Project type refactor (replaced work types)
- Plan set workflow improvements

See [CHANGELOG.md](./CHANGELOG.md) for complete history.

## Support

1. Check relevant documentation
2. Review [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) for known issues
3. Check browser console and Supabase logs
4. Contact development team

---

For detailed information, see the [full documentation index](./README.md).

