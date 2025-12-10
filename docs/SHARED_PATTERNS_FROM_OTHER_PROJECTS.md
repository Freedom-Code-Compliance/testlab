# Shared Patterns from Other FCC Projects

This document consolidates patterns, configurations, and best practices from other FCC projects (fccOPS, fccCRM) that should be considered for integration into testlab-1.

## 1. Supabase Client Configuration

### Current Implementation (testlab-1)
- Basic Supabase client creation
- Simple error throwing for missing env vars

### Improved Pattern (from fccOPS/fccCRM)
Both projects use enhanced validation with development warnings:

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Validate environment variables in development
if (import.meta.env.DEV) {
  if (!supabaseUrl || supabaseUrl === '') {
    console.warn(
      '⚠️ VITE_SUPABASE_URL is not set. Please create a .env.local file with your Supabase configuration.\n' +
      'See .env.example for reference.'
    )
  }
  if (!supabaseAnonKey || supabaseAnonKey === '') {
    console.warn(
      '⚠️ VITE_SUPABASE_ANON_KEY is not set. Please create a .env.local file with your Supabase configuration.\n' +
      'See .env.example for reference.'
    )
  }
}

// In production, throw error if variables are missing (they should be embedded in build)
if (import.meta.env.PROD && (!supabaseUrl || !supabaseAnonKey)) {
  throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Benefits:**
- Better developer experience with helpful warnings
- Clearer error messages
- Production safety checks

## 2. AuthContext with Token Refresh

### Current Implementation (testlab-1)
- Basic AuthContext exists
- May not have automatic token refresh

### Enhanced Pattern (from fccOPS/fccCRM)
Both projects implement automatic token refresh 5 minutes before expiry:

**Key Features:**
1. **Automatic Token Refresh**: Refreshes session 5 minutes before expiry
2. **Profile Storage**: Stores user profile in localStorage
3. **Session Management**: Proper cleanup on sign out
4. **Error Handling**: Better network error handling

**Key Implementation Details:**
```typescript
// Setup automatic token refresh
const setupTokenRefresh = useCallback((session: Session | null) => {
  if (!session?.expires_at) return;
  
  const expiresAt = session.expires_at * 1000; // Convert to milliseconds
  const now = Date.now();
  const timeUntilExpiry = expiresAt - now;
  const refreshBeforeExpiry = 5 * 60 * 1000; // Refresh 5 minutes before expiry
  
  if (timeUntilExpiry > refreshBeforeExpiry) {
    refreshTimerRef.current = setTimeout(async () => {
      const { data: { session: newSession } } = await supabase.auth.refreshSession();
      if (newSession) {
        setSession(newSession);
        setUser(newSession.user);
        setupTokenRefresh(newSession);
      }
    }, timeUntilExpiry - refreshBeforeExpiry);
  }
}, []);
```

**Benefits:**
- Prevents session expiry during active use
- Better user experience
- Automatic session management

## 3. SettingsContext Pattern

### Current Implementation (testlab-1)
- Already implements similar pattern
- Theme switching works correctly

### Verification Needed
Both fccOPS and fccCRM use identical SettingsContext patterns. testlab-1 should verify:
- ✅ Theme persistence in localStorage
- ✅ Immediate theme application on mount
- ✅ System theme preference detection
- ✅ Media query listener for system theme changes

**Current implementation appears correct** - no changes needed.

## 4. CSS Enhancements

### Current Implementation (testlab-1)
- Basic CSS variables
- Standard Tailwind setup

### Enhanced Patterns (from fccCRM)
fccCRM includes additional CSS improvements:

1. **Scrollbar Hiding** (while maintaining scroll functionality):
```css
/* Hide scrollbars globally while maintaining scroll functionality */
* {
  /* Firefox */
  scrollbar-width: none;
  /* Webkit browsers (Chrome, Safari, Edge) */
  -ms-overflow-style: none;
}

*::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
  background: transparent;
}

/* Ensure scrolling still works */
html,
body {
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```

2. **Better Base Styles**:
```css
:where(p, span, li, h1, h2, h3, h4, h5, h6, a, button, label, td, th) {
  overflow-wrap: anywhere;
  word-break: break-word;
}

pre,
code {
  overflow-x: auto;
  white-space: pre;
}
```

3. **Font Import** (fccCRM uses Inter font):
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
```

**Benefits:**
- Cleaner UI without visible scrollbars
- Better text wrapping
- Consistent typography

## 5. Tailwind Configuration

### Current Implementation (testlab-1)
- Basic Tailwind config
- FCC color variables defined

### Enhanced Pattern (from fccCRM)
fccCRM has more comprehensive Tailwind config with:
- Container configuration
- Additional color mappings (for shadcn/ui compatibility)
- Border radius variables
- Animation keyframes
- `tailwindcss-animate` plugin

**Considerations:**
- testlab-1 may not need all shadcn/ui mappings
- Container config could be useful
- Animation support might be beneficial

## 6. Utility Functions

### Missing in testlab-1
Both fccOPS and fccCRM use a `cn()` utility function:

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Usage:**
```tsx
// Instead of:
className={`bg-fcc-dark ${isActive ? 'border-fcc-cyan' : ''} ${className}`}

// Use:
className={cn('bg-fcc-dark', isActive && 'border-fcc-cyan', className)}
```

**Benefits:**
- Better className merging
- Handles Tailwind class conflicts
- Cleaner code

**Dependencies needed:**
- `clsx` (already in fccOPS)
- `tailwind-merge` (already in fccOPS)

## 7. Type Definitions

### API Types Pattern (from fccOPS)
fccOPS has well-defined API types:

```typescript
// src/types/api.ts
export interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  roleCode?: string;
  appCode?: number;
  [key: string]: unknown;
}

export interface LoginResponse {
  session: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    expires_at?: number;
    token_type: string;
    user: {
      id: string;
      email?: string;
      [key: string]: unknown;
    };
    profile?: UserProfile;
  } | null;
  error: {
    message: string;
    status?: number;
  } | null;
}
```

**Benefits:**
- Type safety
- Better IDE autocomplete
- Consistent API response handling

## 8. Environment Variable Patterns

### Current Implementation (testlab-1)
- Uses standard Vite env vars
- Basic validation

### Enhanced Pattern
Consider adding:
- `.env.example` file with all required variables
- Better documentation of optional vs required vars
- Development vs production validation differences

## 9. Error Handling Patterns

### Network Error Handling (from fccOPS)
fccOPS has enhanced network error handling in AuthContext:

```typescript
// Handle network errors (fetch failed completely)
if (!response) {
  return { error: new Error('Network error: Unable to reach the server. Please check your connection.') };
}

// Handle non-JSON responses
let data: LoginResponse;
try {
  data = await response.json();
} catch (jsonError) {
  const text = await response.text();
  console.error('Failed to parse login response:', text);
  return { 
    error: new Error(`Server error: ${response.status} ${response.statusText}. Please try again.`) 
  };
}
```

**Benefits:**
- Better error messages for users
- Handles edge cases
- More robust error handling

## 10. Package Dependencies Comparison

### Missing Dependencies in testlab-1
Consider adding:
- `clsx` - For className utilities
- `tailwind-merge` - For merging Tailwind classes
- `class-variance-authority` - If using variant-based components (fccOPS uses this)

### Version Alignment
- Both projects use similar React versions (19.x)
- Supabase client versions are aligned (2.81.1)
- Consider aligning other dependencies

## Recommendations

### High Priority
1. ✅ **Add `cn()` utility function** - Simple addition, high value
2. ✅ **Enhance Supabase client validation** - Better DX
3. ✅ **Add scrollbar hiding CSS** - UI polish
4. ✅ **Review AuthContext token refresh** - Security/UX

### Medium Priority
5. ⚠️ **Add API type definitions** - Type safety
6. ⚠️ **Enhance error handling** - Better UX
7. ⚠️ **Add `.env.example` file** - Documentation

### Low Priority
8. 📋 **Consider Tailwind config enhancements** - If needed
9. 📋 **Font import** - If design system requires it
10. 📋 **Additional utility functions** - As needed

## Implementation Notes

### Backward Compatibility
- All suggested changes are additive
- No breaking changes to existing functionality
- Can be implemented incrementally

### Testing Considerations
- Test token refresh functionality
- Verify scrollbar hiding doesn't break scrolling
- Test error handling paths
- Verify theme switching still works

## Files to Update

1. `src/lib/supabase.ts` - Enhanced validation
2. `src/lib/utils.ts` - Add `cn()` function (or create if doesn't exist)
3. `src/index.css` - Add scrollbar hiding, base styles
4. `src/context/AuthContext.tsx` - Review token refresh implementation
5. `src/types/api.ts` - Add API type definitions (if needed)
6. `package.json` - Add `clsx` and `tailwind-merge` dependencies
7. `.env.example` - Create example env file

## References

- fccOPS: `/Users/joaquinnavarro/projects/fccOPS`
- fccCRM: `/Users/joaquinnavarro/projects/fccCRM`
- Both projects share similar patterns, indicating these are established best practices

