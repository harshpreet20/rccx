import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface IgMediaItem {
  id: string;
  caption?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  like_count?: number;
  timestamp?: string;
  media_type?: string;
}

async function getSettings(): Promise<{ accessToken: string; accountId: string }> {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (serviceKey && url) {
    try {
      const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
      const { data } = await admin
        .from('site_settings')
        .select('key, value')
        .in('key', ['instagram_access_token', 'instagram_account_id']);
      const map: Record<string, string> = {};
      (data ?? []).forEach(r => { map[r.key] = r.value ?? ''; });
      return {
        accessToken: map.instagram_access_token || process.env.INSTAGRAM_ACCESS_TOKEN || '',
        accountId: map.instagram_account_id || process.env.INSTAGRAM_ACCOUNT_ID || '',
      };
    } catch { /* fall through */ }
  }
  return {
    accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || '',
    accountId: process.env.INSTAGRAM_ACCOUNT_ID || '',
  };
}

// Silently refresh a long-lived token (valid for 60 days, refreshable after 24h)
async function maybeRefreshToken(token: string): Promise<string> {
  try {
    const res = await fetch(
      `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`,
      { next: { revalidate: 86400 } } // only actually call once per day
    );
    if (res.ok) {
      const json = (await res.json()) as { access_token?: string };
      if (json.access_token) return json.access_token;
    }
  } catch { /* ignore */ }
  return token;
}

export async function GET() {
  const { accessToken, accountId } = await getSettings();

  if (!accessToken) {
    return NextResponse.json({ posts: [], source: 'unconfigured' });
  }

  // For personal tokens, refresh silently in the background
  const token = accountId ? accessToken : await maybeRefreshToken(accessToken);

  try {
    const fields = 'id,caption,media_url,thumbnail_url,permalink,like_count,timestamp,media_type';
    // Business/Creator accounts use Facebook Graph API; personal uses Instagram Basic Display
    const endpoint = accountId
      ? `https://graph.facebook.com/v21.0/${accountId}/media?fields=${fields}&limit=9&access_token=${token}`
      : `https://graph.instagram.com/me/media?fields=${fields}&limit=9&access_token=${token}`;

    const res = await fetch(endpoint, { next: { revalidate: 300 } }); // cache 5 min
    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ posts: [], source: 'api_error', error: err }, { status: 200 });
    }

    const json = (await res.json()) as { data?: IgMediaItem[] };
    const posts = (json.data ?? [])
      .filter(item => item.media_type !== 'VIDEO' || item.thumbnail_url)
      .map(item => ({
        id: item.id,
        caption: item.caption ?? '',
        image_url: item.media_type === 'VIDEO' ? (item.thumbnail_url ?? '') : (item.media_url ?? ''),
        post_url: item.permalink ?? 'https://www.instagram.com/racquetsclubcommunity/',
        likes: item.like_count ?? 0,
        posted_at: item.timestamp ?? new Date().toISOString(),
      }));

    return NextResponse.json({ posts, source: 'instagram_api' });
  } catch (err) {
    return NextResponse.json({ posts: [], source: 'fetch_error', error: String(err) }, { status: 200 });
  }
}
