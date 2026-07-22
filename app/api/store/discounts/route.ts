import { NextResponse } from 'next/server';
import { requireAdmin, ApiAuthError } from '@/lib/api-auth';
import { getStoreSupabase } from '@/lib/store-supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function checkAdmin(request: Request) {
  try {
    await requireAdmin(request);
    return null;
  } catch (err) {
    if (err instanceof ApiAuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

/** GET /api/store/discounts — list all discount codes. */
export async function GET(request: Request) {
  const denied = await checkAdmin(request);
  if (denied) return denied;

  const sb = getStoreSupabase();
  if (!sb) return NextResponse.json({ error: 'Store not configured' }, { status: 503 });

  const { data, error } = await sb.from('discounts').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ discounts: data });
}

/** POST /api/store/discounts — create a discount code. */
export async function POST(request: Request) {
  const denied = await checkAdmin(request);
  if (denied) return denied;

  const sb = getStoreSupabase();
  if (!sb) return NextResponse.json({ error: 'Store not configured' }, { status: 503 });

  let body: {
    code?: string;
    type?: 'percent' | 'flat';
    value?: number;
    active?: boolean;
    starts_at?: string | null;
    ends_at?: string | null;
    usage_limit?: number | null;
    min_order_amount?: number;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const code = String(body.code || '').trim().toUpperCase();
  if (!code) return NextResponse.json({ error: 'code is required' }, { status: 400 });
  if (body.type && !['percent', 'flat'].includes(body.type)) {
    return NextResponse.json({ error: "type must be 'percent' or 'flat'" }, { status: 400 });
  }
  const value = Number(body.value);
  if (!Number.isFinite(value) || value <= 0) {
    return NextResponse.json({ error: 'value must be a positive number' }, { status: 400 });
  }

  const { data, error } = await sb
    .from('discounts')
    .insert({
      code,
      type: body.type ?? 'percent',
      value,
      active: body.active ?? true,
      starts_at: body.starts_at ?? null,
      ends_at: body.ends_at ?? null,
      usage_limit: body.usage_limit ?? null,
      min_order_amount: body.min_order_amount ?? 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ discount: data }, { status: 201 });
}
