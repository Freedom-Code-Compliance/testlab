import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// RPC helper functions
export async function createTestRun(scenarioId: string, runBy: string | null = null) {
  const { data, error } = await supabase.rpc('testlab_create_run', {
    p_scenario_id: scenarioId,
    p_run_by: runBy,
  });
  
  if (error) throw error;
  return data;
}

export async function callEdgeFunction(functionName: string, body: any) {
  const { data, error } = await supabase.functions.invoke(functionName, {
    body,
  });
  
  if (error) {
    console.error('Edge function error:', error);
    throw new Error(error.message || `Failed to call ${functionName}`);
  }
  
  // Handle response that might have error in data
  if (data && data.error) {
    throw new Error(data.error);
  }
  
  return data;
}

// Auth helper functions
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

