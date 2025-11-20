# Manual Project Form Persistence Issue

## 1. Original Request

The user requested that all form information and IDs in the "Create New Project - Manual" form be saved in the browser (localStorage) until "Clear Data" is selected or a Plan Set is submitted. However, the user later clarified that:

- The data should **NOT** clear on plan set submission
- The data should only clear when "Clear Data" is explicitly clicked
- When navigating away and returning to the Testing page, the form should restore to its previous state:
  - If no data persists → show empty form (allows user input)
  - If data persists with a created project → show success message and PlanSetPanel (same state as when project was submitted)

Additionally, the user specified:
- The dropdown should **NOT** auto-expand when returning to the page
- But when the dropdown is **manually expanded**, it should return to the persisted state (success message + PlanSetPanel if project was created)

## 2. Problem After Implementation

After implementing the persistence feature, the user is experiencing a **"black box"** issue:

- When expanding the "Create New Project - Manual" dropdown, instead of seeing:
  - The form (if no persisted data), OR
  - The success message and PlanSetPanel (if project was created)
- The user sees a **black/empty box** with no content visible

This suggests that the conditional rendering logic is not working correctly, or the state is not being restored properly when the component mounts.

## 3. Implementation Steps Taken

### Step 1: Initial Implementation (Persistence Feature)

**Files Modified:**
- `src/lib/utils.ts` - Added `debounce` utility function
- `src/components/testing/ManualProjectForm.tsx` - Added localStorage persistence
- `src/components/testing/PlanSetPanel.tsx` - Added optional callback prop

**Changes Made:**

1. **Added Storage Structure:**
   ```typescript
   interface SavedFormState {
     version: number;
     userId: string;
     scenarioId: string;
     formData: { ... };
     createdProjectId: string | null;
     runId: string | null;
     projectCreated: boolean;
     formCollapsed: boolean;
     selectedConstructionType: { id: string; name: string } | null;
     selectedOccupancy: { id: string; name: string } | null;
     addressSearch: string;
     addressSelected: boolean;
     savedAt: string;
   }
   ```

2. **Created Save Function:**
   - `saveFormState()` - Saves all form state to localStorage
   - Debounced with 400ms delay
   - Includes userId and version for validation
   - Guards against SSR with `typeof window !== 'undefined'`

3. **Created Load Function:**
   - `loadFormState()` - Loads and validates saved state
   - Validates version, userId, scenarioId
   - Restores form data
   - If `createdProjectId` exists: restores success state (formCollapsed = true, projectCreated = true, etc.)
   - If no `createdProjectId`: restores form fields only (formCollapsed = false)

4. **Added useEffect Hooks:**
   - Load hook: Runs on mount when user is available
   - Save hook: Debounced save when state changes

5. **Updated handleClearAndRunAgain:**
   - Clears localStorage
   - Resets all state

### Step 2: First Fix Attempt (Missing `results` State)

**Problem Identified:**
The `results` state (edge function response) was not being persisted, causing the success message to not render because the condition `formCollapsed && results && runId` failed.

**Changes Made:**

1. **Updated `SavedFormState` interface:**
   ```typescript
   interface SavedFormState {
     // ... existing fields
     results: any | null;  // Added this field
     savedAt: string;
   }
   ```

2. **Updated `saveFormState`:**
   - Added `results: results || null` to the saved state object

3. **Updated `loadFormState`:**
   - When restoring state with `createdProjectId`, added:
     ```typescript
     setResults(parsed.results || null);
     ```

4. **Updated dependency arrays:**
   - Added `results` to `saveFormState` dependencies
   - Added `results` to the save effect dependencies

5. **Updated rendering condition:**
   - Changed from: `{formCollapsed && results && runId && (`
   - To: `{formCollapsed && results && runId && createdProjectId && (`

6. **Added validation in `loadFormState`:**
   - Only restore success state if both `createdProjectId` AND `runId` exist
   - If data is incomplete, default to showing form (formCollapsed = false)

### Current Rendering Logic

The component uses conditional rendering:

```typescript
{!formCollapsed && (
  <form>
    {/* Form fields */}
  </form>
)}

{formCollapsed && results && runId && createdProjectId && (
  <>
    {/* Success message */}
    {/* PlanSetPanel */}
  </>
)}
```

### Potential Issues

1. **State Initialization:**
   - When component first mounts, `formCollapsed` might be `false` by default
   - If `loadFormState` hasn't run yet (user not available), the form might not render
   - If `loadFormState` runs but finds no persisted data, it should leave `formCollapsed = false`

2. **Timing Issue:**
   - The `loadFormState` runs in a `useEffect` that depends on `user?.id` and `scenarioId`
   - If the user is not immediately available, the state might not load until after initial render
   - This could cause the component to render with default state (formCollapsed = false) but no form content

3. **Conditional Rendering Edge Case:**
   - If `formCollapsed` is somehow `true` but `results`, `runId`, or `createdProjectId` are missing/null
   - Neither the form nor the success state would render → black box

4. **State Restoration Logic:**
   - The `loadFormState` function sets `formCollapsed = false` if no `createdProjectId` exists
   - But if there's a race condition or the state is partially restored, `formCollapsed` might be `true` while other required state is missing

### Files to Review

1. **`src/components/testing/ManualProjectForm.tsx`**
   - Lines 173-254: `loadFormState` function
   - Lines 260-265: Load effect hook
   - Lines 842-1105: Form rendering (`!formCollapsed`)
   - Lines 1109-1143: Success state rendering (`formCollapsed && results && runId && createdProjectId`)

2. **`src/pages/Testing.tsx`**
   - Lines 12, 37-39: `selectedScenario` state management
   - Lines 100-112: Conditional rendering of form components

### Questions for ChatGPT Review

1. Is there a timing issue with `loadFormState` running after the initial render?
2. Should we add a loading state while checking localStorage?
3. Is the conditional rendering logic correct, or should we add a fallback?
4. Should `formCollapsed` default to `false` and only be set to `true` when we have all required success state data?
5. Is there a race condition between the component mounting and the user/auth being available?

