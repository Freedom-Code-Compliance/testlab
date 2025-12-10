# Troubleshooting Environment Variables in Deployment

If you're seeing "Missing required Supabase environment variables" on the deployed site, this guide will help you fix it.

## Understanding the Problem

**Vite embeds environment variables at BUILD time, not runtime.**

This means:
- ✅ Variables must be available during the GitHub Actions build
- ❌ Setting variables in Netlify UI won't help (they're set after the build)
- ✅ Variables must be in GitHub Secrets before the build runs

## Root Cause

The error occurs because:
1. The build happened without the environment variables
2. Vite couldn't embed them in the JavaScript bundle
3. The deployed app has empty/undefined variables

## Solution Steps

### Step 1: Verify GitHub Secrets Are Set

1. Go to your GitHub repository
2. Navigate to: **Settings → Environments**
3. Click on **development** (for `dev` branch) or **production** (for `main` branch)
4. Click **Secrets** in the environment
5. Verify these secrets exist:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Step 2: Check Secret Values

Make sure the secrets:
- ✅ Are not empty
- ✅ Have the correct names (exact match, case-sensitive)
- ✅ Are in the correct environment:
  - `dev` branch → `development` environment
  - `main` branch → `production` environment

### Step 3: Check Workflow Logs

After pushing to trigger a new deployment:

1. Go to **Actions** tab in GitHub
2. Click on the latest workflow run
3. Expand the **Build application** step
4. Look for these messages:

**✅ Good signs:**
- `✅ VITE_SUPABASE_URL is set (length: XX chars)`
- `✅ VITE_SUPABASE_ANON_KEY is set (length: XX chars)`
- `✅ Verified: Supabase URL is embedded in build`
- `✅ Verified: Supabase key is embedded in build`

**❌ Bad signs:**
- `❌ ERROR: VITE_SUPABASE_URL is not set!`
- `❌ ERROR: Supabase URL NOT found in built file!`
- `❌ BUILD FAILED: Environment variables were not embedded`

### Step 4: Re-deploy After Fixing Secrets

**Important:** After setting or fixing secrets, you MUST trigger a new deployment:

1. Make a small change (like updating a comment)
2. Commit and push to `dev` or `main`
3. This triggers a new build with the correct variables

Or manually trigger:
1. Go to **Actions** tab
2. Select the workflow (Deploy to Netlify)
3. Click **Run workflow**
4. Select the branch and run

## Common Issues

### Issue: Secrets Are in Repository Secrets, Not Environment Secrets

**Symptom:** Build succeeds but variables aren't embedded

**Fix:** Move secrets from:
- **Settings → Secrets and variables → Actions** (Repository secrets)

To:
- **Settings → Environments → [environment] → Secrets** (Environment secrets)

### Issue: Secrets Are Empty

**Symptom:** Build shows "set: yes" but length is 0

**Fix:** Re-add the secrets with actual values (not empty strings)

### Issue: Wrong Environment

**Symptom:** Secrets are set but in the wrong environment

**Fix:**
- `dev` branch uses `development` environment
- `main` branch uses `production` environment

Make sure secrets are in the correct environment.

### Issue: Secret Names Don't Match

**Symptom:** Variables not found even though secrets exist

**Fix:** Secret names must be exactly:
- `VITE_SUPABASE_URL` (not `SUPABASE_URL` or `VITE_SUPABASE_URL_DEV`)
- `VITE_SUPABASE_ANON_KEY` (not `SUPABASE_ANON_KEY`)

## Verification

After fixing secrets and re-deploying, verify:

1. **Check workflow logs** - Should show variables embedded
2. **Check deployed site** - Should load without environment variable errors
3. **Check browser console** - Should not show Supabase connection errors

## Quick Checklist

- [ ] Secrets are in **Environments**, not Repository secrets
- [ ] Secrets are in the **correct environment** (development for dev, production for main)
- [ ] Secret names are **exactly** `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- [ ] Secrets have **actual values** (not empty)
- [ ] **New deployment** was triggered after fixing secrets
- [ ] Workflow logs show variables are **embedded** in build

## Still Not Working?

1. Check the exact error in browser console
2. Check workflow logs for the "Build application" step
3. Verify the built file actually contains the variables (check verification step output)
4. Make sure you're checking the correct environment (dev vs production)
5. Try clearing browser cache and hard refresh

## Note About Netlify Environment Variables

The workflow sets environment variables in Netlify, but these are:
- For `netlify dev` local development
- For future reference
- **NOT used for the deployed build** (build happens in GitHub Actions)

The variables in the deployed app come from the GitHub Actions build, not Netlify.

