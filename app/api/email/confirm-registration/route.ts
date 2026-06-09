import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { getEmailSettings, verifyWebhookSecret } from '@/lib/email';

interface RegistrationPayload {
  member_name?: string;
  member_email?: string;
  ticket_id?: string;
  event_title?: string;
  event_date?: string;
  venue?: string;
  entry_fee?: number;
  event_type?: string;
}

async function buildTicketHtml(payload: RegistrationPayload, siteUrl: string): Promise<string> {
  const { member_name, ticket_id, event_title, event_date, venue, event_type } = payload;

  const verifyUrl = `${siteUrl}/verify/${ticket_id}`;
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    width: 200,
    margin: 2,
    color: { dark: '#0a2347', light: '#f3eee4' },
    errorCorrectionLevel: 'M',
  });

  const firstName = member_name?.split(' ')[0] || 'Player';
  const year = new Date().getFullYear();

  const dateObj = event_date ? new Date(event_date) : null;
  const formattedDate = dateObj
    ? dateObj.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : 'TBD';
  const formattedTime = dateObj
    ? dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : '';
  const monthShort = dateObj ? dateObj.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase() : '';
  const dayNum = dateObj ? dateObj.getDate() : '';
  const fullYear = dateObj ? dateObj.getFullYear() : '';

  const eventLabel = event_type
    ? event_type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : 'Badminton Event';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Your RCC Ticket — ${event_title}</title>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#050505;font-family:'Montserrat',Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#050505;padding:40px 16px;">
<tr><td align="center">

<table width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;width:100%;margin-bottom:12px;">
<tr>
  <td style="font-family:'Montserrat',Arial,sans-serif;font-size:13px;color:#555566;text-align:center;padding-bottom:8px;">
    Hi ${firstName}! Your ticket for <strong style="color:#D4AF37">${event_title}</strong> is confirmed.
  </td>
</tr>
</table>

<table width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;width:100%;border-radius:28px;overflow:hidden;background:linear-gradient(135deg,#06152f 0%,#0a2347 60%,#071324 100%);box-shadow:0 20px 60px rgba(0,0,0,.7);">

<tr>
  <td colspan="2" height="4" style="background:linear-gradient(to right,#D4AF37,#C21818,#D4AF37);font-size:0;line-height:0;">&nbsp;</td>
</tr>

<tr>
  <td colspan="2" style="padding:28px 40px 0;text-align:center;">
    <span style="font-family:'Montserrat',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.2em;color:#D4AF37;text-transform:uppercase;">RACQUETS CLUB COMMUNITY</span>
    <br>
    <span style="font-family:'Montserrat',Arial,sans-serif;font-size:10px;letter-spacing:0.12em;color:#444455;text-transform:uppercase;">Delhi&apos;s Elite Badminton Network</span>
  </td>
</tr>

<tr>
  <td colspan="2" style="padding:20px 40px 0;text-align:center;">
    <div style="font-family:'Oswald',Arial,sans-serif;font-size:42px;font-weight:700;color:#f2f2f2;line-height:1;text-transform:uppercase;letter-spacing:2px;">${(event_title || '').split(' ').slice(0, 3).join(' ')}</div>
    <div style="font-family:'Oswald',Arial,sans-serif;font-size:24px;font-weight:600;color:#D4AF37;line-height:1.3;text-transform:uppercase;letter-spacing:1px;margin-top:4px;">${eventLabel}</div>
    <div style="display:inline-block;background:#C21818;color:#fff;padding:8px 22px;border-radius:6px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-top:14px;">Smash. Compete. Connect.</div>
  </td>
</tr>

<tr>
  <td style="padding:30px 40px 10px;vertical-align:top;width:60%;">

    <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;width:100%;">
    <tr>
      <td width="52" valign="middle" style="padding-right:16px;">
        <div style="width:52px;height:52px;border:2px solid #D4AF37;border-radius:12px;text-align:center;line-height:52px;font-size:22px;">📅</div>
      </td>
      <td valign="middle">
        <div style="font-family:'Montserrat',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.12em;color:#D4AF37;text-transform:uppercase;margin-bottom:3px;">Date &amp; Time</div>
        <div style="font-family:'Oswald',Arial,sans-serif;font-size:18px;font-weight:600;color:#fff;line-height:1.3;">${formattedDate}</div>
        ${formattedTime ? `<div style="font-family:'Montserrat',Arial,sans-serif;font-size:12px;color:#c9d2df;margin-top:2px;">${formattedTime} onwards</div>` : ''}
      </td>
    </tr>
    </table>

    <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;width:100%;border-top:1px solid rgba(255,255,255,.1);padding-top:16px;">
    <tr>
      <td width="52" valign="middle" style="padding-right:16px;">
        <div style="width:52px;height:52px;border:2px solid #D4AF37;border-radius:12px;text-align:center;line-height:52px;font-size:22px;">📍</div>
      </td>
      <td valign="middle">
        <div style="font-family:'Montserrat',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.12em;color:#D4AF37;text-transform:uppercase;margin-bottom:3px;">Venue</div>
        <div style="font-family:'Oswald',Arial,sans-serif;font-size:20px;font-weight:600;color:#fff;line-height:1.2;">${venue || 'TBA'}</div>
        <div style="font-family:'Montserrat',Arial,sans-serif;font-size:12px;color:#c9d2df;margin-top:2px;">Delhi, India</div>
      </td>
    </tr>
    </table>

    <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;width:100%;border-top:1px solid rgba(255,255,255,.1);padding-top:16px;">
    <tr>
      <td width="52" valign="middle" style="padding-right:16px;">
        <div style="width:52px;height:52px;border:2px solid #D4AF37;border-radius:12px;text-align:center;line-height:52px;font-size:22px;">👤</div>
      </td>
      <td valign="middle">
        <div style="font-family:'Montserrat',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.12em;color:#D4AF37;text-transform:uppercase;margin-bottom:3px;">Registered Player</div>
        <div style="font-family:'Oswald',Arial,sans-serif;font-size:22px;font-weight:700;color:#fff;line-height:1.2;">${member_name || 'N/A'}</div>
      </td>
    </tr>
    </table>

    <table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-top:1px solid rgba(255,255,255,.1);padding-top:16px;">
    <tr>
      <td width="52" valign="middle" style="padding-right:16px;">
        <div style="width:52px;height:52px;border:2px solid #D4AF37;border-radius:12px;text-align:center;line-height:52px;font-size:22px;">🏸</div>
      </td>
      <td valign="middle">
        <div style="font-family:'Montserrat',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.12em;color:#D4AF37;text-transform:uppercase;margin-bottom:3px;">Category</div>
        <div style="font-family:'Oswald',Arial,sans-serif;font-size:20px;font-weight:600;color:#fff;line-height:1.2;">${eventLabel}</div>
      </td>
    </tr>
    </table>

  </td>

  <td style="padding:30px 30px 10px 20px;vertical-align:top;width:40%;border-left:2px dashed rgba(255,255,255,.15);">
    <div style="background:#f3eee4;border-radius:16px;padding:22px 18px;text-align:center;color:#0d1e3b;">

      <div style="background:#0b2d63;color:#fff;border-radius:10px;padding:10px;font-family:'Oswald',Arial,sans-serif;font-size:26px;font-weight:700;letter-spacing:2px;margin-bottom:16px;">ADMIT ONE</div>

      <div style="background:#C21818;color:#fff;border-radius:6px;padding:5px 12px;display:inline-block;font-family:'Oswald',Arial,sans-serif;font-size:16px;font-weight:700;letter-spacing:1px;margin-bottom:16px;">${monthShort} ${dayNum}${fullYear ? ', ' + fullYear : ''}</div>

      <div style="margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid rgba(0,0,0,.1);">
        <div style="font-family:'Montserrat',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.1em;color:#5a5a5a;text-transform:uppercase;margin-bottom:3px;">Ticket No.</div>
        <div style="font-family:monospace;font-size:13px;font-weight:700;color:#0d1e3b;letter-spacing:0.06em;">${ticket_id || 'N/A'}</div>
      </div>

      <div style="margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid rgba(0,0,0,.1);">
        <div style="font-family:'Montserrat',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.1em;color:#5a5a5a;text-transform:uppercase;margin-bottom:3px;">Venue</div>
        <div style="font-family:'Montserrat',Arial,sans-serif;font-size:12px;font-weight:600;color:#0d1e3b;line-height:1.3;">${venue || 'TBA'}</div>
      </div>

      <div style="margin-bottom:6px;">
        <div style="font-family:'Montserrat',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.1em;color:#5a5a5a;text-transform:uppercase;margin-bottom:8px;">Scan to Verify Entry</div>
        <img src="${qrDataUrl}" alt="QR Code" width="150" height="150" style="border-radius:8px;display:block;margin:0 auto;border:3px solid #0a2347;">
      </div>
      <div style="font-family:'Montserrat',Arial,sans-serif;font-size:10px;color:#888;margin-top:6px;">Present at entry gate</div>

    </div>
  </td>
</tr>

<tr>
  <td colspan="2" style="padding:20px 40px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td style="background:linear-gradient(90deg,#8d1117,#d62f2f);border-radius:14px;padding:16px;text-align:center;">
        <span style="font-family:'Montserrat',Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:1px;color:#ffd26f;text-transform:uppercase;">Exciting Matches · Great Prizes · One Community</span>
      </td>
    </tr>
    </table>
  </td>
</tr>

<tr>
  <td colspan="2" style="padding:20px 40px 28px;">
    <div style="background:rgba(212,175,55,0.06);border:1px solid rgba(212,175,55,0.15);border-radius:12px;padding:16px 20px;">
      <div style="font-family:'Montserrat',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.1em;color:#D4AF37;text-transform:uppercase;margin-bottom:8px;">What to bring</div>
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="font-family:'Montserrat',Arial,sans-serif;font-size:13px;color:#c9d2df;line-height:1.9;width:50%;vertical-align:top;">🏸 Racquet(s)<br>👟 Court shoes</td>
        <td style="font-family:'Montserrat',Arial,sans-serif;font-size:13px;color:#c9d2df;line-height:1.9;width:50%;vertical-align:top;">💧 Water bottle<br>💪 Your A-game</td>
      </tr>
      </table>
    </div>
  </td>
</tr>

<tr>
  <td colspan="2" style="padding:0 40px 28px;border-top:1px solid rgba(255,255,255,.06);">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;">
    <tr>
      <td style="font-family:'Montserrat',Arial,sans-serif;font-size:12px;color:#444455;text-align:center;line-height:1.7;">
        Questions? <a href="mailto:admin@racquetsclubcommunity.com" style="color:#D4AF37;text-decoration:none;">admin@racquetsclubcommunity.com</a>
        <br>
        <span style="font-size:11px;color:#333344;">© ${year} Racquets Club Community · Delhi · <a href="${verifyUrl}" style="color:#444455;text-decoration:none;">Verify ticket</a></span>
      </td>
    </tr>
    </table>
  </td>
</tr>

</table>

</td></tr>
</table>

</body>
</html>`;
}

export async function POST(req: NextRequest) {
  if (!verifyWebhookSecret(req.headers.get('authorization'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = (await req.json()) as RegistrationPayload;
  const { member_email, event_title } = data;

  if (!member_email || !event_title) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://racquetsclubcommunity.com';
  const settings = await getEmailSettings();

  if (!settings.apiKey || !settings.fromAddress) {
    return NextResponse.json({ sent: 0, errors: 1, reason: 'Email not configured' });
  }

  const subject = `🎫 Your RCC Ticket — ${event_title}`;
  const html = await buildTicketHtml(data, siteUrl);

  let result = { sent: 0, errors: 0 };
  try {
    const provider = settings.provider.toLowerCase();
    if (provider === 'sendgrid') {
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${settings.apiKey}` },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: member_email }] }],
          from: { email: settings.fromAddress, name: settings.fromName },
          subject,
          content: [{ type: 'text/html', value: html }],
        }),
      });
      result = res.status === 202 ? { sent: 1, errors: 0 } : { sent: 0, errors: 1 };
    } else if (provider === 'brevo' || provider === 'sendinblue') {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': settings.apiKey },
        body: JSON.stringify({
          sender: { name: settings.fromName, email: settings.fromAddress },
          to: [{ email: member_email }],
          subject,
          htmlContent: html,
        }),
      });
      result = res.ok ? { sent: 1, errors: 0 } : { sent: 0, errors: 1 };
    } else {
      // Resend (default)
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${settings.apiKey}` },
        body: JSON.stringify({
          from: `${settings.fromName} <${settings.fromAddress}>`,
          to: [member_email],
          subject,
          html,
        }),
      });
      result = res.ok ? { sent: 1, errors: 0 } : { sent: 0, errors: 1 };
    }
  } catch {
    result = { sent: 0, errors: 1 };
  }

  return NextResponse.json(result);
}
