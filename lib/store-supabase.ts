import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Service-role client for the RCC Store's Supabase project (rccecom /
 * rccstore) -- a DIFFERENT project than rccadmin's own (NEXT_PUBLIC_SUPABASE_URL).
 * This is what lets rccadmin manage rccecom's products/orders/discounts
 * without rccecom ever exposing more than its public anon key.
 */
let _client: SupabaseClient | null = null;

export function getStoreSupabase(): SupabaseClient | null {
  if (_client) return _client;
  const url = process.env.STORE_SUPABASE_URL;
  const key = process.env.STORE_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  _client = createClient(url, key, { auth: { persistSession: false } });
  return _client;
}
