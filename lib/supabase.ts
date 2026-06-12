import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    // Return a no-op proxy during build / when env vars are missing
    return createClient('https://placeholder.supabase.co', 'placeholder') as SupabaseClient;
  }
  _client = createClient(url, key);
  return _client;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getClient() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

// ── Types ──────────────────────────────────────────────────

export type Event = {
  id: string;
  title: string;
  description: string;
  venue: string;
  date: string;
  time: string;
  slots_total: number;
  slots_left: number;
  skill_level: string;
  type: 'upcoming' | 'past';
  event_type: string;
  image_url?: string;
  registration_url?: string;
  featured: boolean;
  created_at: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  url: string;
  type: 'image' | 'video';
  category: string;
  thumbnail_url?: string;
  created_at: string;
};

export type Sponsor = {
  id: string;
  name: string;
  logo_url?: string;
  website_url?: string;
  category: string;
  tier: string;
  created_at: string;
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
  active: boolean;
  created_at: string;
};

export type JoinRequest = {
  full_name: string;
  phone: string;
  email?: string;
  skill_level: string;
  message?: string;
};

export type BirthdaySubmission = {
  full_name: string;
  birthday_month: number;
  birthday_day: number;
  birth_year?: number;
  phone?: string;
  message?: string;
};

export type CommunityMember = {
  full_name: string;
  phone?: string;
  email?: string;
  birthday?: string;
  skill_level: string;
  court_preference?: string;
  years_playing?: number;
  how_heard?: string;
  agree_guidelines: boolean;
};

// ── DB helpers ─────────────────────────────────────────────

export async function submitJoinRequest(data: JoinRequest) {
  const { error } = await supabase.from('join_requests').insert([data]);
  if (error) throw error;
}

export async function submitBirthday(data: BirthdaySubmission) {
  const { error } = await supabase.from('birthday_submissions').insert([data]);
  if (error) throw error;
}

export async function submitMemberOnboarding(data: CommunityMember) {
  const { error } = await supabase.from('community_members').insert([data]);
  if (error) throw error;
}

export async function getUpcomingBirthdays() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const { data, error } = await supabase
    .from('birthday_submissions')
    .select('full_name, birthday_month, birthday_day')
    .eq('birthday_month', month)
    .order('birthday_day', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getAnnouncements() {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
