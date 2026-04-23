import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('CRITICAL ERROR: Supabase environment variables are missing.');
  // Export a dummy client to prevent the app from crashing completely
  export const supabase = {
    auth: { signInWithPassword: () => Promise.reject('Missing API Key'), signUp: () => Promise.reject('Missing API Key'), signOut: () => Promise.reject('Missing API Key'), getUser: () => Promise.reject('Missing API Key') },
    from: () => ({ select: () => ({ data: null, error: 'Missing API Key' }) })
  };
} else {
  export const supabase = createClient(supabaseUrl, supabaseAnonKey);
}
