import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, verifyAdminStatus, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdminVerified, setIsAdminVerified] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const checkAdmin = async () => {
      if (!isAuthenticated) {
        if (isMounted) {
          setIsAdminVerified(false);
          setIsVerifying(false);
        }
        return;
      }

      setIsVerifying(true);
      const verified = await verifyAdminStatus();
      if (isMounted) {
        setIsAdminVerified(verified);
        setIsVerifying(false);
      }
    };

    if (!isLoading) {
      checkAdmin();
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, isLoading, verifyAdminStatus, profile?.isAdmin]);

  if (isLoading || isVerifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#1A1816] text-[#FAF8F5] px-4">
        <div className="w-9 h-9 rounded-full border-2 border-white/15 border-t-tangerine animate-spin mb-4" />
        <p className="font-serif text-sm tracking-[0.2em] uppercase text-[#D4CDC3]">
          Authenticating Atelier Credentials...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    const destination = location.pathname + location.search + location.hash;
    return <Navigate to={`/admin/login?redirectTo=${encodeURIComponent(destination)}`} replace />;
  }

  if (!isAdminVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A1816] text-[#FAF8F5] px-4 py-16">
        <div className="max-w-md w-full bg-[#24211E] border border-white/10 rounded-3xl p-8 sm:p-10 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-6 border border-red-500/20">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <span className="text-[10px] uppercase tracking-[0.25em] text-red-400 font-semibold block mb-2">
            403 — Unauthorized Protocol
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-3">
            Atelier Access Restricted
          </h1>
          <p className="text-xs sm:text-sm text-[#A89F91] leading-relaxed mb-8 font-sans">
            Your authenticated session is registered as a customer patron account. Access to the administration console requires certified atelier managerial privileges.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/account')}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 py-3 px-6 rounded-full bg-tangerine hover:bg-tangerine/90 text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-md cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Account</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full sm:w-auto py-3 px-6 rounded-full border border-white/15 text-white/80 hover:text-white hover:bg-white/5 text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer"
            >
              Back to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
