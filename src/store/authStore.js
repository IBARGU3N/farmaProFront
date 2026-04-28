import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      permissions: [],
      isAuthenticated: false,
      setUser: (user, permissions = []) => set({ user, permissions, isAuthenticated: true }),
      logout: () => set({ user: null, permissions: [], isAuthenticated: false }),
    }),
    { name: 'farmapro-auth' }
  )
);
