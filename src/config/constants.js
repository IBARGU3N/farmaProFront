export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const APP_CONFIG = {
  NAME: 'FarmaPro',
  VERSION: '1.0.0',
  THEME_STORAGE_KEY: 'farmapro_theme',
  AUTH_TOKEN_KEY: 'access_token',
};

// Application Modules
export const MODULES = {
  CORE: 'core',
  INVENTORY: 'inventory',
  FINANCE: 'finance',
  QUALITY: 'quality',
};
