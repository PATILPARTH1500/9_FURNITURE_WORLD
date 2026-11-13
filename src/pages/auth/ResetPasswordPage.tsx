import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Link from '@/components/common/Link';
import { useAuth } from '@/context/AuthContext';
import { Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';
import { supabase } from '@/lib/supabase/client';

export const ResetPasswordPage: React.FC = () => {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasValidSession, setHasValidSession] = useState<boolean | null>(null);

  // Check if hash has error or user is in valid recovery session
  useEffect(() => {
    const checkRecoverySession = async () => {
      // Check URL hash for Supabase error parameters
      const hash = window.location.hash;
      if (hash && hash.includes('error=')) {
        const params = new URLSearchParams(hash.replace('#', '?'));
        const errorDesc = params.get('error_description') || 'Invalid or expired password reset link.';
        setErrorMessage(decodeURIComponent(errorDesc).replace(/\+/g, ' '));
        setHasValidSession(false);
        return;
      }

      // Check current session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setHasValidSession(true);
      } else {
        // Wait briefly for auth listener to complete hash processing
        setTimeout(async () => {
          const { data: { session: retrySession } } = await supabase.auth.getSession();
          setHasValidSession(Boolean(retrySession));
          if (!retrySession) {
            setErrorMessage('Your password recovery link is expired or invalid. Please request a new one.');
          }
        }, 1000);
      }
    };

    checkRecoverySession();
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password.length < 8) {
      setErrorMessage('New password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify both fields.');
      return;
    }

    setIsSubmitting(true);
    const result = await updatePassword(password);
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Failed to update your password.');
    } else {
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/account', { replace: true });
      }, 2500);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-cream px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group mb-3">
            <span className="font-serif text-2xl tracking-[0.08em] font-semibold text-checkerboard group-hover:text-tangerine transition-colors">
              {BRAND_CONFIG.name}
            </span>
            <span className="block text-[9px] uppercase tracking-[0.28em] text-[#666059] -mt-0.5">
              Security Protocol
            </span>
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl text-checkerboard font-normal tracking-tight">
            Set New Password
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#666059] font-sans">
            Create a strong, secure passphrase for your account.
          </p>
        </div>

        <div className="bg-[#FAF8F5] border border-[#1A1816]/10 rounded-3xl p-6 sm:p-8 shadow-[0_16px_40px_rgba(26,24,22,0.06)]">
          {isSuccess ? (
            <div className="text-center py-4 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-green-50 text-green-700 flex items-center justify-center mx-auto mb-4 border border-green-200">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h2 className="font-serif text-2xl text-checkerboard mb-2">Password Updated</h2>
              <p className="text-xs sm:text-sm text-[#666059] mb-4 font-sans">
                Your credentials have been securely updated. Redirecting to your account dashboard...
              </p>
              <div className="w-5 h-5 rounded-full border-2 border-checkerboard/20 border-t-tangerine animate-spin mx-auto" />
            </div>
          ) : hasValidSession === false ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-200">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h2 className="font-serif text-2xl text-checkerboard mb-2">Invalid or Expired Link</h2>
              <p className="text-xs sm:text-sm text-[#666059] mb-6 font-sans">
                {errorMessage || 'This password reset link has expired or has already been used.'}
              </p>
              <Link
                href="/forgot-password"
                className="inline-flex items-center justify-center space-x-2 py-3 px-6 rounded-full bg-checkerboard hover:bg-tangerine text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-md"
              >
                <span>Request New Link</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200/80 text-red-800 text-xs flex items-start space-x-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-medium text-[#666059] mb-1.5">
                  New Password (min 8 characters)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-white border border-[#1A1816]/15 rounded-2xl px-4 py-3 pl-10 pr-10 text-sm text-checkerboard placeholder:text-[#9E9891] focus:outline-hidden focus:border-tangerine focus:ring-1 focus:ring-tangerine transition-all"
                    autoComplete="new-password"
                  />
                  <Lock className="w-4 h-4 text-[#8C827A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C827A] hover:text-checkerboard transition-colors p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-medium text-[#666059] mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-white border border-[#1A1816]/15 rounded-2xl px-4 py-3 pl-10 pr-10 text-sm text-checkerboard placeholder:text-[#9E9891] focus:outline-hidden focus:border-tangerine focus:ring-1 focus:ring-tangerine transition-all"
                    autoComplete="new-password"
                  />
                  <Lock className="w-4 h-4 text-[#8C827A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C827A] hover:text-checkerboard transition-colors p-1"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 flex items-center justify-center space-x-2 py-3 px-6 rounded-full bg-checkerboard hover:bg-tangerine text-white text-xs uppercase tracking-wider font-semibold transition-all duration-300 shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{isSubmitting ? 'Updating...' : 'Update Password'}</span>
                {!isSubmitting && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
