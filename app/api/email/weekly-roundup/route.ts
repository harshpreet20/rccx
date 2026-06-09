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

  const now = new Date();
  const weekEnd = new Date(now);
  weekEnd.setDate(now.getDate() + 7);

  // Upcoming events this week
  const { data: events } = await admin
    .from('events')
    .select('title, event_date, venue, event_type, entry_fee, prize_pool, current_participants, max_participants')
    .gte('event_date', now.toISOString())
    .lte('event_date', weekEnd.toISOString())
    .in('status', ['upcoming', 'ongoing'])
    .order('event_date', { ascending: true })
    .limit(8);

  // Top 5 leaderboard
  const { data: leaders } = await admin
    .from('leaderboard')
    .select('player_name, elo_rating, wins, losses, skill_level')
    .order('elo_rating', { ascending: false })
    .limit(5);

  const weekLabel = `${now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – ${weekEnd.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`;

  const eventsSection = events && events.length > 0
    ? events.map((e, i) => {
        const d = new Date(e.event_date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
        const spots = e.max_participants ? ` · ${e.max_participants - (e.current_participants || 0)} spots left` : '';
        const prize = e.prize_pool ? ` · Prize: ${e.prize_pool}` : '';
        return `${i + 1}. ${e.title}\n   📅 ${d}  |  📍 ${e.venue || 'TBA'}${prize}${spots}`;
      }).join('\n\n')
    : 'No events scheduled this week. Check back soon!';

  const leaderSection = leaders && leaders.length > 0
    ? leaders.map((p, i) => {
        const medal = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'][i];
        return `${medal}  ${p.player_name}  |  ${p.elo_rating} ELO  |  ${p.wins}W – ${p.losses}L`;
      }).join('\n')
    : 'Leaderboard updating soon.';

  const subject = `🏸 RCC Weekly Roundup — ${weekLabel}`;
  const body = `Hey RCC Family! 👋

Here's everything happening at Racquets Club Community this week.

━━━━━━━━━━━━━━━━━━━━━━━━━━
📅  EVENTS THIS WEEK
━━━━━━━━━━━━━━━━━━━━━━━━━━

${eventsSection}

Register at: racquetsclubcommunity.com/events

━━━━━━━━━━━━━━━━━━━━━━━━━━
🏆  LEADERBOARD TOP 5
━━━━━━━━━━━━━━━━━━━━━━━━━━

${leaderSection}

Full rankings at: racquetsclubcommunity.com

━━━━━━━━━━━━━━━━━━━━━━━━━━

Have a great week on the courts!
— The RCC Team`;

  const [subscribers, settings] = await Promise.all([getActiveSubscribers(), getEmailSettings()]);
  if (subscribers.length === 0) return NextResponse.json({ skipped: true, reason: 'No active subscribers' });

  const result = await sendEmail(subscribers, subject, body, settings);
  return NextResponse.json({ ...result, events: events?.length ?? 0, subscribers: subscribers.length });
}
