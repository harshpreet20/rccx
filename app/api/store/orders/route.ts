import { NextResponse } from 'next/server';
import { requireAdmin, ApiAuthError } from '@/lib/api-auth';
import { getStoreSupabase } from '@/lib/store-supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET /api/store/orders?status=&limit=&offset= — list orders from the RCC Store project. */
export async function GET(request: Request) {
  try {
    await requireAdmin(request);
  } catch (err) {
    if (err instanceof ApiAuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sb = getStoreSupabase();
  if (!sb) return NextResponse.json({ error: 'Store not configured' }, { status: 503 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const limit = Math.min(200, Math.max(1, Number(searchParams.get('limit')) || 50));
  const offset = Math.max(0, Number(searchParams.get('offset')) || 0);

  let query = sb
    .from('orders')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (status) query = query.eq('status', status);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data, count });
}
