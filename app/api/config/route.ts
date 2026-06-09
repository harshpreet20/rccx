import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) return NextResponse.json({});

    const client = createClient(supabaseUrl, supabaseKey);
    const { data } = await client
      .from('site_settings')
      .select('key, value')
      .eq('key', 'recaptcha_site_key')
      .single();

    const siteKey = data?.value || process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';
    return NextResponse.json({ recaptcha_site_key: siteKey });
  } catch {
    return NextResponse.json({ recaptcha_site_key: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '' });
  }
}
