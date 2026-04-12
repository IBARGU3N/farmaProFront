export const authStorage = {
  saveTokens: (accessToken, refreshToken) => {
    const isProduction = import.meta.env.MODE === 'production';
    const secure = isProduction ? 'secure;' : '';
    const sameSite = isProduction ? 'Strict' : 'Lax';
    const maxAge = 60 * 60 * 24;
    const refreshMaxAge = maxAge + (7 * 24 * 60 * 60);
    
    document.cookie = `access_token=${accessToken};max-age=${maxAge};path=/;SameSite=${sameSite};${secure}`;
    document.cookie = `refresh_token=${refreshToken};max-age=${refreshMaxAge};path=/;SameSite=${sameSite};${secure}`;
  },
  
  clearTokens: () => {
    const isProduction = import.meta.env.MODE === 'production';
    document.cookie = 'access_token=;max-age=0;path=/;SameSite=Lax;';
    document.cookie = 'refresh_token=;max-age=0;path=/;SameSite=Lax;';
    if (isProduction) {
      document.cookie = 'access_token=;max-age=0;path=/;secure;SameSite=Strict;';
      document.cookie = 'refresh_token=;max-age=0;path=/;secure;SameSite=Strict;';
    }
  },
  
  getAccessToken: () => {
    const matches = document.cookie.match(/(?:^|;\s*)access_token=([^;]*)/);
    return matches ? decodeURIComponent(matches[1]) : null;
  },
  
  getRefreshToken: () => {
    const matches = document.cookie.match(/(?:^|;\s*)refresh_token=([^;]*)/);
    return matches ? decodeURIComponent(matches[1]) : null;
  },
};
