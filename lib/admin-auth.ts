'use client';

import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export type AdminAuthState = {
  user: User | null;
  isOrganizer: boolean;
  loading: boolean;
};

async function resolveIsOrganizer(_user: User): Promise<boolean> {
  // Use SECURITY DEFINER RPC — bypasses GRANT issues on admin_users
  const { data, error } = await supabase.rpc('check_is_admin');
  if (error) throw error;
  return data === true;
}

export function useAdminAuth(): AdminAuthState {
  const [state, setState] = useState<AdminAuthState>({
    user: null,
    isOrganizer: false,
    loading: true,
  });

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          if (mounted) setState({ user: null, isOrganizer: false, loading: false });
          return;
        }

        const isOrganizer = await resolveIsOrganizer(session.user);
        if (mounted) setState({ user: session.user, isOrganizer, loading: false });
      } catch {
        if (mounted) setState({ user: null, isOrganizer: false, loading: false });
      }
    }

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        if (mounted) setState({ user: null, isOrganizer: false, loading: false });
        return;
      }
      try {
        const isOrganizer = await resolveIsOrganizer(session.user);
        if (mounted) setState({ user: session.user, isOrganizer, loading: false });
      } catch {
        if (mounted) setState({ user: null, isOrganizer: false, loading: false });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
