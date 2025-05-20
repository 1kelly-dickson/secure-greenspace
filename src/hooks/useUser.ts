
import { useState, useEffect } from 'react';
import { useHookstate } from '@hookstate/core';
import { authState } from '@/state/auth';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types';

export default function useUser() {
  const auth = useHookstate(authState);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      const userId = auth.user.get()?.id;
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setProfile({
            id: data.id,
            email: data.email || '',
            fullName: data.full_name || '',
            username: data.username || '',
            avatarUrl: data.avatar_url
          });
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [auth.user]);

  return { profile, loading, error };
}
