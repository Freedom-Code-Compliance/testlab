import { useSettings } from '../../context/SettingsContext';
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



