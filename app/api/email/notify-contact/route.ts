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

export async function POST(req: NextRequest) {
  const { full_name, email, phone, subject, message } = await req.json();
  if (!email || !message) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const { data } = await getAdmin()
    .from('site_settings')
    .select('key, value')
    .eq('key', 'admin_email');

  const adminEmail = data?.[0]?.value || process.env.ADMIN_EMAIL || '';
  if (!adminEmail) return NextResponse.json({ skipped: true, reason: 'admin_email not configured' });

  const settings = await getEmailSettings();
  const emailSubject = `📬 New Contact: ${subject || 'General Inquiry'} — from ${full_name}`;
  const body = `New contact form submission received on the RCC website.

━━━━━━━━━━━━━━━━━━━━━━━━━━
📬  CONTACT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━

👤  Name:     ${full_name}
📧  Email:    ${email}
📞  Phone:    ${phone || 'Not provided'}
📌  Subject:  ${subject || 'General Inquiry'}

━━━━━━━━━━━━━━━━━━━━━━━━━━
💬  MESSAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━

${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━

Reply directly to ${email} to respond.

— RCC Website`;

  const result = await sendEmail(adminEmail, emailSubject, body, settings);
  return NextResponse.json(result);
}
