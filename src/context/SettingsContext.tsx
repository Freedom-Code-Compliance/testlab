import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Settings {
  theme: 'dark' | 'light' | 'auto';
}

const defaultSettings: Settings = {
  theme: 'dark', // Dark mode is default
};

interface SettingsContextType {
  settings: Settings;
  updateTheme: (theme: 'dark' | 'light' | 'auto') => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

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

  return (
    <SettingsContext.Provider value={{ settings, updateTheme }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}



