# Deployment Setup Guide

This project uses GitHub Actions to automatically deploy to Netlify when code is pushed to specific branches.

## Branch Strategy

- **`dev`** branch → Deploys to Development environment on Netlify
- **`main`** branch → Deploys to Production environment on Netlify

## Required GitHub Secrets

You need to set up secrets in your GitHub repository for both environments.

### For Development Environment

Go to: **Settings → Environments → development → Secrets**

Required secrets:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `NETLIFY_AUTH_TOKEN` - Your Netlify personal access token
- `NETLIFY_SITE_ID` - (Optional) Your Netlify site ID (will be auto-created if not provided)
- `SLACK_WEBHOOK_URL` - (Optional) Slack webhook URL for deployment notifications

### For Production Environment

Go to: **Settings → Environments → production → Secrets**

Required secrets:

- `VITE_SUPABASE_URL` - Your Supabase project URL (production)
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key (production)
- `NETLIFY_AUTH_TOKEN` - Your Netlify personal access token
- `NETLIFY_SITE_ID` - (Optional) Your Netlify site ID (will be auto-created if not provided)
- `SLACK_WEBHOOK_URL` - (Optional) Slack webhook URL for deployment notifications

## How to Get Netlify Auth Token

1. Go to [Netlify User Settings](https://app.netlify.com/user/applications)
2. Click "New access token"
3. Give it a name (e.g., "GitHub Actions")
4. Copy the token and add it to your GitHub secrets

## Environment Variables in Netlify

The workflow automatically sets environment variables in Netlify after deployment. However, if you need to set them manually or verify they're set:

### Via Netlify UI (Recommended for verification)

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Ensure these variables are set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Via Netlify CLI

```bash
netlify env:set VITE_SUPABASE_URL "your-url" --site=YOUR_SITE_ID
netlify env:set VITE_SUPABASE_ANON_KEY "your-key" --site=YOUR_SITE_ID
```

**⚠️ IMPORTANT:** Since builds happen in GitHub Actions, these variables are embedded into the built files **during the build process**. The Netlify environment variables are mainly for:

- Future builds if you switch to Netlify builds
- `netlify dev` local development
- Runtime environment (if needed)

**If you see "Missing required Supabase environment variables" on the deployed site:**
- This means the variables weren't embedded during the GitHub Actions build
- Check that GitHub Secrets are set correctly (see [TROUBLESHOOTING_ENV_VARS.md](./TROUBLESHOOTING_ENV_VARS.md))
- You must re-deploy after setting/fixing GitHub Secrets

## First Deployment

On the first deployment, if you don't provide `NETLIFY_SITE_ID`, the workflow will:

1. Automatically create a new Netlify site
2. Display the site ID in the workflow logs
3. You should then add this `NETLIFY_SITE_ID` to your GitHub secrets for faster subsequent deployments
4. The workflow will automatically set environment variables in Netlify

## Branch Protection

The `branch-protection.yml` workflow ensures:

- Pull requests to `main` must come from `dev` branch
- All PRs are validated with typecheck and build checks

## Workflow Files

- `.github/workflows/deploy-dev.yml` - Deploys `dev` branch to development
- `.github/workflows/deploy-production.yml` - Deploys `main` branch to production
- `.github/workflows/branch-protection.yml` - Validates PRs and enforces branch rules
- `.github/workflows/pre-merge-checks.yml` - Runs typecheck, build, and lint checks on PRs

## Pre-Merge Checks

The `pre-merge-checks.yml` workflow runs automatically on:

- Pull requests to `dev` or `main`
- Direct pushes to `dev` or `main`

It performs:

- **TypeScript Type Check** - Validates TypeScript compilation
- **Build Check** - Verifies the application builds successfully
- **Format Check** - Checks code formatting (optional, non-blocking)
- **Lint Check** - Checks for common issues like console.log statements (non-blocking)

## Deployment Process

1. **Code pushed to `dev` or `main`**
2. **Pre-merge checks run** (if PR) or deployment starts (if direct push)
3. **Build verification** - Environment variables are checked and embedded
4. **Netlify deployment** - Site is created if needed, then deployed
5. **Environment variables set** - Variables are set in Netlify (for reference)
6. **Slack notification** - Deployment status is sent to Slack (if configured)

## Troubleshooting

### Build Fails with Missing Environment Variables

- Check that secrets are set in GitHub: **Settings → Environments → [environment] → Secrets**
- Verify secret names match exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Check workflow logs for specific error messages

### Deployment Fails

- Verify `NETLIFY_AUTH_TOKEN` is set correctly
- Check Netlify API limits
- Review workflow logs for Netlify API errors

### Slack Notifications Not Working

- Verify `SLACK_WEBHOOK_URL` is set in GitHub secrets
- Check that the webhook URL is valid
- Note: Slack notification failures don't block deployment

### Typecheck or Build Checks Fail

- Run `npm run typecheck` locally to see errors
- Run `npm run build:client` locally to verify build
- Fix TypeScript errors before pushing

## Netlify Site Configuration

The `netlify.toml` file configures:

- Build command: `npm run build:client`
- Publish directory: `dist`
- Node version: 20
- SPA routing: All routes redirect to `index.html`

## Additional Environment Variables

If your application requires additional environment variables:

1. Add them to GitHub secrets (development and/or production)
2. Update the build step in deployment workflows to include them
3. The variables will be embedded in the build automatically

Example additional variables that might be needed:

- `VITE_MONDAY_API_KEY` - Monday.com API key
- `VITE_OPENAI_API_KEY` - OpenAI API key
- `VITE_GOOGLE_MAPS_API_KEY` - Google Maps API key

## Manual Deployment

If you need to deploy manually:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the application
npm run build:client

# Deploy to Netlify
netlify deploy --prod --dir=dist --site=YOUR_SITE_ID
```

## Troubleshooting

### Environment Variables Not Working on Deployed Site

If you see "Missing required Supabase environment variables" on the deployed site:

**This means variables weren't embedded during the build.** See [TROUBLESHOOTING_ENV_VARS.md](./TROUBLESHOOTING_ENV_VARS.md) for detailed steps.

Quick fixes:
1. Verify GitHub Secrets are set in **Settings → Environments → [environment] → Secrets**
2. Check secret names match exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Ensure secrets are in the correct environment (development for dev, production for main)
4. **Re-deploy** after fixing secrets (push a new commit or manually trigger workflow)

### Build Fails with Missing Environment Variables

- Check that secrets are set in GitHub: **Settings → Environments → [environment] → Secrets**
- Verify secret names match exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Check workflow logs for specific error messages

## Support

For deployment issues:

1. **Environment Variables?** See [TROUBLESHOOTING_ENV_VARS.md](./TROUBLESHOOTING_ENV_VARS.md)
2. Check workflow logs in GitHub Actions
3. Review Netlify deployment logs
4. Verify all secrets are set correctly
5. Check that branch protection rules allow the deployment

