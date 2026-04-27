import { useEffect } from 'react';
import { authService } from '../services/auth/authService';
import { authStorage } from '../lib/authStorage';
import { useAuthStore } from '../store/authStore';

export function useAuthInitializer() {
  const { setUser, logout } = useAuthStore();

  useEffect(() => {
    const token = authStorage.getAccessToken();
    if (!token) return;

    let cancelled = false;

    authService.checkAuth().then((response) => {
      if (!cancelled) {
        const body = response?.data || response;
        const userData = body?.data || body;
        if (userData) {
          setUser({
            id: userData.id,
            name: userData.name || userData.nombre_completo || 'Usuario',
            email: userData.email,
            rol: userData.rol || 'usuario',
          });
        }
      }
    }).catch(() => {
      if (!cancelled) {
        authStorage.clearTokens();
        logout();
      }
    });

    return () => { cancelled = true; };
  }, [setUser, logout]);
}
