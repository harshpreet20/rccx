import { createClient } from '@supabase/supabase-js';

export class ApiAuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/**
 * Verifies the caller's Supabase access token (rccadmin's own auth project)
 * and requires app_metadata.is_admin, matching the check useAdminAuth() does
 * client-side. Throws ApiAuthError with a status code on failure -- route
 * handlers should catch and translate to a JSON response.
 */
export async function requireAdmin(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new ApiAuthError('Server misconfigured', 500);
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new ApiAuthError('Unauthorized', 401);
  }
  const token = authHeader.slice(7);

  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data?.user) {
    throw new ApiAuthError('Invalid or expired token', 401);
  }
  if (data.user.app_metadata?.is_admin !== true) {
    throw new ApiAuthError('Forbidden', 403);
  }
  return data.user;
}
