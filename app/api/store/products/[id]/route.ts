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

const ALLOWED = [
  'slug', 'name', 'blurb', 'description', 'price', 'category', 'sizes', 'personalization',
  'highlights', 'accent', 'emoji', 'image', 'stock', 'badge', 'sold_out', 'active', 'sort_order',
  'seo_title', 'seo_description', 'seo_keywords', 'kind', 'amazon_url', 'flipkart_url',
];

/** PATCH /api/store/products/[id] */
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

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of ALLOWED) {
    if (key in body) update[key] = body[key];
  }

  const { data, error } = await sb.from('products').update(update).eq('id', id).select().maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  return NextResponse.json({ product: data });
}

/** DELETE /api/store/products/[id] */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await checkAdmin(request);
  if (denied) return denied;

  const sb = getStoreSupabase();
  if (!sb) return NextResponse.json({ error: 'Store not configured' }, { status: 503 });

  const { id } = await params;
  const { error } = await sb.from('products').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
