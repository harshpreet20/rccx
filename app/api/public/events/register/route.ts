import { createClient } from '@supabase/supabase-js';
import { corsJson, OPTIONS as corsOptions } from '@/lib/cors';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const OPTIONS = corsOptions;

function generateTicketId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `RCC-${s.slice(0, 4)}-${s.slice(4)}`;
}

/** POST /api/public/events/register — register for an event (mirrors app/events/page.tsx's inline insert). */
export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return corsJson({ error: 'Not configured' }, { status: 503 });

  let body: { event_id?: string; member_name?: string; member_email?: string; phone?: string; skill_level?: string };
  try {
    body = await request.json();
  } catch {
    return corsJson({ error: 'Invalid JSON' }, { status: 400 });
  }

  const event_id = String(body.event_id || '').trim();
  const member_name = String(body.member_name || '').trim();
  const member_email = String(body.member_email || '').trim();
  const skill_level = String(body.skill_level || '').trim();
  if (!event_id || !member_name || !member_email || !skill_level) {
    return corsJson({ error: 'event_id, member_name, member_email and skill_level are required' }, { status: 400 });
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const ticket_id = generateTicketId();
  const { error } = await supabase.from('event_registrations').insert({
    event_id,
    member_name,
    member_email,
    phone: body.phone?.trim() || null,
    skill_level,
    ticket_id,
    registered_at: new Date().toISOString(),
  });

  if (error) return corsJson({ error: 'Registration failed' }, { status: 500 });
  return corsJson({ ok: true, ticket_id });
}
