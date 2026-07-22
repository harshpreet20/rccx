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

/** GET /api/store/products — list all products (including inactive/sold-out, for admin). */
export async function GET(request: Request) {
  const denied = await checkAdmin(request);
  if (denied) return denied;

  const sb = getStoreSupabase();
  if (!sb) return NextResponse.json({ error: 'Store not configured' }, { status: 503 });

  const { data, error } = await sb.from('products').select('*').order('sort_order', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data });
}

/** POST /api/store/products — create a product. */
export async function POST(request: Request) {
  const denied = await checkAdmin(request);
  if (denied) return denied;

  const sb = getStoreSupabase();
  if (!sb) return NextResponse.json({ error: 'Store not configured' }, { status: 503 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const slug = String(body.slug || '').trim();
  const name = String(body.name || '').trim();
  const price = Number(body.price);
  if (!slug || !name) return NextResponse.json({ error: 'slug and name are required' }, { status: 400 });
  if (!Number.isFinite(price) || price < 0) {
    return NextResponse.json({ error: 'price must be a non-negative number' }, { status: 400 });
  }

  const allowed = [
    'blurb', 'description', 'category', 'sizes', 'personalization', 'highlights',
    'accent', 'emoji', 'image', 'stock', 'badge', 'sold_out', 'active', 'sort_order',
    'seo_title', 'seo_description', 'seo_keywords', 'kind', 'amazon_url', 'flipkart_url',
  ];
  const insert: Record<string, unknown> = { slug, name, price };
  for (const key of allowed) {
    if (key in body) insert[key] = body[key];
  }

  const { data, error } = await sb.from('products').insert(insert).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data }, { status: 201 });
}
