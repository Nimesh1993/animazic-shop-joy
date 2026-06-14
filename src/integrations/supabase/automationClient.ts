// Automation-focused Supabase client (no persistent session storage)
// Use this for background tasks, edge functions, or server-like operations
// where browser auth persistence is not desired.
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://elilgmmbkhgwxtwqbknl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_zwxWYXwu6RJrxtzQxAnHXA_XuuU44dO";

export const automationSupabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: undefined,
    persistSession: false,
    autoRefreshToken: false,
  },
});
