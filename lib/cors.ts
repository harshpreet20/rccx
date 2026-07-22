import { NextResponse } from 'next/server';

/**
 * Permissive CORS headers for /api/public/* routes -- these serve rcc-website
 * (a different origin) with data that used to be fetched by embedding the
 * anon key directly in that frontend, so no credential is exposed here that
 * wasn't already public.
 */
export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export function corsJson(body: unknown, init?: { status?: number }) {
  return NextResponse.json(body, { ...init, headers: CORS_HEADERS });
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
