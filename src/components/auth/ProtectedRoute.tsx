import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-cream px-4">
        <div className="w-8 h-8 rounded-full border-2 border-checkerboard/15 border-t-tangerine animate-spin mb-4" />
        <p className="font-serif text-sm tracking-widest uppercase text-[#666059]">
          Verifying Customer Credentials...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Preserve intended destination via query param
    const destination = location.pathname + location.search + location.hash;
    return <Navigate to={`/login?redirectTo=${encodeURIComponent(destination)}`} replace />;
  }

  return <>{children}</>;
};
