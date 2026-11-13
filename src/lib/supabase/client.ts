import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

export const getSupabaseConfig = () => {
  const url =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
    'https://plixtrmiidhxiybgujdb.supabase.co';
  const anonKey =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
    '';
  return { url, anonKey };
};

export const isSupabaseConfigured = (): boolean => {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey && !url.includes('your-project') && !url.includes('placeholder'));
};

let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (clientInstance) {
    return clientInstance;
  }

  const { url, anonKey } = getSupabaseConfig();

  clientInstance = createSupabaseClient(url, anonKey || 'placeholder-anon-key', {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storageKey: 'furniture_world_auth_token',
    },
  });

  return clientInstance;
};

// Singleton instance for direct import
export const supabase = getSupabaseClient();

// Backwards compatibility export
export const createClient = () => getSupabaseClient();
