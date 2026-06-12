import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, verifyWebhookSecret } from '@/lib/email';

export async function POST(req: NextRequest) {
  if (!verifyWebhookSecret(req.headers.get('authorization'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { email, name } = (await req.json()) as { email?: string; name?: string };
  if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 });

  const firstName = name?.split(' ')[0] || 'there';
  const subject = `Welcome to RCC, ${firstName}! 🏸`;
  const body = `Hi ${firstName}! 👋

Welcome to Racquets Club Community — Delhi's invite-only elite badminton network!

You're now subscribed to our newsletter. Here's what you can expect:

🏸  Event announcements — Weekend Tournaments, Ladder Leagues, Smash Nights
🏆  Tournament results and leaderboard updates
⭐  Player spotlights and community highlights
📣  Exclusive member updates and early registrations

If you'd like to become a full RCC member, visit:
racquetsclubcommunity.com/membership

We play at Siri Fort Sports Complex and DDA Vasant Kunj. See you on court!

— The RCC Team`;

  const result = await sendEmail(email, subject, body);
  return NextResponse.json(result);
}
