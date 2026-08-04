import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@luxury-travel/database';

function getUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
}

function getAnonKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    ''
  );
}

export function createClient() {
  const url = getUrl();
  const key = getAnonKey();

  if (!url || !key) {
    return null;
  }

  return createBrowserClient<Database>(url, key);
}
