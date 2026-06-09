import { NextRequest, NextResponse } from 'next/server';

const SEO_API_BASE = 'https://seo-gold.vercel.app';

export async function POST(req: NextRequest) {
  const apiKey = process.env.SEO_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'SEO_API_KEY not configured' }, { status: 503 });
  }

  const body = await req.json() as {
    keyword: string;
    content: string;
    location?: string;
    domainUrl?: string;
    metaTitle?: string;
    metaDescription?: string;
  };

  if (!body.keyword || !body.content) {
    return NextResponse.json({ error: 'keyword and content are required' }, { status: 400 });
  }

  const res = await fetch(`${SEO_API_BASE}/api/n8n/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function GET() {
  const apiKey = process.env.SEO_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'SEO_API_KEY not configured' }, { status: 503 });
  }
  const res = await fetch(`${SEO_API_BASE}/api/n8n/pricing`, {
    headers: { 'Authorization': `Bearer ${apiKey}` },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
