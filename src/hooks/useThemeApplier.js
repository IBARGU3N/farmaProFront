import { useEffect } from 'react';
import useUIStore from '../store/uiStore';

export function useThemeApplier() {
  const { theme, primaryColor, secondaryColor, accentColor, backgroundColor } = useUIStore();

  useEffect(() => {
    const root = document.documentElement;
    
    // Sync dark class with store state
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Set semantic CSS variables based on current custom colors
    root.style.setProperty('--color-primary', primaryColor);
    root.style.setProperty('--color-secondary', secondaryColor);
    root.style.setProperty('--color-accent', accentColor);
    root.style.setProperty('--color-surface', backgroundColor);

    // Compute a darker shade for on-primary or variants if needed
    const hex = primaryColor.replace('#', '');
    const r = Math.max(0, parseInt(hex.substring(0, 2), 16) - 30);
    const g = Math.max(0, parseInt(hex.substring(2, 4), 16) - 30);
    const b = Math.max(0, parseInt(hex.substring(4, 6), 16) - 30);
    root.style.setProperty('--color-primary-dark', `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`);
  }, [theme, primaryColor, secondaryColor, accentColor, backgroundColor]);
}
