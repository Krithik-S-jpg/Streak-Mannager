import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client - detects demo mode automatically
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
  console.log('📡 Supabase configured - initializing connection');
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.log('🔴 Demo Mode Active - No Supabase credentials found. Using localStorage only.');
}

// Helper to get the current user (handles null supabase gracefully)
export const getCurrentUser = async () => {
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

// Helper to get session (handles null supabase gracefully)
export const getSession = async () => {
  if (!supabase) return null;
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
};

export { supabase };
