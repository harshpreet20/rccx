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

const PLAN_LABEL: Record<string, string> = {
  monthly: 'Monthly Plan',
  quarterly: 'Quarterly Plan',
  annual: 'Annual Plan',
};

export async function POST(req: NextRequest) {
  const { name, email, phone, skill_level, membership_type, app_id } = await req.json();
  if (!email || !name) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const { data } = await getAdmin()
    .from('site_settings')
    .select('value')
    .eq('key', 'admin_email')
    .maybeSingle();

  const adminEmail = data?.value || process.env.ADMIN_EMAIL || '';
  const settings = await getEmailSettings();
  const firstName = name.split(' ')[0];
  const planLabel = PLAN_LABEL[membership_type] || membership_type || 'Not specified';

  // Confirmation email to applicant
  const applicantSubject = `🏸 RCC Membership Application Received — ${app_id}`;
  const applicantBody = `Hi ${firstName}! 🏸

Thank you for applying to Racquets Club Community — Delhi's invite-only elite badminton network!

━━━━━━━━━━━━━━━━━━━━━━━━━━
🎫  APPLICATION DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━

📋  Application ID:  ${app_id}
👤  Name:            ${name}
📧  Email:           ${email}
🏸  Skill Level:     ${skill_level || 'Not specified'}
📅  Plan:            ${planLabel}

━━━━━━━━━━━━━━━━━━━━━━━━━━

Our team will review your application within 48 hours and get back to you at this email address.

Please keep your Application ID (${app_id}) handy for any follow-up queries.

For urgent queries: admin@racquetsclubcommunity.com

We look forward to welcoming you on court!
— The RCC Team`;

  const applicantResult = await sendEmail(email, applicantSubject, applicantBody, settings);

  // Admin notification
  let adminResult = { sent: 0, errors: 0 };
  if (adminEmail) {
    const adminSubject = `🆕 New Membership Application — ${name} (${skill_level || 'unspecified'})`;
    const adminBody = `New membership application received on the RCC website.

━━━━━━━━━━━━━━━━━━━━━━━━━━
📋  APPLICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━

🎫  App ID:       ${app_id}
👤  Name:         ${name}
📧  Email:        ${email}
📞  Phone:        ${phone || 'Not provided'}
🏸  Skill Level:  ${skill_level || 'Not specified'}
📅  Plan:         ${planLabel}

━━━━━━━━━━━━━━━━━━━━━━━━━━

Review &amp; approve in admin panel:
racquetsclubcommunity.com/enter/backend

— RCC Website`;
    adminResult = await sendEmail(adminEmail, adminSubject, adminBody, settings);
  }

  return NextResponse.json({ applicant: applicantResult, admin: adminResult });
}
