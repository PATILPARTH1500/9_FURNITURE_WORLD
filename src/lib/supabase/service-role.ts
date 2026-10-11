import { createClient } from '@supabase/supabase-js';

// Server-only administrative client. NEVER import or run on the client side.
export const getServiceSupabaseClient = () => {
  if (typeof window !== 'undefined') {
    throw new Error('FATAL SECURITY ERROR: Supabase service role client cannot be initialized in browser environment.');
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase service role credentials not configured in environment variables.');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

