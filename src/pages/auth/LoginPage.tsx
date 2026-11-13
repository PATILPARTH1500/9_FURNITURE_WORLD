import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Link from '@/components/common/Link';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';

export const LoginPage: React.FC = () => {
  const { signInWithPassword, signInWithGoogle, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract destination from query or state
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirectTo') || '/account';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await signInWithPassword(email, password);
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Unable to sign in. Please check your credentials.');
    } else {
      navigate(redirectTo, { replace: true });
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsGoogleSubmitting(true);
    const result = await signInWithGoogle(redirectTo);
    if (!result.success) {
      setIsGoogleSubmitting(false);
      setErrorMessage(result.error || 'Failed to initialize Google authentication.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-cream px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group mb-3">
            <span className="font-serif text-2xl tracking-[0.08em] font-semibold text-checkerboard group-hover:text-tangerine transition-colors">
              {BRAND_CONFIG.name}
            </span>
            <span className="block text-[9px] uppercase tracking-[0.28em] text-[#666059] -mt-0.5">
              My Account
            </span>
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl text-checkerboard font-normal tracking-tight">
            Welcome Back
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#666059] font-sans">
            Sign in to manage your orders, saved addresses, and profile.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-[#FAF8F5] border border-[#1A1816]/10 rounded-3xl p-6 sm:p-8 shadow-[0_16px_40px_rgba(26,24,22,0.06)]">
          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200/80 text-red-800 text-xs flex items-start space-x-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleSubmitting || isSubmitting}
            className="w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-full border border-[#1A1816]/15 bg-white hover:bg-[#F5F2EB] text-checkerboard text-xs uppercase tracking-wider font-semibold transition-all duration-200 shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isGoogleSubmitting ? 'Connecting with Google...' : 'Continue with Google'}</span>
          </button>

          {/* Subtle Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="grow border-t border-[#1A1816]/10" />
            <span className="shrink-0 px-3 text-[10px] uppercase tracking-[0.2em] text-[#8C827A] bg-[#FAF8F5]">
              Or with email
            </span>
            <div className="grow border-t border-[#1A1816]/10" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-medium text-[#666059] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full bg-white border border-[#1A1816]/15 rounded-2xl px-4 py-3 pl-10 text-sm text-checkerboard placeholder:text-[#9E9891] focus:outline-hidden focus:border-tangerine focus:ring-1 focus:ring-tangerine transition-all"
                  autoComplete="email"
                />
                <Mail className="w-4 h-4 text-[#8C827A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] uppercase tracking-wider font-medium text-[#666059]">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-sans text-tangerine hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-white border border-[#1A1816]/15 rounded-2xl px-4 py-3 pl-10 pr-10 text-sm text-checkerboard placeholder:text-[#9E9891] focus:outline-hidden focus:border-tangerine focus:ring-1 focus:ring-tangerine transition-all"
                  autoComplete="current-password"
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

            <button
              type="submit"
              disabled={isSubmitting || isGoogleSubmitting}
              className="w-full mt-2 flex items-center justify-center space-x-2 py-3 px-6 rounded-full bg-checkerboard hover:bg-tangerine text-white text-xs uppercase tracking-wider font-semibold transition-all duration-300 shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? 'Logging in...' : 'Login'}</span>
              {!isSubmitting && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 pt-6 border-t border-[#1A1816]/10 text-center">
            <p className="text-xs text-[#666059]">
              Don&apos;t have an account yet?{' '}
              <Link
                href={`/register${redirectTo !== '/account' ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`}
                className="text-tangerine font-semibold hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
