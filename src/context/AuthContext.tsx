import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { RateLimiter } from '@/lib/auth/rateLimiter';

export interface CustomerProfile {
  id: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: 'customer' | 'admin' | 'concierge';
  isAdmin: boolean;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  profile: CustomerProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  role: 'customer' | 'admin' | 'concierge';
  signInWithPassword: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; needsEmailVerification?: boolean; error?: string }>;
  signInWithGoogle: (redirectTo?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  resendVerificationEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: { fullName?: string; avatarUrl?: string; phone?: string | null }) => Promise<{ success: boolean; error?: string }>;
  uploadAvatar: (file: File) => Promise<{ success: boolean; avatarUrl?: string; error?: string }>;
  verifyAdminStatus: () => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch or create profile from public.profiles
  const fetchProfile = useCallback(async (userId: string, userMetadata?: Record<string, unknown>) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('[Auth] Error fetching profile:', error.message);
        return null;
      }

      if (data) {
        const loadedProfile: CustomerProfile = {
          id: data.id,
          fullName: data.full_name,
          avatarUrl: data.avatar_url,
          role: (data.role as 'customer' | 'admin' | 'concierge') || 'customer',
          isAdmin: Boolean(data.is_admin || data.role === 'admin'),
          phone: data.phone || null,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
        setProfile(loadedProfile);
        return loadedProfile;
      }

      // If profile row doesn't exist yet (e.g. trigger delay), insert client-side using RLS INSERT
      const initialName = (userMetadata?.full_name as string) || (userMetadata?.name as string) || '';
      const initialAvatar = (userMetadata?.avatar_url as string) || (userMetadata?.picture as string) || null;

      const { data: newProfileData, error: insertError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          full_name: initialName,
          avatar_url: initialAvatar,
        })
        .select()
        .single();

      if (!insertError && newProfileData) {
        const createdProfile: CustomerProfile = {
          id: newProfileData.id,
          fullName: newProfileData.full_name,
          avatarUrl: newProfileData.avatar_url,
          role: (newProfileData.role as 'customer' | 'admin' | 'concierge') || 'customer',
          isAdmin: Boolean(newProfileData.is_admin || newProfileData.role === 'admin'),
          phone: newProfileData.phone || null,
          createdAt: newProfileData.created_at,
          updatedAt: newProfileData.updated_at,
        };
        setProfile(createdProfile);
        return createdProfile;
      }
    } catch (err) {
      console.warn('[Auth] Failed to load profile:', err);
    }
    return null;
  }, []);

  // Initialize and restore persistent session
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('[Auth] getSession error:', error.message);
        }

        if (isMounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          if (initialSession?.user) {
            await fetchProfile(initialSession.user.id, initialSession.user.user_metadata);
          }
        }
      } catch (err) {
        console.warn('[Auth] Session initialization error:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen to Auth State Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!isMounted) return;

      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id, currentSession.user.user_metadata);
        }
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
      }

      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // Sign In with Email & Password
  const signInWithPassword = useCallback(async (email: string, password: string) => {
    const throttle = RateLimiter.check('login', email, 5, 60000, 45);
    if (!throttle.allowed) {
      return { success: false, error: throttle.message };
    }

    try {
      RateLimiter.record('login', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        return { success: false, error: RateLimiter.sanitizeAuthError(error) };
      }

      RateLimiter.reset('login', email);
      setUser(data.user);
      setSession(data.session);
      if (data.user) {
        await fetchProfile(data.user.id, data.user.user_metadata);
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: RateLimiter.sanitizeAuthError(err) };
    }
  }, [fetchProfile]);

  // Sign Up with Email, Password & Full Name
  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    const throttle = RateLimiter.check('register', email, 3, 60000, 60);
    if (!throttle.allowed) {
      return { success: false, error: throttle.message };
    }

    try {
      RateLimiter.record('register', email);
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      const emailRedirectTo = `${origin}/auth/callback?type=signup`;

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            name: fullName.trim(),
          },
          emailRedirectTo,
        },
      });

      if (error) {
        return { success: false, error: RateLimiter.sanitizeAuthError(error) };
      }

      RateLimiter.reset('register', email);

      // If email confirmation is required, session might be null until user clicks link
      const needsEmailVerification = !data.session;
      if (data.user && data.session) {
        setUser(data.user);
        setSession(data.session);
        await fetchProfile(data.user.id, { full_name: fullName.trim() });
      }

      return { success: true, needsEmailVerification };
    } catch (err) {
      return { success: false, error: RateLimiter.sanitizeAuthError(err) };
    }
  }, [fetchProfile]);

  // Google OAuth Sign In
  const signInWithGoogle = useCallback(async (targetRedirect = '/account') => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      const redirectUri = `${origin}/auth/callback?redirectTo=${encodeURIComponent(targetRedirect)}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUri,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });

      if (error) {
        return { success: false, error: RateLimiter.sanitizeAuthError(error) };
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: RateLimiter.sanitizeAuthError(err) };
    }
  }, []);

  // Sign Out
  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('[Auth] SignOut error:', err);
    } finally {
      setUser(null);
      setProfile(null);
      setSession(null);
    }
  }, []);

  // Password Reset Email
  const resetPassword = useCallback(async (email: string) => {
    const throttle = RateLimiter.check('password_recovery', email, 3, 60000, 60);
    if (!throttle.allowed) {
      return { success: false, error: throttle.message };
    }

    try {
      RateLimiter.record('password_recovery', email);
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      const redirectTo = `${origin}/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo,
      });

      if (error) {
        return { success: false, error: RateLimiter.sanitizeAuthError(error) };
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: RateLimiter.sanitizeAuthError(err) };
    }
  }, []);

  // Update Password
  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { success: false, error: RateLimiter.sanitizeAuthError(error) };
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: RateLimiter.sanitizeAuthError(err) };
    }
  }, []);

  // Resend Email Verification
  const resendVerificationEmail = useCallback(async (email: string) => {
    const throttle = RateLimiter.check('resend_verification', email, 2, 60000, 60);
    if (!throttle.allowed) {
      return { success: false, error: throttle.message };
    }

    try {
      RateLimiter.record('resend_verification', email);
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      const emailRedirectTo = `${origin}/auth/callback?type=signup`;

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo,
        },
      });

      if (error) {
        return { success: false, error: RateLimiter.sanitizeAuthError(error) };
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: RateLimiter.sanitizeAuthError(err) };
    }
  }, []);

  // Update Customer Profile
  const updateProfile = useCallback(async (updates: { fullName?: string; avatarUrl?: string; phone?: string | null }) => {
    if (!user) {
      return { success: false, error: 'You must be logged in to update your profile.' };
    }

    try {
      const payload: { full_name?: string; avatar_url?: string; phone?: string | null } = {};
      if (updates.fullName !== undefined) payload.full_name = updates.fullName.trim();
      if (updates.avatarUrl !== undefined) payload.avatar_url = updates.avatarUrl;
      if (updates.phone !== undefined) {
        const cleanPhone = updates.phone ? updates.phone.trim() : null;
        if (cleanPhone && !/^\+?[0-9\s-]{10,15}$/.test(cleanPhone)) {
          return { success: false, error: 'Please enter a valid phone number (10 to 15 digits).' };
        }
        payload.phone = cleanPhone;
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      if (data) {
        setProfile({
          id: data.id,
          fullName: data.full_name,
          avatarUrl: data.avatar_url,
          role: (data.role as 'customer' | 'admin' | 'concierge') || 'customer',
          isAdmin: Boolean(data.is_admin || data.role === 'admin'),
          phone: data.phone || null,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        });
      }

      // Also update user metadata if full name changed
      if (updates.fullName) {
        await supabase.auth.updateUser({
          data: { full_name: updates.fullName.trim() },
        });
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to update profile.' };
    }
  }, [user]);

  // Upload Avatar to Supabase Storage
  const uploadAvatar = useCallback(async (file: File) => {
    if (!user) {
      return { success: false, error: 'You must be logged in to upload an avatar.' };
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return { success: false, error: 'Please upload a valid image (JPEG, PNG, or WebP).' };
    }

    if (file.size > 2 * 1024 * 1024) {
      return { success: false, error: 'Avatar image must be smaller than 2 MB.' };
    }

    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const filePath = `${user.id}/avatar-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        return { success: false, error: uploadError.message };
      }

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const avatarUrl = urlData.publicUrl;

      const result = await updateProfile({ avatarUrl });
      if (!result.success) {
        return { success: false, error: result.error };
      }

      return { success: true, avatarUrl };
    } catch (err) {
      return { success: false, error: 'Failed to upload avatar image.' };
    }
  }, [user, updateProfile]);

  // Verify Admin Status dynamically from Supabase
  const verifyAdminStatus = useCallback(async (): Promise<boolean> => {
    if (!user) return false;
    try {
      const { data, error } = await supabase.rpc('is_admin');
      if (error) {
        const { data: profileRow } = await supabase
          .from('profiles')
          .select('role, is_admin')
          .eq('id', user.id)
          .maybeSingle();
        return Boolean(profileRow?.is_admin || profileRow?.role === 'admin');
      }
      return Boolean(data);
    } catch {
      return false;
    }
  }, [user]);

  // Refresh Profile
  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id, user.user_metadata);
    }
  }, [user, fetchProfile]);

  const value = useMemo<AuthContextType>(() => ({
    user,
    profile,
    session,
    isLoading,
    isAuthenticated: Boolean(user && session),
    isAdmin: Boolean(profile?.isAdmin),
    role: profile?.role || 'customer',
    signInWithPassword,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    resendVerificationEmail,
    updateProfile,
    uploadAvatar,
    verifyAdminStatus,
    refreshProfile,
  }), [
    user,
    profile,
    session,
    isLoading,
    signInWithPassword,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    resendVerificationEmail,
    updateProfile,
    uploadAvatar,
    verifyAdminStatus,
    refreshProfile,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
