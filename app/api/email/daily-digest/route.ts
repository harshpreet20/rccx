import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail, getActiveSubscribers, verifyCronSecret, getEmailSettings } from '@/lib/email';

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req.headers.get('authorization'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  // Fetch events happening today and tomorrow
  const today = new Date();
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);

  const { data: events } = await admin
    .from('events')
    .select('title, event_date, venue, event_type, current_participants, max_participants, entry_fee')
    .gte('event_date', today.toISOString().split('T')[0])
    .lt('event_date', dayAfterTomorrow.toISOString().split('T')[0])
    .in('status', ['upcoming', 'ongoing'])
    .order('event_date', { ascending: true });

  if (!events || events.length === 0) {
    return NextResponse.json({ skipped: true, reason: 'No events today or tomorrow' });
  }

  const dateStr = today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  const eventLines = events.map(e => {
    const d = new Date(e.event_date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    const slots = e.max_participants ? ` · ${e.max_participants - (e.current_participants || 0)} spots left` : '';
    const fee = e.entry_fee ? ` · ₹${e.entry_fee}` : ' · Free';
    return `🏸  ${e.title}\n    📅 ${d}  |  📍 ${e.venue || 'Venue TBA'}${fee}${slots}`;
  }).join('\n\n');

  const subject = `🌅 RCC Today — ${dateStr}`;
  const body = `Good morning, RCC Family! ☀️

Here's your daily update for ${dateStr}:

━━━━━━━━━━━━━━━━━━━━━━━━━━
TODAY & TOMORROW AT RCC
━━━━━━━━━━━━━━━━━━━━━━━━━━

${eventLines}

Register or view full details at:
racquetsclubcommunity.com/events

See you on court!
— The RCC Team`;

  const [subscribers, settings] = await Promise.all([getActiveSubscribers(), getEmailSettings()]);
  if (subscribers.length === 0) return NextResponse.json({ skipped: true, reason: 'No active subscribers' });

  const result = await sendEmail(subscribers, subject, body, settings);
  return NextResponse.json({ ...result, events: events.length, subscribers: subscribers.length });
}
