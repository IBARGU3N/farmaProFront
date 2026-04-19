import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { APP_CONFIG } from '../config/constants';
import { preferenceService } from '../services/preferenceService';

export const syncThemeToCSS = (state) => {
  const root = document.documentElement;
  root.style.setProperty('--color-primary', state.primaryColor);
  root.style.setProperty('--color-secondary', state.secondaryColor);
  root.style.setProperty('--color-accent', state.accentColor);
  root.style.setProperty('--color-surface', state.backgroundColor);
  
  if (state.theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const bootstrapTheme = () => {
  try {
    const stored = localStorage.getItem(APP_CONFIG.THEME_STORAGE_KEY);
    if (stored) {
      const { state } = JSON.parse(stored);
      syncThemeToCSS(state);
    }
  } catch (e) {
    console.error('Theme bootstrap failed:', e);
  }
};

const getInitialTheme = () => {
  try {
    const savedTheme = localStorage.getItem(APP_CONFIG.THEME_STORAGE_KEY);
    if (savedTheme) {
      const { state } = JSON.parse(savedTheme);
      return state.theme;
    }
  } catch (e) {}
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const useUIStore = create(
  persist(
    (set, get) => ({
      // Theme State
      theme: getInitialTheme(),
      primaryColor: '#006875',
      secondaryColor: '#9BF3F0',
      accentColor: '#ADFC92',
      backgroundColor: '#f7f9fb',

       fetchPreferences: async () => {
         try {
           const prefs = await preferenceService.getPreferences();
           if (!prefs) return;

           // Solo actualizar si los valores del servidor son diferentes a los locales
           // para evitar el parpadeo y la sobrescritura innecesaria
           const hasChanges = 
             prefs.theme !== get().theme || 
             prefs.primary_color !== get().primaryColor || 
             prefs.secondary_color !== get().secondaryColor || 
             prefs.accent_color !== get().accentColor || 
             prefs.background_color !== get().backgroundColor;

           if (hasChanges) {
             set({
               theme: prefs.theme,
               primaryColor: prefs.primary_color,
               secondaryColor: prefs.secondary_color,
               accentColor: prefs.accent_color,
               backgroundColor: prefs.background_color,
             });
             syncThemeToCSS(get());
           }
         } catch (error) {
           console.error('Failed to fetch preferences:', error);
         }
       },


        toggleTheme: async () => {
          const state = get();
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          
          set({ theme: newTheme });
          syncThemeToCSS({ ...state, theme: newTheme });
          
          try {
            await preferenceService.updatePreferences({
              theme: newTheme,
              primary_color: state.primaryColor,
              secondary_color: state.secondaryColor,
              accent_color: state.accentColor,
              background_color: state.backgroundColor,
            });
          } catch (e) {}
        },

      
      setPrimaryColor: async (color) => {
        set({ primaryColor: color });
        syncThemeToCSS(get());
        try {
          await preferenceService.updatePreferences({
            theme: get().theme,
            primary_color: color,
            secondary_color: get().secondaryColor,
            accent_color: get().accentColor,
            background_color: get().backgroundColor,
          });
        } catch (e) {}
      },
      setSecondaryColor: async (color) => {
        set({ secondaryColor: color });
        syncThemeToCSS(get());
        try {
          await preferenceService.updatePreferences({
            theme: get().theme,
            primary_color: get().primaryColor,
            secondary_color: color,
            accent_color: get().accentColor,
            background_color: get().backgroundColor,
          });
        } catch (e) {}
      },
      setAccentColor: async (color) => {
        set({ accentColor: color });
        syncThemeToCSS(get());
        try {
          await preferenceService.updatePreferences({
            theme: get().theme,
            primary_color: get().primaryColor,
            secondary_color: get().secondaryColor,
            accent_color: color,
            background_color: get().backgroundColor,
          });
        } catch (e) {}
      },
      setBackgroundColor: async (color) => {
        set({ backgroundColor: color });
        syncThemeToCSS(get());
        try {
          await preferenceService.updatePreferences({
            theme: get().theme,
            primary_color: get().primaryColor,
            secondary_color: get().secondaryColor,
            accent_color: get().accentColor,
            background_color: color,
          });
        } catch (e) {}
      },

      applyPreset: async (preset) => {
        set({
          primaryColor: preset.primary,
          secondaryColor: preset.secondary,
          accentColor: preset.accent,
          backgroundColor: preset.background,
        });
        syncThemeToCSS(get());
        try {
          await preferenceService.updatePreferences({
            theme: get().theme,
            primary_color: preset.primary,
            secondary_color: preset.secondary,
            accent_color: preset.accent,
            background_color: preset.background,
          });
        } catch (e) {}
      },

      // Sidebar State
      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
 
      // Mobile Menu State
      isMobileMenuOpen: false,
      toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),

      // Toast Notifications State
      toast: null,
      showToast: (message, type = 'error') => set({ toast: { message, type } }),
      hideToast: () => set({ toast: null }),
    }),
    { 
      name: APP_CONFIG.THEME_STORAGE_KEY,
      partialize: (state) => ({ 
        theme: state.theme, 
        primaryColor: state.primaryColor,
        secondaryColor: state.secondaryColor,
        accentColor: state.accentColor,
        backgroundColor: state.backgroundColor
      }),
    }
  )
);

export default useUIStore;
