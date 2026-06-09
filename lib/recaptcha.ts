'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export function useRecaptcha() {
  const [siteKey, setSiteKey] = useState<string | null>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    fetch('/api/config')
      .then(r => r.json())
      .then(d => { if (d.recaptcha_site_key) setSiteKey(d.recaptcha_site_key); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!siteKey || scriptLoaded.current) return;
    const existing = document.querySelector(`script[src*="recaptcha/api.js"]`);
    if (existing) { scriptLoaded.current = true; return; }
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    document.head.appendChild(script);
    scriptLoaded.current = true;
  }, [siteKey]);

  const executeRecaptcha = useCallback(async (action: string): Promise<string | null> => {
    if (!siteKey || typeof window === 'undefined' || !window.grecaptcha) return null;
    return new Promise(resolve => {
      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha.execute(siteKey, { action });
          resolve(token);
        } catch {
          resolve(null);
        }
      });
    });
  }, [siteKey]);

  return { executeRecaptcha, recaptchaReady: !!siteKey };
}

export async function verifyRecaptchaToken(token: string): Promise<boolean> {
  try {
    const res = await fetch('/api/verify-recaptcha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    const data = await res.json() as { success: boolean; score?: number };
    return data.success && (data.score ?? 1) >= 0.5;
  } catch {
    return true; // fail open — don't block users if verification is unreachable
  }
}
