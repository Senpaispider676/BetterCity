import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<void>;
  // Saved form draft across auth workflows
  pendingReportDraft: any | null;
  setPendingReportDraft: (draft: any | null) => void;
  // Auth modal control
  isAuthModalOpen: boolean;
  openAuthModal: (initialMode?: 'signin' | 'signup' | 'forgot') => void;
  closeAuthModal: () => void;
  authModalMode: 'signin' | 'signup' | 'forgot';
  setAuthModalMode: (mode: 'signin' | 'signup' | 'forgot') => void;
}

const LOCAL_USER_KEY = 'bettercity_auth_user';
const REPORT_DRAFT_KEY = 'bettercity_pending_report_draft';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  
  const [pendingReportDraft, setPendingReportDraftState] = useState<any | null>(() => {
    try {
      const stored = localStorage.getItem(REPORT_DRAFT_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const setPendingReportDraft = (draft: any | null) => {
    setPendingReportDraftState(draft);
    if (draft) {
      localStorage.setItem(REPORT_DRAFT_KEY, JSON.stringify(draft));
    } else {
      localStorage.removeItem(REPORT_DRAFT_KEY);
    }
  };

  const openAuthModal = (initialMode: 'signin' | 'signup' | 'forgot' = 'signin') => {
    setAuthModalMode(initialMode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const profile: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            display_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Citizen',
            avatar_url: session.user.user_metadata?.avatar_url,
            created_at: session.user.created_at,
          };
          setUser(profile);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
        }
        setIsLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const profile: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            display_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Citizen',
            avatar_url: session.user.user_metadata?.avatar_url,
            created_at: session.user.created_at,
          };
          setUser(profile);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
        } else {
          setUser(null);
          localStorage.removeItem(LOCAL_USER_KEY);
        }
        setIsLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password = ''): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { success: false, error: error.message };
        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            display_name: data.user.user_metadata?.full_name || email.split('@')[0],
            created_at: data.user.created_at,
          };
          setUser(profile);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Authentication failed' };
      }
    }

    // Local / Offline demo authentication
    const displayName = email.split('@')[0].replace(/[._]/g, ' ');
    const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
    const profile: UserProfile = {
      id: `usr-${Math.random().toString(36).substring(2, 9)}`,
      email,
      display_name: formattedName || 'Active Citizen',
      created_at: new Date().toISOString(),
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formattedName)}`,
    };
    setUser(profile);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
    return { success: true };
  };

  const register = async (name: string, email: string, password = ''): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });
        if (error) return { success: false, error: error.message };
        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            display_name: name,
            created_at: data.user.created_at,
          };
          setUser(profile);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Registration failed' };
      }
    }

    // Local / Offline demo registration
    const profile: UserProfile = {
      id: `usr-${Math.random().toString(36).substring(2, 9)}`,
      email,
      display_name: name,
      created_at: new Date().toISOString(),
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    };
    setUser(profile);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(LOCAL_USER_KEY);
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) return { success: false, error: error.message };
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }
    // Simulated reset email
    return { success: true };
  };

  const loginWithGoogle = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
    } else {
      // Demo Google Auth
      const demoUser: UserProfile = {
        id: 'usr-google-verified',
        email: 'citizen.delhi@gmail.com',
        display_name: 'Aditya Vardhan',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        created_at: new Date().toISOString(),
      };
      setUser(demoUser);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(demoUser));
      closeAuthModal();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        logout,
        resetPassword,
        loginWithGoogle,
        pendingReportDraft,
        setPendingReportDraft,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMode,
        setAuthModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
