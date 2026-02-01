import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your_supabase_url')) {
  console.error('❌ Supabase Environment Variables Missing or Invalid!');
  console.error('Please check your .env.local file and populate NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY with your actual Supabase credentials.');
  // Preventing crash during build time if just checking types, but for runtime this is fatal.
  if (typeof window === 'undefined') {
     console.warn('Continuing with potentially broken Supabase client for build purposes...');
  }
}

/**
 * Client-side Supabase client (uses anon key with RLS)
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Server-side Supabase client (uses service role key, bypasses RLS)
 * Use this ONLY in API routes and server components where you need admin access
 */
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

/**
 * Get Supabase client for server components
 */
export function getSupabaseClient() {
  return supabase;
}

/**
 * Get Supabase admin client (server-side only)
 */
export function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not initialized - missing service role key');
  }
  return supabaseAdmin;
}
