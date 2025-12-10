# Quick Start Guide

## Getting Started

### 1. Prerequisites
- Node.js 18+ installed
- Access to Supabase project
- Monday.com API key (for Monday.com integration)

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/Freedom-Code-Compliance/testlab.git
cd testlab

# Install dependencies
npm install
```

### 3. Environment Setup

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then edit the `.env` file and add your actual values:

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_MONDAY_API_KEY=your_monday_api_key_here
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key_here
```

**Note:** The `.env` file is already in `.gitignore`, so it won't be committed to the repository. The `.env.example` file serves as a template.

**Important**: The Monday.com API key must also be set as a Supabase secret:
```bash
supabase secrets set MONDAY_API_KEY=your_monday_api_key_here
```

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Using the Application

### Dashboard
- View test run analytics
- Filter by date range and scenario
- Monitor success rates and trends

### Testing Page
1. Click on a scenario to expand it
2. Fill in required fields
3. Click "Run Scenario" or "Create Project"
4. View results with run ID and created records

### History Page
- View all test runs
- Click a run to see detailed records
- Filter and search runs

### Purge Runs
1. Select runs to purge
2. Review preview counts
3. Enter purge reason
4. Confirm purge

## Common Tasks

### Running a New Application Scenario
1. Go to Testing page
2. Click "New Application"
3. Click "Run Scenario"
4. Wait for completion
5. View created records

### Creating a Manual Project
1. Go to Testing page
2. Click "Create New Project - Manual"
3. Fill in project details
4. Upload plan set files (6 file types)
5. Click "Create Project"

### Creating a Project from Monday.com
1. Go to Testing page
2. Click "Create Project from Monday.com"
3. Search and select a Monday.com project
4. Click "Map Project" to view mapping
5. Click "Create Project from Monday.com"

## Troubleshooting

### Edge Function Errors
- Check Supabase Edge Functions logs
- Verify secrets are set correctly
- Check browser console for detailed errors

### File Uploads Not Showing
- Verify `plan_sets_file_types` table has active records
- Check browser console for loading errors

### Monday.com Integration Not Working
- Verify Monday.com API key is set as Supabase secret
- Check edge function logs
- Verify board IDs are correct

### CORS Errors
- All Monday.com calls go through edge functions
- If you see CORS errors, check edge function CORS headers

## Support

For issues or questions, check:
1. This documentation
2. Browser console for errors
3. Supabase Edge Functions logs
4. Implementation status in `IMPLEMENTATION_STATUS.md`



