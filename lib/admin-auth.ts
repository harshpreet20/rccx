'use client';

import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export type AdminAuthState = {
  user: User | null;
  isOrganizer: boolean;
  loading: boolean;
};

function isAdminUser(user: User): boolean {
  // app_metadata.is_admin is set server-side via SQL and embedded in the JWT.
  // No DB query needed — reads directly from the session token.
  return user.app_metadata?.is_admin === true;
}

export function useAdminAuth(): AdminAuthState {
  const [state, setState] = useState<AdminAuthState>({
    user: null,
    isOrganizer: false,
    loading: true,
  });

  useEffect(() => {
    let mounted = true;

    // Check existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        setState({ user: session.user, isOrganizer: isAdminUser(session.user), loading: false });
      } else {
        setState({ user: null, isOrganizer: false, loading: false });
      }
    });

    // React to sign-in / sign-out
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        setState({ user: session.user, isOrganizer: isAdminUser(session.user), loading: false });
      } else {
        setState({ user: null, isOrganizer: false, loading: false });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
