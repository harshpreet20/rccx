import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  const { ticketId } = await params;

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  const { data, error } = await admin
    .from('event_registrations')
    .select(`
      ticket_id,
      member_name,
      member_email,
      skill_level,
      registered_at,
      events (
        title,
        event_date,
        venue,
        event_type,
        status
      )
    `)
    .eq('ticket_id', ticketId)
    .single();

  if (error || !data) {
    return NextResponse.json({ valid: false, error: 'Ticket not found' }, { status: 404 });
  }

  const event = data.events as unknown as Record<string, string> | null;
  return NextResponse.json({
    valid: true,
    ticket_id: data.ticket_id,
    member_name: data.member_name,
    skill_level: data.skill_level,
    registered_at: data.registered_at,
    event_title: event?.title,
    event_date: event?.event_date,
    venue: event?.venue,
    event_type: event?.event_type,
    event_status: event?.status,
  });
}
