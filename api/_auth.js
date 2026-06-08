const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wsucqpunleplgyrrroae.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

/**
 * Verifies the Supabase JWT from the Authorization header.
 * Returns { user, role } on success, or throws an error.
 * role is one of: 'organizer' | 'franchise_owner' | 'user'
 */
export async function requireAuth(req) {
  if (!SUPABASE_SERVICE_KEY) {
    throw Object.assign(new Error('Server misconfigured'), { status: 500 });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw Object.assign(new Error('Unauthorized'), { status: 401 });
  }
  const token = authHeader.slice(7);

  const resp = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: SUPABASE_SERVICE_KEY,
    },
  });

  if (!resp.ok) {
    throw Object.assign(new Error('Invalid or expired token'), { status: 401 });
  }

  const user = await resp.json();

  // Resolve role from DB
  const adminResp = await fetch(
    `${SUPABASE_URL}/rest/v1/admin_users?select=role&email=eq.${encodeURIComponent(user.email)}&limit=1`,
    { headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` } }
  );
  const adminRows = adminResp.ok ? await adminResp.json() : [];
  if (adminRows.length > 0 && adminRows[0].role) return { user, role: 'organizer' };

  const orgResp = await fetch(
    `${SUPABASE_URL}/rest/v1/rrc_organizers?select=id&user_id=eq.${encodeURIComponent(user.id)}&limit=1`,
    { headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` } }
  );
  const orgRows = orgResp.ok ? await orgResp.json() : [];
  if (orgRows.length > 0) return { user, role: 'organizer' };

  const foResp = await fetch(
    `${SUPABASE_URL}/rest/v1/rrc_franchise_owners?select=id&user_id=eq.${encodeURIComponent(user.id)}&limit=1`,
    { headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` } }
  );
  const foRows = foResp.ok ? await foResp.json() : [];
  if (foRows.length > 0) return { user, role: 'franchise_owner' };

  return { user, role: 'user' };
}
