import { createClient } from '@supabase/supabase-js';

export interface EmailSettings {
  provider: string;
  apiKey: string;
  fromAddress: string;
  fromName: string;
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function getEmailSettings(): Promise<EmailSettings> {
  try {
    const { data } = await getSupabaseAdmin()
      .from('site_settings')
      .select('key, value')
      .in('key', ['email_provider', 'email_api_key', 'email_from_address', 'email_from_name']);
    const m: Record<string, string> = {};
    (data ?? []).forEach(r => { m[r.key] = r.value ?? ''; });
    return {
      provider:    m.email_provider     || process.env.EMAIL_PROVIDER     || 'resend',
      apiKey:      m.email_api_key      || process.env.EMAIL_API_KEY      || '',
      fromAddress: m.email_from_address || process.env.EMAIL_FROM_ADDRESS || '',
      fromName:    m.email_from_name    || process.env.EMAIL_FROM_NAME    || 'RCC Newsletter',
    };
  } catch {
    return { provider: 'resend', apiKey: process.env.EMAIL_API_KEY || '', fromAddress: process.env.EMAIL_FROM_ADDRESS || '', fromName: 'RCC Newsletter' };
  }
}

export function buildBrandedHtml(subject: string, body: string): string {
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#080810;font-family:Arial,'Helvetica Neue',sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:0 0 40px 0;">
  <!-- Header bar -->
  <div style="height:4px;background:linear-gradient(to right,#D4AF37,#C21818);"></div>
  <!-- Logo block -->
  <div style="text-align:center;padding:32px 24px 20px;border-bottom:1px solid rgba(212,175,55,0.15);">
    <div style="font-size:24px;font-weight:700;color:#D4AF37;letter-spacing:0.06em;">RACQUETS CLUB COMMUNITY</div>
    <div style="font-size:11px;color:#888899;letter-spacing:0.1em;margin-top:4px;text-transform:uppercase;">Delhi's Elite Badminton Network</div>
  </div>
  <!-- Body -->
  <div style="padding:32px 28px;color:#e8e8ec;font-size:15px;line-height:1.75;white-space:pre-wrap;">${body}</div>
  <!-- Footer -->
  <div style="padding:20px 28px 0;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
    <div style="font-size:12px;color:#555566;">You received this because you subscribed to RCC updates.</div>
    <div style="font-size:11px;color:#3a3a4a;margin-top:6px;">© ${year} Racquets Club Community · Delhi</div>
  </div>
</div>
</body>
</html>`;
}

async function sendViaResend(
  recipients: string[], subject: string, html: string, s: EmailSettings
): Promise<{ sent: number; errors: number }> {
  let sent = 0, errors = 0;
  for (let i = 0; i < recipients.length; i += 100) {
    const batch = recipients.slice(i, i + 100).map(email => ({
      from: `${s.fromName} <${s.fromAddress}>`,
      to: [email], subject, html,
    }));
    try {
      const res = await fetch('https://api.resend.com/emails/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${s.apiKey}` },
        body: JSON.stringify(batch),
      });
      if (res.ok) sent += batch.length; else errors += batch.length;
    } catch { errors += batch.length; }
  }
  return { sent, errors };
}

async function sendViaSendGrid(
  recipients: string[], subject: string, html: string, s: EmailSettings
): Promise<{ sent: number; errors: number }> {
  let sent = 0, errors = 0;
  for (let i = 0; i < recipients.length; i += 1000) {
    const slice = recipients.slice(i, i + 1000);
    try {
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${s.apiKey}` },
        body: JSON.stringify({
          personalizations: slice.map(email => ({ to: [{ email }] })),
          from: { email: s.fromAddress, name: s.fromName }, subject,
          content: [{ type: 'text/html', value: html }],
        }),
      });
      if (res.status === 202) sent += slice.length; else errors += slice.length;
    } catch { errors += slice.length; }
  }
  return { sent, errors };
}

async function sendViaBrevo(
  recipients: string[], subject: string, html: string, s: EmailSettings
): Promise<{ sent: number; errors: number }> {
  let sent = 0, errors = 0;
  for (const email of recipients) {
    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': s.apiKey },
        body: JSON.stringify({ sender: { name: s.fromName, email: s.fromAddress }, to: [{ email }], subject, htmlContent: html }),
      });
      if (res.ok) sent++; else errors++;
    } catch { errors++; }
  }
  return { sent, errors };
}

export async function sendEmail(
  to: string | string[],
  subject: string,
  bodyText: string,
  settings?: EmailSettings
): Promise<{ sent: number; errors: number }> {
  const s = settings ?? await getEmailSettings();
  if (!s.apiKey || !s.fromAddress) return { sent: 0, errors: 1 };
  const recipients = Array.isArray(to) ? to : [to];
  const html = buildBrandedHtml(subject, bodyText);
  switch (s.provider.toLowerCase()) {
    case 'sendgrid': return sendViaSendGrid(recipients, subject, html, s);
    case 'brevo': case 'sendinblue': return sendViaBrevo(recipients, subject, html, s);
    default: return sendViaResend(recipients, subject, html, s);
  }
}

export async function getActiveSubscribers(): Promise<string[]> {
  const { data } = await getSupabaseAdmin()
    .from('newsletter_subscribers')
    .select('email')
    .eq('status', 'active');
  return (data ?? []).map(r => r.email as string).filter(Boolean);
}

export function verifyCronSecret(authHeader: string | null): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // unconfigured = open (dev mode)
  return authHeader === `Bearer ${secret}`;
}

export function verifyWebhookSecret(authHeader: string | null): boolean {
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) return true;
  return authHeader === `Bearer ${secret}`;
}
