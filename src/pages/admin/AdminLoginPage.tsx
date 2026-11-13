import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Link from '@/components/common/Link';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, Shield, AlertCircle, ArrowLeft } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { user, isAuthenticated, isAdmin, signInWithPassword, signOut, verifyAdminStatus } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const redirectTo = searchParams.get('redirectTo') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already authenticated and admin, redirect to destination
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signInWithPassword(email, password);

      if (!result.success) {
        setIsSubmitting(false);
        setErrorMessage(result.error || 'Authentication failed. Please verify credentials.');
        return;
      }

      // Verify admin status from database
      const verification = await verifyAdminStatus();

      if (!verification.isAdmin) {
        await signOut();
        setIsSubmitting(false);
        setErrorMessage(verification.error || 'Access Denied: This account does not have administrator privileges.');
        return;
      }

      setIsSubmitting(false);
      navigate(redirectTo, { replace: true });
    } catch {
      setIsSubmitting(false);
      setErrorMessage('An unexpected error occurred during login.');
    }
  };

  return (
    <div className="min-h-screen bg-[#141210] text-[#FAF8F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Top return link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#A89F91] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Store</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-tangerine shadow-inner">
            <Shield className="w-7 h-7" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-tangerine font-semibold block mb-2">
            Admin Access Only
          </span>
          <h1 className="font-serif text-3xl text-white font-normal tracking-tight">
            Admin Login
          </h1>
          <p className="mt-2 text-xs text-[#A89F91] font-sans">
            Sign in to manage products, orders, and customer accounts
          </p>
        </div>

        {/* Card */}
        <div className="mt-8 bg-[#1C1A18] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_24px_50px_rgba(0,0,0,0.5)]">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-red-950/50 border border-red-800/40 text-red-300 text-xs flex items-start space-x-3">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {isAuthenticated && !isAdmin && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-800/40 text-amber-200 text-xs">
              <p className="font-semibold mb-1">Currently signed in as customer:</p>
              <p className="text-[#C4BCB1]">{user?.email}</p>
              <p className="mt-2 text-[11px] text-amber-300/80">
                To access the admin panel, please sign in with an administrator account.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-medium text-[#C4BCB1] mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@furniturevillage.com"
                  className="w-full bg-[#141210] border border-white/15 rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder-white/20 focus:outline-hidden focus:border-tangerine transition-colors"
                />
                <Mail className="w-4 h-4 text-white/30 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-medium text-[#C4BCB1] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-[#141210] border border-white/15 rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder-white/20 focus:outline-hidden focus:border-tangerine transition-colors"
                />
                <Lock className="w-4 h-4 text-white/30 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl bg-tangerine hover:bg-tangerine/90 text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-lg hover:shadow-tangerine/20 disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Verifying Account...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Login to Admin Panel</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center text-[11px] text-[#A89F91]">
            <span>All admin actions are recorded for security.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
