import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface SendPayload {
  subject: string;
  html: string;
  test_email?: string; // if set, sends only to this address as a test
}

interface EmailSettings {
  provider: string;
  apiKey: string;
  fromAddress: string;
  fromName: string;
}

async function getSettings(): Promise<EmailSettings> {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (serviceKey && url) {
    try {
      const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
      const { data } = await admin
        .from('site_settings')
        .select('key, value')
        .in('key', ['email_provider', 'email_api_key', 'email_from_address', 'email_from_name']);
      const map: Record<string, string> = {};
      (data ?? []).forEach(r => { map[r.key] = r.value ?? ''; });
      return {
        provider:    map.email_provider    || process.env.EMAIL_PROVIDER    || 'resend',
        apiKey:      map.email_api_key     || process.env.EMAIL_API_KEY     || '',
        fromAddress: map.email_from_address|| process.env.EMAIL_FROM_ADDRESS|| '',
        fromName:    map.email_from_name   || process.env.EMAIL_FROM_NAME   || 'RCC Newsletter',
      };
    } catch { /* fall through */ }
  }
  return {
    provider:    process.env.EMAIL_PROVIDER    || 'resend',
    apiKey:      process.env.EMAIL_API_KEY     || '',
    fromAddress: process.env.EMAIL_FROM_ADDRESS|| '',
    fromName:    process.env.EMAIL_FROM_NAME   || 'RCC Newsletter',
  };
}

async function getSubscribers(testEmail?: string): Promise<string[]> {
  if (testEmail) return [testEmail];
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (serviceKey && url) {
    const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
    const { data } = await admin
      .from('newsletter_subscribers')
      .select('email')
      .eq('status', 'active');
    return (data ?? []).map(r => r.email as string).filter(Boolean);
  }
  // fallback: anon client (won't work if RLS blocks anon reads)
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && anonKey) {
    const client = createClient(url, anonKey, { auth: { persistSession: false } });
    const { data } = await client.from('newsletter_subscribers').select('email').eq('status', 'active');
    return (data ?? []).map(r => r.email as string).filter(Boolean);
  }
  return [];
}

function buildEmailHtml(subject: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#080810;font-family:Arial,'Helvetica Neue',sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:40px 24px;">
  <div style="text-align:center;margin-bottom:32px;padding-bottom:24px;border-bottom:1px solid rgba(212,175,55,0.2);">
    <div style="font-size:22px;font-weight:700;color:#D4AF37;letter-spacing:0.06em;">RACQUETS CLUB COMMUNITY</div>
    <div style="font-size:12px;color:#888899;letter-spacing:0.08em;margin-top:4px;">Delhi&apos;s Elite Badminton Network</div>
  </div>
  <div style="color:#e8e8ec;font-size:15px;line-height:1.7;white-space:pre-wrap;">${body}</div>
  <div style="margin-top:40px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
    <div style="font-size:12px;color:#555566;">You received this because you subscribed to RCC updates.</div>
    <div style="font-size:11px;color:#444455;margin-top:6px;">
      © ${new Date().getFullYear()} Racquets Club Community · Delhi
    </div>
  </div>
</div>
</body>
</html>`;
}

async function sendViaResend(
  recipients: string[], subject: string, html: string,
  apiKey: string, fromName: string, fromAddr: string
): Promise<{ sent: number; errors: number }> {
  let sent = 0; let errors = 0;
  // Resend batch: max 100 per request
  for (let i = 0; i < recipients.length; i += 100) {
    const batch = recipients.slice(i, i + 100).map(email => ({
      from: `${fromName} <${fromAddr}>`,
      to: [email],
      subject,
      html,
    }));
    try {
      const res = await fetch('https://api.resend.com/emails/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify(batch),
      });
      if (res.ok) sent += batch.length;
      else errors += batch.length;
    } catch { errors += batch.length; }
  }
  return { sent, errors };
}

async function sendViaSendGrid(
  recipients: string[], subject: string, html: string,
  apiKey: string, fromName: string, fromAddr: string
): Promise<{ sent: number; errors: number }> {
  let sent = 0; let errors = 0;
  // SendGrid supports up to 1000 personalizations per request
  for (let i = 0; i < recipients.length; i += 1000) {
    const slice = recipients.slice(i, i + 1000);
    const payload = {
      personalizations: slice.map(email => ({ to: [{ email }] })),
      from: { email: fromAddr, name: fromName },
      subject,
      content: [{ type: 'text/html', value: html }],
    };
    try {
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify(payload),
      });
      if (res.status === 202) sent += slice.length;
      else errors += slice.length;
    } catch { errors += slice.length; }
  }
  return { sent, errors };
}

async function sendViaBrevo(
  recipients: string[], subject: string, html: string,
  apiKey: string, fromName: string, fromAddr: string
): Promise<{ sent: number; errors: number }> {
  let sent = 0; let errors = 0;
  for (const email of recipients) {
    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
        body: JSON.stringify({
          sender: { name: fromName, email: fromAddr },
          to: [{ email }],
          subject,
          htmlContent: html,
        }),
      });
      if (res.ok) sent++; else errors++;
    } catch { errors++; }
  }
  return { sent, errors };
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as SendPayload;
  const { subject, html: rawHtml, test_email } = body;

  if (!subject?.trim() || !rawHtml?.trim()) {
    return NextResponse.json({ error: 'Subject and body are required.' }, { status: 400 });
  }

  const settings = await getSettings();
  if (!settings.apiKey) {
    return NextResponse.json({ error: 'Email API key not configured. Go to Site Settings to add it.' }, { status: 503 });
  }
  if (!settings.fromAddress) {
    return NextResponse.json({ error: 'From address not configured. Go to Site Settings to add it.' }, { status: 503 });
  }

  const recipients = await getSubscribers(test_email);
  if (recipients.length === 0) {
    return NextResponse.json({ error: 'No active subscribers found.' }, { status: 400 });
  }

  const html = buildEmailHtml(subject, rawHtml);
  let result: { sent: number; errors: number };

  switch (settings.provider.toLowerCase()) {
    case 'sendgrid':
      result = await sendViaSendGrid(recipients, subject, html, settings.apiKey, settings.fromName, settings.fromAddress);
      break;
    case 'brevo':
    case 'sendinblue':
      result = await sendViaBrevo(recipients, subject, html, settings.apiKey, settings.fromName, settings.fromAddress);
      break;
    default:
      result = await sendViaResend(recipients, subject, html, settings.apiKey, settings.fromName, settings.fromAddress);
  }

  return NextResponse.json({ ...result, total: recipients.length, provider: settings.provider });
}
