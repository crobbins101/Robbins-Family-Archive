import { createClient } from '@supabase/supabase-js';

// Grab your environment variables securely from .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Fail gracefully with an explicit message if your environment variables are missing
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment keys. Please check your .env.local configuration file.'
  );
}

// Initialize the client with the exact lowercase variable name required by AudioUploader
export const supabase = createClient(supabaseUrl, supabaseAnonKey);