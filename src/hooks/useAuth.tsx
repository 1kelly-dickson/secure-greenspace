
import { useEffect } from 'react';
import { useState as useHookState } from '@hookstate/core';
import { authState, initAuth } from '@/state/auth';

export function useAuth() {
  const auth = useHookState(authState);
  
  useEffect(() => {
    const cleanup = initAuth();
    return cleanup;
  }, []);
  
  return {
    user: auth.user.get(),
    session: auth.session.get(),
    loading: auth.loading.get(),
    isAuthenticated: !!auth.user.get(),
  };
}
