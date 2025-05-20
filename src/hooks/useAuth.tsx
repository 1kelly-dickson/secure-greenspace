
import { useEffect } from 'react';
import { authState, initAuth } from '@/state/auth';
import { useHookstate } from '@hookstate/core';

export const useAuth = () => {
  const auth = useHookstate(authState);
  
  useEffect(() => {
    const initializeAuth = async () => {
      const cleanup = await initAuth();
      return cleanup;
    };
    
    const cleanupPromise = initializeAuth();
    
    return () => {
      cleanupPromise.then(cleanup => cleanup());
    };
  }, []);

  return {
    user: auth.user.get(),
    session: auth.session.get(),
    loading: auth.loading.get(),
  };
};

export default useAuth;
