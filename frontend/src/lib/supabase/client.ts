/**
 * Supabase Client
 * 
 * Creates and exports a Supabase client instance for use throughout the application.
 * 
 * Usage:
 * ```ts
 * import { supabase } from '@/lib/supabase/client';
 * 
 * // Use the client to interact with Supabase
 * const { data, error } = await supabase.from('table').select('*');
 * ```
 * 
 * Implementation notes:
 * - Uses environment variables for Supabase URL and anon key
 * - Creates a typed client using the Database type
 * - Should be imported and used wherever Supabase access is needed
 */

import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create and export the Supabase client
// Add your implementation here
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);