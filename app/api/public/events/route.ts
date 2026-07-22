import { createClient } from '@supabase/supabase-js';
import { corsJson, OPTIONS as corsOptions } from '@/lib/cors';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const OPTIONS = corsOptions;

/** GET /api/public/events — public event listing, same data app/events/page.tsx used to read directly. */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return corsJson({ events: [] });

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await supabase.from('events').select('*').order('event_date', { ascending: true });
  if (error) return corsJson({ error: error.message }, { status: 500 });
  return corsJson({ events: data ?? [] });
}
