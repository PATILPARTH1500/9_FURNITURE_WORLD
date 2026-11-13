import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Link from '@/components/common/Link';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase/client';
import {
  ShieldCheck,
  Users,
  MapPin,
  Package,
  Database,
  LogOut,
  ArrowLeft,
  Activity,
  RefreshCw,
} from 'lucide-react';

export const AdminDashboardEntryPage: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<{
    profileCount: number | null;
    addressCount: number | null;
    orderCount: number | null;
    isLoading: boolean;
    error: string | null;
  }>({
    profileCount: null,
    addressCount: null,
    orderCount: null,
    isLoading: true,
    error: null,
  });

  const loadAdminTelemetry = async () => {
    setStats((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const [profilesRes, addressesRes, ordersRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('addresses').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
      ]);

      if (profilesRes.error || addressesRes.error || ordersRes.error) {
        const err = profilesRes.error || addressesRes.error || ordersRes.error;
        setStats({
          profileCount: null,
          addressCount: null,
          orderCount: null,
          isLoading: false,
          error: err?.message || 'Failed to read database records.',
        });
        return;
      }

      setStats({
        profileCount: profilesRes.count ?? 0,
        addressCount: addressesRes.count ?? 0,
        orderCount: ordersRes.count ?? 0,
        isLoading: false,
        error: null,
      });
    } catch {
      setStats((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Unable to query administrative telemetry.',
      }));
    }
  };

  useEffect(() => {
    loadAdminTelemetry();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#141210] text-[#FAF8F5] py-10 px-4 sm:px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-white/10 mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-tangerine/10 border border-tangerine/30 flex items-center justify-center text-tangerine">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-serif text-2xl text-white font-normal">
                  Atelier Control Perimeter
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[10px] uppercase font-semibold tracking-wider">
                  Admin Verified
                </span>
              </div>
              <p className="text-xs text-[#A89F91] font-sans">
                PostgreSQL 17.11 Verified RLS Enforced • Supabase Project <code className="text-white/80">plixtrmiidhxiybgujdb</code>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="inline-flex items-center space-x-1.5 py-2 px-4 rounded-full border border-white/15 text-xs text-[#C4BCB1] hover:text-white hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Storefront</span>
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center space-x-1.5 py-2 px-4 rounded-full border border-red-500/20 bg-red-950/30 hover:bg-red-950/60 text-red-300 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Administrator Identity Card */}
        <div className="bg-[#1C1A18] border border-white/10 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-tangerine text-white font-serif text-2xl flex items-center justify-center font-bold shadow-lg">
                {(profile?.fullName || user?.email || 'A')[0].toUpperCase()}
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-tangerine font-semibold block mb-1">
                  Verified Administrator
                </span>
                <h2 className="font-serif text-2xl text-white">
                  {profile?.fullName || 'Atelier Staff Operator'}
                </h2>
                <p className="text-xs text-[#A89F91] mt-0.5">{user?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 text-xs">
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-[#8C827A]">
                  Database Role
                </span>
                <span className="text-white font-semibold uppercase tracking-wider mt-0.5 block">
                  {profile?.role || 'admin'}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-[#8C827A]">
                  Privilege Status
                </span>
                <span className="text-emerald-400 font-semibold mt-0.5 block">
                  is_admin: true
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="block text-[10px] uppercase tracking-wider text-[#8C827A]">
                  Authorization Boundary
                </span>
                <span className="text-white font-mono text-[11px] mt-0.5 block truncate max-w-[120px]">
                  {user?.id}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Admin Telemetry Cards */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-tangerine" />
              <h3 className="font-serif text-lg text-white">
                Live Administrative RLS Telemetry
              </h3>
            </div>
            <button
              type="button"
              onClick={loadAdminTelemetry}
              disabled={stats.isLoading}
              className="inline-flex items-center space-x-1.5 text-xs text-[#A89F91] hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${stats.isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Metrics</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-[#1C1A18] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between text-[#8C827A] mb-3">
                <span className="text-xs uppercase tracking-wider font-medium">Customer Profiles</span>
                <Users className="w-4 h-4 text-tangerine" />
              </div>
              <div className="text-3xl font-serif text-white">
                {stats.isLoading ? '...' : (stats.profileCount ?? '0')}
              </div>
              <p className="text-[11px] text-[#8C827A] mt-2">
                Accessible via <code className="text-white/60">is_admin()</code> RLS bypass
              </p>
            </div>

            <div className="bg-[#1C1A18] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between text-[#8C827A] mb-3">
                <span className="text-xs uppercase tracking-wider font-medium">Residence Addresses</span>
                <MapPin className="w-4 h-4 text-tangerine" />
              </div>
              <div className="text-3xl font-serif text-white">
                {stats.isLoading ? '...' : (stats.addressCount ?? '0')}
              </div>
              <p className="text-[11px] text-[#8C827A] mt-2">
                Indian address registry entries
              </p>
            </div>

            <div className="bg-[#1C1A18] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between text-[#8C827A] mb-3">
                <span className="text-xs uppercase tracking-wider font-medium">Bespoke Orders</span>
                <Package className="w-4 h-4 text-tangerine" />
              </div>
              <div className="text-3xl font-serif text-white">
                {stats.isLoading ? '...' : (stats.orderCount ?? '0')}
              </div>
              <p className="text-[11px] text-[#8C827A] mt-2">
                Restricted client INSERT architecture
              </p>
            </div>
          </div>
        </div>

        {/* Phase 04 Roadmap Preview */}
        <div className="bg-gradient-to-br from-[#1C1A18] to-[#221F1C] border border-white/10 rounded-3xl p-6 sm:p-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-tangerine/10 border border-tangerine/30 flex items-center justify-center text-tangerine shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-tangerine font-semibold block mb-1">
                Roadmap Architecture
              </span>
              <h3 className="font-serif text-xl text-white mb-2">
                Phase 04 Admin Suite Integration
              </h3>
              <p className="text-xs sm:text-sm text-[#A89F91] leading-relaxed max-w-3xl mb-4 font-sans">
                Phase 02 delivers the rock-solid RBAC foundation, cryptographic route protection, customer address registry, and storage security. The complete management interface (Product catalog editor, inventory level adjustment, order status dispatcher, and analytics) will be activated in Phase 04.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-white font-medium block">1. Catalog Management</span>
                  <span className="text-[11px] text-[#8C827A]">Furniture specs & media</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-white font-medium block">2. Inventory Sync</span>
                  <span className="text-[11px] text-[#8C827A]">Warehouse allocations</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-white font-medium block">3. Order Fulfillment</span>
                  <span className="text-[11px] text-[#8C827A]">Tracking & status flow</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-white font-medium block">4. Audit Surveillance</span>
                  <span className="text-[11px] text-[#8C827A]">Admin activity telemetry</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardEntryPage;
