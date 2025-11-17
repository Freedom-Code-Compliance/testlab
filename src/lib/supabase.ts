import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wljgdyxeixbjruezrptj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsamdkeXhlaXhianJ1ZXpycHRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4Mjk4MjksImV4cCI6MjA3NzQwNTgyOX0.zenVRVx5sVN_znCEur-3z4kASQQXWxFLI7Gos9u6v4k';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
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

