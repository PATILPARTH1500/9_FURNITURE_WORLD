import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Link from '@/components/common/Link';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Lock, Mail, User as UserIcon, ArrowRight, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';

export const RegisterPage: React.FC = () => {
  const { signUp, signInWithGoogle, resendVerificationEmail, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirectTo') || '/account';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  // Email verification state
  const [verificationPending, setVerificationPending] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, redirectTo]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters in length.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);
    const result = await signUp(email, password, fullName);
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Failed to register account.');
    } else {
      if (result.needsEmailVerification) {
        setRegisteredEmail(email.trim().toLowerCase());
        setVerificationPending(true);
        setResendCooldown(60);
      } else {
        navigate(redirectTo, { replace: true });
      }
    }
  };

  const handleGoogleSignUp = async () => {
    setErrorMessage(null);
    setIsGoogleSubmitting(true);
    const result = await signInWithGoogle(redirectTo);
    if (!result.success) {
      setIsGoogleSubmitting(false);
      setErrorMessage(result.error || 'Failed to initialize Google authentication.');
    }
  };

  const handleResendVerification = async () => {
    if (resendCooldown > 0) return;
    setResendSuccess(null);
    setErrorMessage(null);

    const result = await resendVerificationEmail(registeredEmail);
    if (result.success) {
      setResendSuccess('A fresh verification link has been sent to your email.');
      setResendCooldown(60);
    } else {
      setErrorMessage(result.error || 'Unable to resend verification email.');
    }
  };

  // If email verification confirmation screen is active
  if (verificationPending) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-cream px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="w-full max-w-md bg-[#FAF8F5] border border-[#1A1816]/10 rounded-3xl p-8 sm:p-10 shadow-[0_16px_40px_rgba(26,24,22,0.06)] text-center animate-fadeIn">
          <div className="w-14 h-14 rounded-full bg-tangerine/10 text-tangerine flex items-center justify-center mx-auto mb-6">
            <Mail className="w-7 h-7" />
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl text-checkerboard font-normal mb-2">
            Confirm Your Email
          </h2>

          <p className="text-xs sm:text-sm text-[#666059] leading-relaxed mb-6 font-sans">
            We have sent a verification invitation to{' '}
            <span className="font-semibold text-checkerboard">{registeredEmail}</span>.
            Please click the link inside to activate your Furniture World customer account.
          </p>

          {resendSuccess && (
            <div className="mb-6 p-3 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-xs flex items-center justify-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
              <span>{resendSuccess}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={resendCooldown > 0}
              className="w-full inline-flex items-center justify-center space-x-2 py-3 px-5 rounded-full border border-[#1A1816]/20 bg-white hover:bg-[#F5F2EB] text-checkerboard text-xs uppercase tracking-wider font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resendCooldown > 0 ? '' : 'text-tangerine'}`} />
              <span>
                {resendCooldown > 0
                  ? `Resend available in ${resendCooldown}s`
                  : 'Resend Verification Email'}
              </span>
            </button>

            <Link
              href="/login"
              className="block w-full py-2.5 text-xs text-[#666059] hover:text-checkerboard transition-colors font-sans"
            >
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-cream px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      <div className="w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group mb-3">
            <span className="font-serif text-2xl tracking-[0.08em] font-semibold text-checkerboard group-hover:text-tangerine transition-colors">
              {BRAND_CONFIG.name}
            </span>
            <span className="block text-[9px] uppercase tracking-[0.28em] text-[#666059] -mt-0.5">
              Create Account
            </span>
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl text-checkerboard font-normal tracking-tight">
            Create Account
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#666059] font-sans">
            Join Furniture Village for easy ordering and saved addresses.
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
            onClick={handleGoogleSignUp}
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
            <span>{isGoogleSubmitting ? 'Connecting with Google...' : 'Sign up with Google'}</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="grow border-t border-[#1A1816]/10" />
            <span className="shrink-0 px-3 text-[10px] uppercase tracking-[0.2em] text-[#8C827A] bg-[#FAF8F5]">
              Or with email
            </span>
            <div className="grow border-t border-[#1A1816]/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-medium text-[#666059] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-white border border-[#1A1816]/15 rounded-2xl px-4 py-3 pl-10 text-sm text-checkerboard placeholder:text-[#9E9891] focus:outline-hidden focus:border-tangerine focus:ring-1 focus:ring-tangerine transition-all"
                  autoComplete="name"
                />
                <UserIcon className="w-4 h-4 text-[#8C827A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

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
              <label className="block text-[11px] uppercase tracking-wider font-medium text-[#666059] mb-1.5">
                Password (min 8 characters)
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
                Confirm Password
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
              disabled={isSubmitting || isGoogleSubmitting}
              className="w-full mt-3 flex items-center justify-center space-x-2 py-3 px-6 rounded-full bg-checkerboard hover:bg-tangerine text-white text-xs uppercase tracking-wider font-semibold transition-all duration-300 shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
              {!isSubmitting && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 pt-6 border-t border-[#1A1816]/10 text-center">
            <p className="text-xs text-[#666059]">
              Already have an account?{' '}
              <Link
                href={`/login${redirectTo !== '/account' ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`}
                className="text-tangerine font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
