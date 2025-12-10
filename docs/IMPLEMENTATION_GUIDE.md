# Implementation Guide: Bringing Patterns from Other FCC Projects

This guide provides specific code changes to bring testlab-1 in line with patterns from fccOPS and fccCRM.

## Quick Summary

**Current Status:**
- ✅ SettingsContext - Already matches pattern
- ⚠️ AuthContext - Missing token refresh
- ⚠️ Supabase client - Basic validation, could be enhanced
- ⚠️ Utils - Missing `cn()` function
- ⚠️ CSS - Missing scrollbar hiding and base styles

## 1. Add `cn()` Utility Function

### Update `src/lib/utils.ts`

Add the `cn()` function at the top of the file:

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';

// Add this function
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Keep existing functions...
export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy h:mm a');
}
// ... rest of file
```

### Update `package.json`

Add dependencies:
```json
{
  "dependencies": {
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0"
  }
}
```

Then run:
```bash
npm install
```

## 2. Enhance Supabase Client

### Update `src/lib/supabase.ts`

Replace the current implementation with:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate environment variables in development
if (import.meta.env.DEV) {
  if (!supabaseUrl || supabaseUrl === '') {
    console.warn(
      '⚠️ VITE_SUPABASE_URL is not set. Please create a .env.local file with your Supabase configuration.\n' +
      'See .env.example for reference.'
    );
  }
  if (!supabaseAnonKey || supabaseAnonKey === '') {
    console.warn(
      '⚠️ VITE_SUPABASE_ANON_KEY is not set. Please create a .env.local file with your Supabase configuration.\n' +
      'See .env.example for reference.'
    );
  }
}

// In production, throw error if variables are missing (they should be embedded in build)
if (import.meta.env.PROD && (!supabaseUrl || !supabaseAnonKey)) {
  throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// RPC helper functions (keep existing)
export async function createTestRun(scenarioId: string, runBy: string | null = null) {
  // ... existing code
}

// ... rest of existing functions
```

## 3. Enhance AuthContext with Token Refresh

### Update `src/context/AuthContext.tsx`

Add token refresh functionality. Key changes:

1. Add `useRef` and `useCallback` imports
2. Add token refresh logic
3. Add profile storage (optional, if needed)

**Minimal enhancement (token refresh only):**

```typescript
import { createContext, useContext, useEffect, useState, useRef, useCallback, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// ... existing interface

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Setup automatic token refresh
  const setupTokenRefresh = useCallback((session: Session | null) => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }

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
    } else {
      // Token expires soon, refresh immediately
      supabase.auth.refreshSession().then(({ data: { session: newSession } }) => {
        if (newSession) {
          setSession(newSession);
          setUser(newSession.user);
          setupTokenRefresh(newSession);
        }
      });
    }
  }, []);

  useEffect(() => {
    // Get initial session
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      // Setup automatic refresh
      if (session) {
        setupTokenRefresh(session);
      }
      
      setLoading(false);
    };

    initSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session) {
        setupTokenRefresh(session);
      } else {
        // Clear refresh timer on sign out
        if (refreshTimerRef.current) {
          clearTimeout(refreshTimerRef.current);
          refreshTimerRef.current = null;
        }
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [setupTokenRefresh]);

  // Update signOut to clear timer
  const signOut = async () => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  // ... rest of existing functions remain the same
}
```

## 4. Enhance CSS with Scrollbar Hiding

### Update `src/index.css`

Add scrollbar hiding and base styles at the end:

```css
@import "tailwindcss";

/* ... existing theme variables ... */

/* ... existing body styles ... */

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

html::-webkit-scrollbar,
body::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

/* Better text wrapping */
:where(p, span, li, h1, h2, h3, h4, h5, h6, a, button, label, td, th) {
  overflow-wrap: anywhere;
  word-break: break-word;
}

pre,
code {
  overflow-x: auto;
  white-space: pre;
}

/* ... existing animations ... */
```

## 5. Create `.env.example` File

### Create `.env.example` in project root

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Optional: Service Role Key (for server-side operations only)
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Monday.com API Key (also stored as Supabase secret)
VITE_MONDAY_API_KEY=your_monday_api_key_here

# OpenAI API Key (for AI form filling)
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Google Maps API Key (for address autocomplete)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key_here
```

## 6. Optional: Add API Type Definitions

### Create or update `src/types/api.ts`

If you want to add type definitions for API responses:

```typescript
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

## Testing Checklist

After implementing these changes:

- [ ] Verify `cn()` function works in components
- [ ] Test Supabase client warnings in development
- [ ] Verify token refresh works (check network tab after 55 minutes)
- [ ] Test scrollbar hiding doesn't break scrolling
- [ ] Verify theme switching still works
- [ ] Test sign out clears refresh timer
- [ ] Check that all existing functionality still works

## Implementation Order

1. **Add dependencies** (`clsx`, `tailwind-merge`) - No breaking changes
2. **Add `cn()` utility** - Can be used incrementally
3. **Enhance Supabase client** - Better DX, no breaking changes
4. **Enhance CSS** - Visual improvements, test scrolling
5. **Add token refresh** - Security/UX improvement, test thoroughly
6. **Create `.env.example`** - Documentation

## Notes

- All changes are **additive** - no breaking changes
- Can be implemented **incrementally**
- Test each change before moving to the next
- Token refresh is the most important security/UX improvement
- `cn()` utility will make future development easier

