import { useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';

export function useThemeApplier() {
  const { primaryColor, secondaryColor, accentColor, backgroundColor } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-473198', primaryColor);
    root.style.setProperty('--color-9bf3f0', secondaryColor);
    root.style.setProperty('--color-adfc92', accentColor);
    root.style.setProperty('--color-daffed', backgroundColor);

    // Compute a darker shade for --color-4a0d67 (primary-dark)
    const hex = primaryColor.replace('#', '');
    const r = Math.max(0, parseInt(hex.substring(0, 2), 16) - 30);
    const g = Math.max(0, parseInt(hex.substring(2, 4), 16) - 30);
    const b = Math.max(0, parseInt(hex.substring(4, 6), 16) - 30);
    root.style.setProperty('--color-4a0d67', `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`);
  }, [primaryColor, secondaryColor, accentColor, backgroundColor]);
}
