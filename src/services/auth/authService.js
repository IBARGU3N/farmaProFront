import { supabase } from '../../lib/supabase';

export const authService = {
  // Login user
  login: async (credentials) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    if (error) throw error;
    return data;
  },
  
  // Register new user
  register: async (userData) => {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          full_name: userData.nombre_completo,
          rol: userData.rol || 'usuario',
        },
      },
    });
    if (error) throw error;
    return data;
  },
  
  // Logout user
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  
  // Check if user is authenticated
  checkAuth: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },
};
