import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupaUser } from '@supabase/supabase-js';

export type UserRole = 'user' | 'provider' | 'admin';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  status: string;
  createdAt: string;
}

interface AuthContextType {
  currentUser: AppUser | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, phone: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleOverride, setRoleOverride] = useState<UserRole | null>(null);
  const roleOverrideRef = useRef<UserRole | null>(null);

  const fetchProfile = async (supaUser: SupaUser): Promise<AppUser | null> => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supaUser.id)
      .single();

    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', supaUser.id);

    const role = roleOverrideRef.current || (roles?.[0]?.role as UserRole) || 'user';

    if (profile) {
      return {
        id: profile.id,
        name: profile.name || '',
        email: profile.email || supaUser.email || '',
        phone: profile.phone || '',
        role,
        avatar: profile.avatar_url || undefined,
        status: profile.status || 'active',
        createdAt: profile.created_at || '',
      };
    }
    return null;
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        setTimeout(async () => {
          const user = await fetchProfile(session.user);
          setCurrentUser(user);
          setLoading(false);
        }, 0);
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const user = await fetchProfile(session.user);
        setCurrentUser(user);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return !error;
  };

  const signup = async (name: string, email: string, phone: string, password: string, role: UserRole): Promise<boolean> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone, role },
        emailRedirectTo: window.location.origin,
      },
    });
    return !error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setRoleOverride(null);
  };

  const switchRole = (role: UserRole) => {
    roleOverrideRef.current = role;
    setRoleOverride(role);
    if (currentUser) {
      setCurrentUser({ ...currentUser, role });
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, session, loading, login, signup, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
