import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set) => ({
      isDark: false,
      primaryColor: '#473198',
      secondaryColor: '#9BF3F0',
      accentColor: '#ADFC92',
      backgroundColor: '#DAFFED',

      toggleDark: () => set((state) => ({ isDark: !state.isDark })),
      setPrimaryColor: (color) => set({ primaryColor: color }),
      setSecondaryColor: (color) => set({ secondaryColor: color }),
      setAccentColor: (color) => set({ accentColor: color }),
      setBackgroundColor: (color) => set({ backgroundColor: color }),
    }),
    { name: 'farmapro-theme' }
  )
);
