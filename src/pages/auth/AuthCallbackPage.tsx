import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Link from '@/components/common/Link';
import { supabase } from '@/lib/supabase/client';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';

export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Validating credentials and establishing session...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, '?'));

        // Check for error in query or hash (e.g., user cancelled Google OAuth)
        const error = searchParams.get('error') || hashParams.get('error');
        const errorDescription = searchParams.get('error_description') || hashParams.get('error_description');

        if (error) {
          if (error === 'access_denied') {
            setErrorMessage('Authentication was cancelled. You may try again whenever you are ready.');
          } else {
            setErrorMessage(errorDescription || 'Authentication callback failed.');
          }
          return;
        }

        // Intended destination
        const redirectTo = searchParams.get('redirectTo') || '/account';

        // Check if there is an authorization code to exchange (PKCE flow)
        const code = searchParams.get('code');
        if (code) {
          setStatusMessage('Exchanging authorization code...');
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.error('[AuthCallback] Exchange error:', exchangeError.message);
            setErrorMessage('The authorization session has expired or is invalid. Please sign in again.');
            return;
          }

          if (data.session?.user) {
            // Verify or upsert profile
            const user = data.session.user;
            await supabase
              .from('profiles')
              .upsert({
                id: user.id,
                full_name: (user.user_metadata?.full_name as string) || (user.user_metadata?.name as string) || '',
                avatar_url: (user.user_metadata?.avatar_url as string) || (user.user_metadata?.picture as string) || null,
              })
              .select();

            navigate(redirectTo, { replace: true });
            return;
          }
        }

        // Check for hash parameters (implicit / token flow fallback)
        const accessToken = hashParams.get('access_token');
        if (accessToken) {
          setStatusMessage('Processing authentication token...');
          const { data, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) {
            setErrorMessage(sessionError.message);
            return;
          }

          if (data.session) {
            navigate(redirectTo, { replace: true });
            return;
          }
        }

        // Check existing session as last verification
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate(redirectTo, { replace: true });
        } else {
          // If no code, no token, and no session
          setTimeout(async () => {
            const { data: { session: retrySession } } = await supabase.auth.getSession();
            if (retrySession) {
              navigate(redirectTo, { replace: true });
            } else {
              setErrorMessage('Authentication could not be established. Please try signing in again.');
            }
          }, 1200);
        }
      } catch (err: unknown) {
        console.error('[AuthCallback] Unexpected error:', err);
        setErrorMessage('An unexpected error occurred during authentication.');
      }
    };

    handleAuthCallback();
  }, [location, navigate]);

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-cream px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="w-full max-w-md bg-[#FAF8F5] border border-[#1A1816]/10 rounded-3xl p-8 sm:p-10 shadow-[0_16px_40px_rgba(26,24,22,0.06)] text-center animate-fadeIn">
        {errorMessage ? (
          <div>
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-200">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h2 className="font-serif text-2xl text-checkerboard mb-2">Authentication Notice</h2>
            <p className="text-xs sm:text-sm text-[#666059] leading-relaxed mb-6 font-sans">
              {errorMessage}
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center space-x-2 py-3 px-6 rounded-full bg-checkerboard hover:bg-tangerine text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-md"
            >
              <span>Return to Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div>
            <div className="w-12 h-12 rounded-full border-2 border-checkerboard/15 border-t-tangerine animate-spin mx-auto mb-5" />
            <span className="font-serif text-lg tracking-[0.06em] text-checkerboard font-semibold block mb-1">
              {BRAND_CONFIG.name}
            </span>
            <p className="text-xs sm:text-sm text-[#666059] font-sans">
              {statusMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallbackPage;
