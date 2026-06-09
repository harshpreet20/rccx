import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail, getEmailSettings } from '@/lib/email';

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}

const PRIORITY_LABEL: Record<string, string> = {
  low: 'Low', medium: 'Medium', high: 'High ⚠', urgent: 'URGENT 🚨',
};
const CATEGORY_LABEL: Record<string, string> = {
  general: 'General Enquiry', event: 'Event Issue', membership: 'Membership',
  payment: 'Payment', court_booking: 'Court Booking', technical: 'Technical Issue', other: 'Other',
};

export async function POST(req: NextRequest) {
  const { ticket_number, name, email, phone, category, subject, description, priority } = await req.json();
  if (!email || !ticket_number) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const { data } = await getAdmin()
    .from('site_settings').select('value').eq('key', 'admin_email').maybeSingle();

  const adminEmail = data?.value || process.env.ADMIN_EMAIL || '';
  const settings = await getEmailSettings();
  const firstName = name?.split(' ')[0] || 'there';

  // Confirmation to submitter
  const userSubject = `🎫 Support Ticket Received — ${ticket_number}`;
  const userBody = `Hi ${firstName}!

We've received your support request. Here are your ticket details:

━━━━━━━━━━━━━━━━━━━━━━━━━━
🎫  TICKET DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━

📋  Ticket No.:  ${ticket_number}
📌  Subject:     ${subject}
🏷️  Category:    ${CATEGORY_LABEL[category] || category}
⚡  Priority:    ${PRIORITY_LABEL[priority] || priority}
📊  Status:      Open

━━━━━━━━━━━━━━━━━━━━━━━━━━

Our team will review your request and respond within 24–48 hours at ${email}.

For urgent matters, you can also reach us at admin@racquetsclubcommunity.com

— The RCC Support Team`;

  const userResult = await sendEmail(email, userSubject, userBody, settings);

  // Admin notification
  let adminResult = { sent: 0, errors: 0 };
  if (adminEmail) {
    const adminSubject = `🎫 New Support Ticket [${PRIORITY_LABEL[priority]}] — ${ticket_number}`;
    const adminBody = `New support ticket submitted.

━━━━━━━━━━━━━━━━━━━━━━━━━━
📋  TICKET: ${ticket_number}
━━━━━━━━━━━━━━━━━━━━━━━━━━

📌  Subject:    ${subject}
🏷️  Category:   ${CATEGORY_LABEL[category] || category}
⚡  Priority:   ${PRIORITY_LABEL[priority] || priority}

👤  Name:       ${name}
📧  Email:      ${email}
📞  Phone:      ${phone || 'Not provided'}

━━━━━━━━━━━━━━━━━━━━━━━━━━
💬  DESCRIPTION
━━━━━━━━━━━━━━━━━━━━━━━━━━

${description}

━━━━━━━━━━━━━━━━━━━━━━━━━━

Manage in admin panel: racquetsclubcommunity.com/enter/backend

— RCC Website`;
    adminResult = await sendEmail(adminEmail, adminSubject, adminBody, settings);
  }

  return NextResponse.json({ user: userResult, admin: adminResult });
}
