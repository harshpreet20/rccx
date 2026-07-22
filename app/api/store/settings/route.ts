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

/** GET /api/store/settings — the single store_settings row. */
export async function GET(request: Request) {
  const denied = await checkAdmin(request);
  if (denied) return denied;

  const sb = getStoreSupabase();
  if (!sb) return NextResponse.json({ error: 'Store not configured' }, { status: 503 });

  const { data, error } = await sb.from('store_settings').select('*').eq('id', 1).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ settings: data });
}

/** PATCH /api/store/settings — update tax rate / shipping fee / free-shipping threshold. */
export async function PATCH(request: Request) {
  const denied = await checkAdmin(request);
  if (denied) return denied;

  const sb = getStoreSupabase();
  if (!sb) return NextResponse.json({ error: 'Store not configured' }, { status: 503 });

  let body: {
    tax_rate_pct?: number;
    shipping_flat_rate?: number;
    free_shipping_threshold?: number | null;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.tax_rate_pct != null) update.tax_rate_pct = Math.max(0, Math.floor(Number(body.tax_rate_pct)));
  if (body.shipping_flat_rate != null) update.shipping_flat_rate = Math.max(0, Math.floor(Number(body.shipping_flat_rate)));
  if ('free_shipping_threshold' in body) {
    update.free_shipping_threshold =
      body.free_shipping_threshold == null ? null : Math.max(0, Math.floor(Number(body.free_shipping_threshold)));
  }

  const { data, error } = await sb
    .from('store_settings')
    .update(update)
    .eq('id', 1)
    .select()
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ settings: data });
}
