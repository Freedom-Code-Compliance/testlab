import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate environment variables in development
if (import.meta.env.DEV) {
  if (!supabaseUrl || supabaseUrl === '') {
    console.warn(
      '⚠️ VITE_SUPABASE_URL is not set. Please create a .env file with your Supabase configuration.\n' +
      'See .env.example for reference.'
    );
  }
  if (!supabaseAnonKey || supabaseAnonKey === '') {
    console.warn(
      '⚠️ VITE_SUPABASE_ANON_KEY is not set. Please create a .env file with your Supabase configuration.\n' +
      'See .env.example for reference.'
    );
  }
}

// In production, throw error if variables are missing (they should be embedded in build)
if (import.meta.env.PROD && (!supabaseUrl || !supabaseAnonKey)) {
  throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
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

// Edge function helpers - use supabase.functions.invoke() which handles auth automatically
export async function callInitUpload(payload: {
  kind: 'PLAN_SET_FILE' | 'PROJECT_FILE' | 'INSPECTION_FILE';
  filename: string;
  plan_set_id?: string;
  file_type_code?: string;
  project_id?: string;
  // TestLab additions
  run_id?: string;
  scenario_id?: string;
  // Other file types (from master)
  inspection_session_id?: string;
  media_type_code?: string;
}) {
  const { data, error } = await supabase.functions.invoke('init-upload', {
    body: payload,
  });

  // Log full response for debugging
  if (error || (data && data.error)) {
    console.error('init-upload error:', { error, data, payload });
  }

  // Check for error in response data first (edge function returns error in response body)
  if (data && data.error) {
    const errorMessage = typeof data.error === 'string' 
      ? data.error 
      : data.error.message || 'init-upload failed';
    throw new Error(errorMessage);
  }

  // Check for Supabase client error
  if (error) {
    // If error object has message, use it; otherwise try to extract from data
    const errorMessage = error.message || (typeof error === 'string' ? error : 'init-upload failed');
    throw new Error(errorMessage);
  }

  return data;
}

export async function callConfirmUpload(fileId: string, success: boolean, errorMessage?: string) {
  const { data, error } = await supabase.functions.invoke('confirm-upload', {
    body: {
      file_id: fileId,
      success: success,
      error_message: errorMessage,
    },
  });

  if (error) {
    throw new Error(error.message || 'confirm-upload failed');
  }

  // Handle response that might have error in data
  if (data && data.error) {
    throw new Error(data.error);
  }

  return data;
}

// Legacy function name for backward compatibility - maps to confirm-upload
export async function callCompleteUpload(fileId: string) {
  return callConfirmUpload(fileId, true);
}

