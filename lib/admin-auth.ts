'use client';

import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export type AdminAuthState = {
  user: User | null;
  isOrganizer: boolean;
  loading: boolean;
};

async function resolveIsOrganizer(user: User): Promise<boolean> {
  // Check admin_users table first (email-based, covers super_admin + admin roles)
  const { data: adminRow } = await supabase
    .from('admin_users')
    .select('role')
    .eq('email', user.email)
    .maybeSingle();
  if (adminRow?.role) return true;

  // Fall back to rcc_organizers (user_id-based)
  const { data: organizer } = await supabase
    .from('rcc_organizers')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();
  return !!organizer;
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
