import { NextResponse } from 'next/server';
import { requireAdmin, ApiAuthError } from '@/lib/api-auth';
import { getStoreSupabase } from '@/lib/store-supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID_STATUSES = [
  'awaiting_confirmation',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
];

/** PATCH /api/store/orders/[id] — update an order's status. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request);
  } catch (err) {
    if (err instanceof ApiAuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sb = getStoreSupabase();
  if (!sb) return NextResponse.json({ error: 'Store not configured' }, { status: 503 });

  const { id } = await params;
  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.status || !VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: `status must be one of ${VALID_STATUSES.join(', ')}` }, { status: 400 });
  }

  const { data, error } = await sb
    .from('orders')
    .update({ status: body.status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  return NextResponse.json({ order: data });
}
