import { createClient } from '@supabase/supabase-js';
import { corsJson, OPTIONS as corsOptions } from '@/lib/cors';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const OPTIONS = corsOptions;

/** POST /api/public/contact — mirrors app/contact/page.tsx's inline insert into `contact_submissions`. */
export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return corsJson({ error: 'Not configured' }, { status: 503 });

  let body: { full_name?: string; email?: string; phone?: string; subject?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return corsJson({ error: 'Invalid JSON' }, { status: 400 });
  }

  const full_name = String(body.full_name || '').trim();
  const email = String(body.email || '').trim();
  const message = String(body.message || '').trim();
  if (!full_name || !email || !message) {
    return corsJson({ error: 'full_name, email and message are required' }, { status: 400 });
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await supabase.from('contact_submissions').insert({
    full_name,
    email,
    phone: body.phone?.trim() || null,
    subject: body.subject?.trim() || null,
    message,
  });

  if (error) return corsJson({ error: 'Submission failed' }, { status: 500 });

  // Fire-and-forget admin notification, same as the inline page today.
  fetch(`${new URL(request.url).origin}/api/email/notify-contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ full_name, email, phone: body.phone?.trim() || null, subject: body.subject?.trim() || null, message }),
  }).catch(() => {});

  return corsJson({ ok: true });
}
