import { createClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

// Server-side client (for server components)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

// Browser client (for client components - includes session)
export const browserSupabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
