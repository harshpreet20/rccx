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

/** PATCH /api/store/discounts/[id] — update a discount code. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await checkAdmin(request);
  if (denied) return denied;

  const sb = getStoreSupabase();
  if (!sb) return NextResponse.json({ error: 'Store not configured' }, { status: 503 });

  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const allowed = ['code', 'type', 'value', 'active', 'starts_at', 'ends_at', 'usage_limit', 'min_order_amount'];
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }
  if (typeof update.code === 'string') update.code = update.code.trim().toUpperCase();

  const { data, error } = await sb.from('discounts').update(update).eq('id', id).select().maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Discount not found' }, { status: 404 });
  return NextResponse.json({ discount: data });
}

/** DELETE /api/store/discounts/[id] */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await checkAdmin(request);
  if (denied) return denied;

  const sb = getStoreSupabase();
  if (!sb) return NextResponse.json({ error: 'Store not configured' }, { status: 503 });

  const { id } = await params;
  const { error } = await sb.from('discounts').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
