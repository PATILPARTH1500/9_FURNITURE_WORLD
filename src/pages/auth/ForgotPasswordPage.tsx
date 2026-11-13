import React, { useState, useEffect } from 'react';
import Link from '@/components/common/Link';
import { useAuth } from '@/context/AuthContext';
import { Mail, ArrowRight, AlertCircle, CheckCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';

export const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successSubmitted, setSuccessSubmitted] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please provide your account email address.');
      return;
    }

    setIsSubmitting(true);
    const result = await resetPassword(email);
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Failed to send recovery instructions.');
    } else {
      setSuccessSubmitted(true);
      setCooldown(60);
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
              Account Recovery
            </span>
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl text-checkerboard font-normal tracking-tight">
            Reset Password
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#666059] font-sans">
            Enter your email to receive secure recovery instructions.
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#FAF8F5] border border-[#1A1816]/10 rounded-3xl p-6 sm:p-8 shadow-[0_16px_40px_rgba(26,24,22,0.06)]">
          {successSubmitted ? (
            <div className="text-center py-4 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-green-50 text-green-700 flex items-center justify-center mx-auto mb-5 border border-green-200">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h2 className="font-serif text-2xl text-checkerboard mb-2">Instructions Dispatched</h2>
              <p className="text-xs sm:text-sm text-[#666059] leading-relaxed mb-6 font-sans">
                If an account exists for <span className="font-semibold text-checkerboard">{email}</span>,
                you will receive an email containing a secure link to reset your password.
              </p>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || cooldown > 0}
                  className="w-full inline-flex items-center justify-center space-x-2 py-3 px-5 rounded-full border border-[#1A1816]/20 bg-white hover:bg-[#F5F2EB] text-checkerboard text-xs uppercase tracking-wider font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-tangerine" />
                  <span>
                    {cooldown > 0 ? `Resend link in ${cooldown}s` : 'Resend Recovery Email'}
                  </span>
                </button>

                <Link
                  href="/login"
                  className="inline-flex items-center justify-center space-x-1.5 w-full py-2.5 text-xs text-[#666059] hover:text-checkerboard transition-colors font-sans"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
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
                  Account Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="architect@atelier.com"
                    className="w-full bg-white border border-[#1A1816]/15 rounded-2xl px-4 py-3 pl-10 text-sm text-checkerboard placeholder:text-[#9E9891] focus:outline-hidden focus:border-tangerine focus:ring-1 focus:ring-tangerine transition-all"
                    autoComplete="email"
                  />
                  <Mail className="w-4 h-4 text-[#8C827A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 flex items-center justify-center space-x-2 py-3 px-6 rounded-full bg-checkerboard hover:bg-tangerine text-white text-xs uppercase tracking-wider font-semibold transition-all duration-300 shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{isSubmitting ? 'Sending Link...' : 'Send Recovery Link'}</span>
                {!isSubmitting && <ArrowRight className="w-3.5 h-3.5" />}
              </button>

              <div className="mt-6 pt-4 border-t border-[#1A1816]/10 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center space-x-1.5 text-xs text-[#666059] hover:text-checkerboard transition-colors font-sans"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
