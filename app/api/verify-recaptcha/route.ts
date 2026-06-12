import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

async function getSecretKey(): Promise<string> {
  // Try service role client first (bypasses RLS)
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (serviceKey && url) {
    try {
      const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
      const { data } = await admin.from('site_settings').select('value').eq('key', 'recaptcha_secret_key').single();
      if (data?.value) return data.value;
    } catch { /* fall through */ }
  }
  return process.env.RECAPTCHA_SECRET_KEY || '';
}

export async function POST(req: NextRequest) {
  const { token } = (await req.json()) as { token?: string };

  if (!token) {
    return NextResponse.json({ success: false, error: 'Missing token' }, { status: 400 });
  }

  const secretKey = await getSecretKey();
  if (!secretKey) {
    // reCAPTCHA not configured — pass through
    return NextResponse.json({ success: true, score: 1, unconfigured: true });
  }

  const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${secretKey}&response=${token}`,
  });

  const data = (await verifyRes.json()) as { success: boolean; score?: number; 'error-codes'?: string[] };
  return NextResponse.json({ success: data.success, score: data.score ?? 0 });
}
