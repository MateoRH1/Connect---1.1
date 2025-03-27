import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 2
    }
  },
  db: {
    schema: 'public'
  }
});

export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('mercadolibre_accounts')
      .select('*')
      .limit(1);
      
    if (error) {
      return { 
        status: 'error',
        error: error.message 
      };
    }

    const { count } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    return {
      status: 'connected',
      userCount: count || 0
    };
  } catch (err) {
    return { 
      status: 'error',
      error: err instanceof Error ? err.message : 'Unknown error'
    };
  }
};
