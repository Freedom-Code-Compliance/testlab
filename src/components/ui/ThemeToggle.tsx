import { Sun, Moon } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
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

