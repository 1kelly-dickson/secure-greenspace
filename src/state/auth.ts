
import { hookstate } from '@hookstate/core';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  session: null,
  loading: true,
};

export const authState = hookstate<AuthState>(initialState);

export const initAuth = async () => {
  try {
    // Get session
    const { data } = await supabase.auth.getSession();
    
    if (data.session) {
      authState.set({
        user: data.session.user,
        session: data.session,
        loading: false,
      });
    } else {
      authState.set({
        user: null,
        session: null,
        loading: false,
      });
    }
  } catch (error) {
    console.error('Error initializing auth:', error);
    authState.set({
      user: null,
      session: null,
      loading: false,
    });
  }
  
  // Subscribe to auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      authState.set({
        user: session?.user ?? null,
        session,
        loading: false,
      });
    }
  );
  
  return () => {
    subscription.unsubscribe();
  };
};

export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error signing up:', error);
    return { success: false, error };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error signing in:', error);
    return { success: false, error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false, error };
  }
};
