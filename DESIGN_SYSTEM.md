# FCC Design System Documentation
## For Contractor/Client App Development

This document provides complete design system specifications to ensure seamless visual and functional consistency between the FCC PRO (internal) app and the Contractor/Client app.

---

## Table of Contents
1. [Overview](#overview)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Component Patterns](#component-patterns)
6. [Theme Switching Implementation](#theme-switching-implementation)
7. [Icon System](#icon-system)
8. [Dependencies & Setup](#dependencies--setup)
9. [Code Examples](#code-examples)
10. [File Structure](#file-structure)

---

## Overview

### Design Philosophy
- **Dark Mode First**: Dark mode is the default theme
- **System Color Consistency**: Blue (#3366FF) is used consistently across both apps
- **CSS Variable Based**: All colors use CSS variables for seamless theme switching
- **Tailwind CSS**: Utility-first CSS framework for rapid development
- **React + TypeScript**: Type-safe component development

### Key Principles
1. All interactive elements use the system color (#3366FF) for consistency
2. White text on system color backgrounds for CTAs and selected states
3. Smooth transitions between light and dark modes
4. Consistent spacing and typography scales
5. Reusable component patterns

---

## Color System

### CSS Variables Setup

The color system uses CSS variables that automatically switch based on the `.light` class on the root element.

#### Base CSS (`src/index.css`)

```css
:root {
  --system-color: #3366FF;
  /* Dark mode colors (default) */
  --fcc-black: #000000;
  --fcc-dark: #1a1a1a;
  --fcc-divider: #2a2a2a;
  --fcc-white: #ffffff;
}

:root.light,
.light {
  /* Light mode colors */
  --fcc-black: #ffffff;
  --fcc-dark: #f5f5f5;
  --fcc-divider: #e5e5e5;
  --fcc-white: #000000;
}
```

### Color Palette

| Color Name | Dark Mode | Light Mode | Usage |
|------------|-----------|------------|-------|
| `fcc-black` | `#000000` | `#ffffff` | Primary background, main containers |
| `fcc-dark` | `#1a1a1a` | `#f5f5f5` | Secondary backgrounds, cards, panels |
| `fcc-divider` | `#2a2a2a` | `#e5e5e5` | Borders, dividers, subtle UI elements |
| `fcc-cyan` | `#3366FF` | `#3366FF` | **System color - same in both modes** |
| `fcc-blue` | `#0066ff` | `#0066ff` | Hover states, secondary accents |
| `fcc-white` | `#ffffff` | `#000000` | Primary text color |

### Tailwind Configuration

```javascript
// tailwind.config.js
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'fcc-black': 'var(--fcc-black)',
        'fcc-dark': 'var(--fcc-dark)',
        'fcc-divider': 'var(--fcc-divider)',
        'fcc-cyan': 'var(--system-color, #3366FF)',
        'fcc-blue': '#0066ff',
        'fcc-white': 'var(--fcc-white)',
      },
    },
  },
}
```

### Color Usage Guidelines

- **Backgrounds**: Use `bg-fcc-black` for main backgrounds, `bg-fcc-dark` for cards/panels
- **Text**: Use `text-fcc-white` for primary text, `text-fcc-white/70` for secondary text, `text-fcc-white/50` for placeholders
- **Borders**: Use `border-fcc-divider` for all borders
- **CTAs**: Use `bg-fcc-cyan text-fcc-white` for primary buttons
- **Hover States**: Use `hover:border-fcc-cyan` or `hover:text-fcc-cyan` for interactive elements
- **Selected States**: Use `bg-fcc-cyan text-fcc-white` for selected navigation items

---

## Typography

### Font Sizes

| Class | Size | Usage |
|-------|------|-------|
| `text-xs` | 0.75rem | Badges, labels, small text |
| `text-sm` | 0.875rem | Body text, form labels, secondary content |
| `text-base` | 1rem | Default body text |
| `text-lg` | 1.125rem | Subheadings, emphasized text |
| `text-xl` | 1.25rem | Section headings |
| `text-2xl` | 1.5rem | Page titles |
| `text-3xl` | 1.875rem | Large numbers, hero text |

### Font Weights

- `font-medium` - Standard text, labels
- `font-semibold` - Headings, emphasized text
- `font-bold` - Page titles, important numbers

### Text Colors

- Primary: `text-fcc-white`
- Secondary: `text-fcc-white/70`
- Placeholder: `text-fcc-white/50`
- System Color: `text-fcc-cyan`

---

## Spacing & Layout

### Spacing Scale

Use Tailwind's default spacing scale:
- `p-2`, `p-4`, `p-6` - Padding
- `gap-2`, `gap-3`, `gap-4` - Gaps between elements
- `space-y-2`, `space-y-4` - Vertical spacing

### Common Layout Patterns

#### Main Container
```tsx
<div className="flex h-screen bg-fcc-black">
  {/* Sidebar */}
  <div className="hidden md:block">
    <Sidebar />
  </div>
  {/* Main Content */}
  <div className="flex-1 flex flex-col md:ml-16">
    <main className="flex-1 overflow-auto p-4 md:p-6">
      {/* Page content */}
    </main>
  </div>
</div>
```

#### Card Container
```tsx
<div className="bg-fcc-dark border border-fcc-divider rounded-lg p-6">
  {/* Card content */}
</div>
```

#### Grid Layout
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Grid items */}
</div>
```

---

## Component Patterns

### Buttons

#### Primary CTA Button
```tsx
<button className="px-6 py-2 bg-fcc-cyan text-fcc-white font-semibold rounded hover:bg-fcc-cyan/90 transition-colors">
  Button Text
</button>
```

#### Secondary Button
```tsx
<button className="px-4 py-2 bg-fcc-black border border-fcc-divider text-fcc-white rounded hover:border-fcc-cyan transition-colors">
  Button Text
</button>
```

#### Icon Button
```tsx
<button className="text-fcc-white hover:text-fcc-cyan transition-colors">
  <Icon className="w-5 h-5" />
</button>
```

### Navigation Items

#### Active State
```tsx
<Link className="flex items-center py-2 rounded-lg bg-fcc-cyan text-fcc-white">
  <Icon className="w-5 h-5" />
  <span>Label</span>
</Link>
```

#### Inactive State
```tsx
<Link className="flex items-center py-2 rounded-lg text-fcc-white hover:bg-fcc-divider hover:text-fcc-cyan transition-colors">
  <Icon className="w-5 h-5" />
  <span>Label</span>
</Link>
```

### Cards

#### Summary Card
```tsx
<div className="bg-fcc-dark border border-fcc-divider rounded-lg p-6 cursor-pointer hover:border-fcc-cyan transition-colors">
  <h3 className="text-fcc-white text-sm font-medium mb-2">Title</h3>
  <div className="text-3xl font-bold text-fcc-cyan mb-4">42</div>
  {/* Content */}
</div>
```

### Form Elements

#### Input Field
```tsx
<input
  className="w-full bg-fcc-black border border-fcc-divider rounded p-2 text-fcc-white focus:border-fcc-cyan focus:outline-none"
  placeholder="Placeholder text"
/>
```

#### Select Dropdown
```tsx
<select className="w-full bg-fcc-black border border-fcc-divider rounded p-2 text-fcc-white focus:border-fcc-cyan focus:outline-none">
  {/* Options */}
</select>
```

### Tabs

#### Active Tab
```tsx
<button className="px-4 py-3 text-sm font-medium border-b-2 border-fcc-cyan text-fcc-cyan">
  Tab Label
</button>
```

#### Inactive Tab
```tsx
<button className="px-4 py-3 text-sm font-medium border-b-2 border-transparent text-fcc-white/70 hover:text-fcc-white">
  Tab Label
</button>
```

### Toggle Buttons

#### Selected State
```tsx
<button className="p-2 rounded bg-fcc-cyan text-fcc-white">
  <Icon className="w-5 h-5" />
</button>
```

#### Unselected State
```tsx
<button className="p-2 rounded text-fcc-white hover:bg-fcc-black">
  <Icon className="w-5 h-5" />
</button>
```

### Avatars

```tsx
<div className="w-8 h-8 bg-fcc-cyan rounded-full flex items-center justify-center text-fcc-white font-semibold">
  JS
</div>
```

---

## Theme Switching Implementation

### Settings Context

Create a `SettingsContext` that manages theme state:

```typescript
// src/context/SettingsContext.tsx
interface Settings {
  theme: 'dark' | 'light' | 'auto';
  // ... other settings
}

const defaultSettings: Settings = {
  theme: 'dark', // Dark mode is default
  // ...
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    const stored = localStorage.getItem('app-settings');
    let initialSettings = defaultSettings;
    if (stored) {
      try {
        initialSettings = { ...defaultSettings, ...JSON.parse(stored) };
      } catch {
        initialSettings = defaultSettings;
      }
    }
    
    // Apply theme immediately on initialization
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    if (initialSettings.theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (!prefersDark) {
        root.classList.add('light');
      }
    } else if (initialSettings.theme === 'light') {
      root.classList.add('light');
    }
    
    return initialSettings;
  });

  useEffect(() => {
    localStorage.setItem('app-settings', JSON.stringify(settings));
    
    // Update theme
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    if (settings.theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (!prefersDark) {
        root.classList.add('light');
      }
      
      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        root.classList.remove('dark', 'light');
        if (!e.matches) {
          root.classList.add('light');
        }
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      if (settings.theme === 'light') {
        root.classList.add('light');
      }
    }
  }, [settings]);

  const updateTheme = (theme: 'dark' | 'light' | 'auto') => {
    setSettings(prev => ({ ...prev, theme }));
  };

  // ... rest of context
}
```

### Theme Toggle Component

```tsx
// src/components/ui/ThemeToggle.tsx
import { Sun, Moon } from 'lucide-react';
import { useSettings } from '../../context/useSettings';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { settings, updateTheme } = useSettings();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const checkTheme = () => {
      const root = document.documentElement;
      setIsDark(!root.classList.contains('light'));
    };
    
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, [settings.theme]);

  const handleToggle = () => {
    if (settings.theme === 'dark') {
      updateTheme('light');
    } else if (settings.theme === 'light') {
      updateTheme('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      updateTheme(prefersDark ? 'light' : 'dark');
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="text-fcc-white hover:text-fcc-cyan transition-colors"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
```

### Logo Component (Theme-Aware)

```tsx
// src/components/layout/Logo.tsx
import { useSettings } from '../../context/useSettings';
import { useEffect, useState } from 'react';

export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  const { settings } = useSettings();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const checkTheme = () => {
      const root = document.documentElement;
      setIsDark(!root.classList.contains('light'));
    };
    
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, [settings.theme]);

  const logoSrc = isDark 
    ? '/fccgradientlogowhite.png'  // Dark mode logo
    : '/fccgradientlogodark.png';  // Light mode logo
  
  return (
    <img
      src={logoSrc}
      alt="Freedom Code Compliance"
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
}
```

---

## Icon System

### Library
- **Lucide React**: Primary icon library
- **Version**: `^0.553.0`

### Usage Pattern
```tsx
import { IconName } from 'lucide-react';

<IconName className="w-5 h-5 text-fcc-white" />
```

### Common Icons
- Navigation: `LayoutDashboard`, `FileText`, `Camera`, `FileCheck`
- Actions: `Bell`, `Sun`, `Moon`, `ChevronRight`, `X`, `Check`
- Status: `Circle` (for indicators)

### Icon Sizes
- Small: `w-4 h-4` (16px)
- Medium: `w-5 h-5` (20px) - **Most common**
- Large: `w-8 h-8` (32px)

### Icon Colors
- Default: `text-fcc-white`
- Hover: `hover:text-fcc-cyan`
- Secondary: `text-fcc-white/70`
- System: `text-fcc-cyan`

---

## Dependencies & Setup

### Required Dependencies

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.80.0",
    "date-fns": "^4.1.0",
    "date-fns-tz": "^3.2.0",
    "lucide-react": "^0.553.0",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-router-dom": "^7.9.5"
  },
  "devDependencies": {
    "@types/react": "^19.1.16",
    "@types/react-dom": "^19.1.9",
    "@vitejs/plugin-react": "^5.0.4",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.18",
    "typescript": "~5.9.3",
    "vite": "^7.1.7"
  }
}
```

### Tailwind Configuration

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'fcc-black': 'var(--fcc-black)',
        'fcc-dark': 'var(--fcc-dark)',
        'fcc-divider': 'var(--fcc-divider)',
        'fcc-cyan': 'var(--system-color, #3366FF)',
        'fcc-blue': '#0066ff',
        'fcc-white': 'var(--fcc-white)',
      },
    },
  },
  plugins: [],
}
```

### PostCSS Configuration

```javascript
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

## Code Examples

### Complete Component Example

```tsx
// Example: SummaryCard component
import { useNavigate } from 'react-router-dom';

interface SummaryCardProps {
  title: string;
  total: number;
  items: Array<{ id: string; label: string }>;
  onClick?: () => void;
  filterPath?: string;
}

export default function SummaryCard({ 
  title, 
  total, 
  items, 
  onClick, 
  filterPath 
}: SummaryCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (filterPath) {
      navigate(filterPath);
    }
  };

  return (
    <div
      className="bg-fcc-dark border border-fcc-divider rounded-lg p-6 cursor-pointer hover:border-fcc-cyan transition-colors"
      onClick={handleClick}
    >
      <h3 className="text-fcc-white text-sm font-medium mb-2">{title}</h3>
      <div className="text-3xl font-bold text-fcc-cyan mb-4">{total}</div>
      <ul className="space-y-2">
        {items.slice(0, 5).map((item) => (
          <li key={item.id} className="text-sm text-fcc-white/70 truncate">
            {item.label}
          </li>
        ))}
        {items.length > 5 && (
          <li className="text-sm text-fcc-white">+{items.length - 5} more</li>
        )}
      </ul>
    </div>
  );
}
```

### Form Example

```tsx
// Example: Form with inputs
<form className="space-y-4">
  <div>
    <label className="block text-sm text-fcc-white/70 mb-2">Label</label>
    <input
      type="text"
      className="w-full bg-fcc-black border border-fcc-divider rounded p-2 text-fcc-white focus:border-fcc-cyan focus:outline-none"
      placeholder="Enter text..."
    />
  </div>
  <button
    type="submit"
    className="px-6 py-2 bg-fcc-cyan text-fcc-white font-semibold rounded hover:bg-fcc-cyan/90 transition-colors"
  >
    Submit
  </button>
</form>
```

---

## File Structure

### Recommended Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   └── Logo.tsx
│   ├── ui/
│   │   ├── ThemeToggle.tsx
│   │   ├── Breadcrumbs.tsx
│   │   └── StyledSelect.tsx
│   └── [feature]/
│       └── [Component].tsx
├── context/
│   └── SettingsContext.tsx
├── pages/
│   └── [Page].tsx
├── styles/
│   └── theme.ts
├── lib/
│   └── [utilities].ts
├── types/
│   └── [types].ts
├── index.css
└── main.tsx
```

### Key Files

1. **`src/index.css`**: CSS variables and base styles
2. **`tailwind.config.js`**: Tailwind configuration with color variables
3. **`src/context/SettingsContext.tsx`**: Theme management
4. **`src/styles/theme.ts`**: Theme color definitions (TypeScript)

---

## Important Notes

### Theme Switching Behavior

1. **Dark mode is default**: No class needed on root element
2. **Light mode**: Add `.light` class to `<html>` element
3. **Auto mode**: Respects system preference, adds `.light` only if system prefers light
4. **CSS Variables**: All colors automatically switch when `.light` class is toggled

### Logo Files

Place logo files in the `public` folder:
- Dark mode: `/fccgradientlogowhite.png` (white/gradient logo for dark backgrounds)
- Light mode: `/fccgradientlogodark.png` (darker logo for light backgrounds)

### Z-Index Guidelines

- Sidebar: `z-[1000]`
- Notification Panel: `z-50`
- Leaflet Controls: `z-50` (below sidebar)
- Modals/Dropdowns: `z-50` or higher as needed

### Transitions

Always use `transition-colors` for color changes:
```tsx
className="hover:border-fcc-cyan transition-colors"
```

### Accessibility

- Use semantic HTML elements
- Include `title` attributes on icon-only buttons
- Ensure sufficient color contrast (system color on white text meets WCAG AA)
- Use `focus:border-fcc-cyan` for keyboard navigation

---

## Quick Reference

### Most Common Patterns

```tsx
// Container
<div className="bg-fcc-dark border border-fcc-divider rounded-lg p-6">

// Text
<h1 className="text-2xl font-bold text-fcc-white">
<p className="text-sm text-fcc-white/70">

// Button
<button className="px-6 py-2 bg-fcc-cyan text-fcc-white font-semibold rounded hover:bg-fcc-cyan/90 transition-colors">

// Input
<input className="w-full bg-fcc-black border border-fcc-divider rounded p-2 text-fcc-white focus:border-fcc-cyan focus:outline-none">

// Link
<Link className="text-fcc-white/70 hover:text-fcc-cyan transition-colors">
```

---

## Design Guide Reference

When building the contractor/client app, refer to the provided design guide for:
- Brand colors and logo usage
- Component spacing and sizing
- Typography hierarchy
- Visual examples of components in both light and dark modes

The design guide should be used in conjunction with this technical documentation to ensure both visual and functional consistency.

---

## Support

For questions or clarifications about the design system, refer to:
1. This documentation
2. The design guide provided
3. The source code of the FCC PRO app for reference implementations

**Remember**: Consistency is key. When in doubt, match the patterns and colors used in the FCC PRO app to ensure a seamless user experience across both applications.

