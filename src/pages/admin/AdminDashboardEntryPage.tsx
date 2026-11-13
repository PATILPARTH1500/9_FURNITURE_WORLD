import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Link from '@/components/common/Link';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { AdminProductManagement } from '@/components/admin/AdminProductManagement';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Boxes,
  Users,
  Settings,
  Search,
  RefreshCw,
  LogOut,
  Store,
  Clock,
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
  ShieldCheck,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
  Building2,
} from 'lucide-react';

export type AdminTab =
  | 'overview'
  | 'products'
  | 'orders'
  | 'inventory'
  | 'customers'
  | 'settings';

export type DateFilter = 'today' | '7days' | 'month' | 'year';

interface OrderRecord {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_email: string | null;
  status: string;
  total_amount: number;
  currency: string;
  created_at: string;
  payment_method?: string | null;
}

interface ProductRecord {
  id: string;
  name: string;
  slug: string;
  base_price: number;
  is_published: boolean;
  created_at: string;
}

interface InventoryRecord {
  id: string;
  variant_id: string;
  quantity_available: number;
  quantity_reserved: number;
  restock_threshold: number;
}

interface CustomerProfileRecord {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: string | null;
  created_at: string;
  avatar_url: string | null;
  is_admin?: boolean | null;
}

const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const AdminDashboardEntryPage: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab navigation bound to ?tab=... (valid tabs: overview, products, orders, inventory, customers, settings)
  const rawTab = searchParams.get('tab') as AdminTab;
  const activeTab: AdminTab = ['overview', 'products', 'orders', 'inventory', 'customers', 'settings'].includes(rawTab)
    ? rawTab
    : 'overview';

  const setActiveTab = (tab: AdminTab) => {
    setSearchParams({ tab });
    setIsMobileMenuOpen(false);
  };

  // Date filter state
  const [dateFilter, setDateFilter] = useState<DateFilter>('month');

  // Mobile sidebar drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Live database data state
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [inventory, setInventory] = useState<InventoryRecord[]>([]);
  const [customers, setCustomers] = useState<CustomerProfileRecord[]>([]);

  // User search query state
  const [customerSearch, setCustomerSearch] = useState('');

  // Load live Supabase data
  const loadDashboardData = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const [ordersRes, productsRes, inventoryRes, profilesRes] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('inventory').select('*'),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      ]);

      if (ordersRes.error) console.warn('[Admin] Orders fetch note:', ordersRes.error.message);
      if (productsRes.error) console.warn('[Admin] Products fetch note:', productsRes.error.message);
      if (inventoryRes.error) console.warn('[Admin] Inventory fetch note:', inventoryRes.error.message);
      if (profilesRes.error) console.warn('[Admin] Profiles fetch note:', profilesRes.error.message);

      setOrders((ordersRes.data as OrderRecord[]) || []);
      setProducts((productsRes.data as ProductRecord[]) || []);
      setInventory((inventoryRes.data as InventoryRecord[]) || []);
      setCustomers((profilesRes.data as CustomerProfileRecord[]) || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to connect to live store records.';
      setFetchError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  // Filter orders by date range
  const filteredOrders = useMemo(() => {
    if (!orders.length) return [];
    const now = new Date();

    return orders.filter((order) => {
      const orderDate = new Date(order.created_at);
      if (isNaN(orderDate.getTime())) return true;

      switch (dateFilter) {
        case 'today': {
          const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          return orderDate >= todayStart;
        }
        case '7days': {
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return orderDate >= sevenDaysAgo;
        }
        case 'month': {
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          return orderDate >= monthStart;
        }
        case 'year': {
          const yearStart = new Date(now.getFullYear(), 0, 1);
          return orderDate >= yearStart;
        }
        default:
          return true;
      }
    });
  }, [orders, dateFilter]);

  // Derived Business Metrics
  const totalSales = useMemo(() => {
    return filteredOrders.reduce((acc, order) => {
      return acc + (Number(order.total_amount) || 0);
    }, 0);
  }, [filteredOrders]);

  const totalOrdersCount = filteredOrders.length;
  const pendingOrdersCount = useMemo(() => {
    return filteredOrders.filter(
      (o) => o.status === 'pending' || o.status === 'processing' || o.status === 'unfulfilled'
    ).length;
  }, [filteredOrders]);

  const completedOrdersCount = useMemo(() => {
    return filteredOrders.filter(
      (o) => o.status === 'completed' || o.status === 'delivered' || o.status === 'shipped'
    ).length;
  }, [filteredOrders]);

  const totalProductsCount = products.length;
  const activeProductsCount = products.filter((p) => p.is_published).length;

  const lowStockCount = useMemo(() => {
    return inventory.filter(
      (i) => (i.quantity_available || 0) <= (i.restock_threshold ?? 5)
    ).length;
  }, [inventory]);

  const totalCustomersCount = customers.length;

  // Filtered users for Customers tab
  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return customers;
    const query = customerSearch.toLowerCase();
    return customers.filter(
      (c) =>
        (c.full_name && c.full_name.toLowerCase().includes(query)) ||
        (c.phone && c.phone.includes(query)) ||
        (c.id && c.id.toLowerCase().includes(query))
    );
  }, [customers, customerSearch]);

  const adminName = profile?.fullName || user?.user_metadata?.full_name || 'Admin';
  const adminInitials =
    adminName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n: string) => n[0].toUpperCase())
      .join('') || 'AD';

  // Exactly 6 store management navigation sections
  const navItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package, badge: products.length ? String(products.length) : undefined },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'inventory', label: 'Inventory', icon: Boxes },
    { id: 'customers', label: 'Customers', icon: Users, badge: customers.length ? String(customers.length) : undefined },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-cream text-checkerboard flex flex-col">
      {/* Top Mobile Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#FAF8F5] border-b border-[#1A1816]/10 sticky top-[78px] z-30 shadow-2xs">
        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-white border border-[#1A1816]/10 text-checkerboard hover:bg-stone-50 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div>
            <h1 className="font-serif text-lg text-checkerboard font-medium capitalize">
              {activeTab === 'overview' ? 'Overview' : activeTab}
            </h1>
            <p className="text-[10px] text-[#666059]">Admin Panel</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={loadDashboardData}
            disabled={isLoading}
            className="p-2 rounded-lg bg-white border border-[#1A1816]/10 text-[#666059] hover:text-checkerboard transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/"
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-tangerine text-white text-xs font-medium shadow-2xs"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Store</span>
          </Link>
        </div>
      </div>

      <div className="flex grow">
        {/* Desktop Sidebar Navigation */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 xl:w-72 bg-[#FAF8F5] border-r border-[#1A1816]/10 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
            isMobileMenuOpen ? 'translate-x-0 top-[78px]' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-5 flex flex-col h-full justify-between">
            <div>
              {/* Brand and Admin Workspace Pill */}
              <div className="flex items-center justify-between pb-5 mb-5 border-b border-[#1A1816]/10">
                <div>
                  <span className="font-serif text-lg text-checkerboard font-semibold block tracking-wide">
                    Furniture Village
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-tangerine font-semibold block">
                    Admin Panel
                  </span>
                </div>
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] uppercase font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Online</span>
                </span>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-1" aria-label="Admin sections">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-sans font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-tangerine text-white shadow-xs font-semibold'
                          : 'text-[#666059] hover:text-checkerboard hover:bg-stone-200/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#8C827A]'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-mono uppercase tracking-wide ${
                            isActive
                              ? 'bg-black/20 text-white'
                              : 'bg-stone-200 text-[#666059]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Admin Profile & Logout Footer */}
            <div className="pt-5 border-t border-[#1A1816]/10 space-y-3">
              <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-white border border-[#1A1816]/10 shadow-2xs">
                <div className="w-9 h-9 rounded-full bg-tangerine text-white font-serif text-sm font-semibold flex items-center justify-center shrink-0">
                  {adminInitials}
                </div>
                <div className="min-w-0 grow">
                  <p className="text-xs text-checkerboard font-medium truncate">{adminName}</p>
                  <p className="text-[10px] text-[#666059] truncate">{user?.email}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-tangerine/10 text-tangerine text-[9px] font-semibold uppercase">
                  Admin
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center space-x-1.5 py-2 px-2.5 rounded-lg border border-[#1A1816]/10 bg-white hover:bg-stone-50 text-[#666059] hover:text-checkerboard text-xs transition-colors"
                  title="Open storefront"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>View Store</span>
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center justify-center space-x-1.5 py-2 px-2.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium transition-colors cursor-pointer"
                  title="Sign out of admin panel"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Workspace */}
        <main className="grow bg-cream p-4 sm:p-6 lg:p-8 min-w-0 max-w-7xl">
          {/* Header Action Bar (Desktop) */}
          <div className="hidden lg:flex items-center justify-between pb-6 mb-6 border-b border-[#1A1816]/10">
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="font-serif text-2xl xl:text-3xl text-checkerboard font-normal capitalize">
                  {activeTab === 'overview' && 'Overview'}
                  {activeTab === 'products' && 'Products'}
                  {activeTab === 'orders' && 'Orders'}
                  {activeTab === 'inventory' && 'Inventory'}
                  {activeTab === 'customers' && 'Customers'}
                  {activeTab === 'settings' && 'Settings'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-tangerine/10 text-tangerine text-[10px] uppercase font-semibold tracking-wider border border-tangerine/20">
                  Admin Panel
                </span>
              </div>
              <p className="text-xs text-[#666059] mt-1 font-sans">
                Welcome back, {adminName}. Manage products, orders, inventory, and users.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              {/* Date Filter Controls */}
              {activeTab === 'overview' && (
                <div className="flex items-center bg-[#FAF8F5] border border-[#1A1816]/10 rounded-xl p-1 text-xs shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setDateFilter('today')}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      dateFilter === 'today'
                        ? 'bg-tangerine text-white font-medium shadow-2xs'
                        : 'text-[#666059] hover:text-checkerboard'
                    }`}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setDateFilter('7days')}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      dateFilter === '7days'
                        ? 'bg-tangerine text-white font-medium shadow-2xs'
                        : 'text-[#666059] hover:text-checkerboard'
                    }`}
                  >
                    Last 7 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => setDateFilter('month')}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      dateFilter === 'month'
                        ? 'bg-tangerine text-white font-medium shadow-2xs'
                        : 'text-[#666059] hover:text-checkerboard'
                    }`}
                  >
                    This Month
                  </button>
                  <button
                    type="button"
                    onClick={() => setDateFilter('year')}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      dateFilter === 'year'
                        ? 'bg-tangerine text-white font-medium shadow-2xs'
                        : 'text-[#666059] hover:text-checkerboard'
                    }`}
                  >
                    This Year
                  </button>
                </div>
              )}

              {/* Refresh Button */}
              <button
                type="button"
                onClick={loadDashboardData}
                disabled={isLoading}
                className="inline-flex items-center space-x-1.5 py-2 px-3.5 rounded-xl border border-[#1A1816]/10 bg-white text-xs text-[#666059] hover:text-checkerboard hover:bg-stone-50 transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>

              {/* View Storefront */}
              <Link
                href="/"
                className="inline-flex items-center space-x-1.5 py-2 px-4 rounded-xl bg-checkerboard hover:bg-tangerine text-white text-xs font-medium transition-colors shadow-2xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Store</span>
              </Link>
            </div>
          </div>

          {/* Error Banner if any */}
          {fetchError && (
            <div className="p-4 mb-6 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-between text-xs text-red-700">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{fetchError}</span>
              </div>
              <button
                type="button"
                onClick={loadDashboardData}
                className="underline hover:text-red-900 cursor-pointer ml-4 shrink-0 font-medium"
              >
                Retry
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 1: OVERVIEW (LIVE METRICS) */}
          {/* ========================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 4 Core Business Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* 1. Total Sales */}
                <div className="bg-[#FAF8F5] border border-[#1A1816]/10 rounded-2xl p-5 hover:border-[#1A1816]/20 transition-colors shadow-[0_4px_20px_rgba(26,24,22,0.04)]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase tracking-wider text-[#8C827A] font-medium">
                      Total Sales
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                      <IndianRupee className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl xl:text-3xl font-serif text-checkerboard font-medium">
                    {isLoading ? '...' : formatINR(totalSales)}
                  </div>
                  <p className="text-[11px] text-[#666059] mt-1.5 flex items-center space-x-1">
                    <span>From confirmed store purchases</span>
                  </p>
                </div>

                {/* 2. Total Orders & Status Breakdown */}
                <div className="bg-[#FAF8F5] border border-[#1A1816]/10 rounded-2xl p-5 hover:border-[#1A1816]/20 transition-colors shadow-[0_4px_20px_rgba(26,24,22,0.04)]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase tracking-wider text-[#8C827A] font-medium">
                      Total Orders
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-tangerine/10 border border-tangerine/20 flex items-center justify-center text-tangerine">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl xl:text-3xl font-serif text-checkerboard font-medium">
                    {isLoading ? '...' : totalOrdersCount}
                  </div>
                  <div className="flex items-center space-x-2 mt-2 text-[10px]">
                    <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-medium">
                      {pendingOrdersCount} Pending
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium">
                      {completedOrdersCount} Delivered
                    </span>
                  </div>
                </div>

                {/* 3. Products in Catalog */}
                <div className="bg-[#FAF8F5] border border-[#1A1816]/10 rounded-2xl p-5 hover:border-[#1A1816]/20 transition-colors shadow-[0_4px_20px_rgba(26,24,22,0.04)]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase tracking-wider text-[#8C827A] font-medium">
                      Products
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                      <Package className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl xl:text-3xl font-serif text-checkerboard font-medium">
                    {isLoading ? '...' : totalProductsCount}
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[11px] text-[#666059]">
                    <span>{activeProductsCount} Published</span>
                    <span className="text-amber-700 font-medium">
                      {lowStockCount > 0 ? `${lowStockCount} Low Stock` : 'Stock Healthy'}
                    </span>
                  </div>
                </div>

                {/* 4. Registered Users */}
                <div className="bg-[#FAF8F5] border border-[#1A1816]/10 rounded-2xl p-5 hover:border-[#1A1816]/20 transition-colors shadow-[0_4px_20px_rgba(26,24,22,0.04)]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase tracking-wider text-[#8C827A] font-medium">
                      Customers
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl xl:text-3xl font-serif text-checkerboard font-medium">
                    {isLoading ? '...' : totalCustomersCount}
                  </div>
                  <p className="text-[11px] text-[#666059] mt-1.5 flex items-center justify-between">
                    <span>Registered Accounts</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('customers')}
                      className="text-tangerine hover:underline cursor-pointer"
                    >
                      View List →
                    </button>
                  </p>
                </div>
              </div>

              {/* Secondary Operational Panels: Recent Orders + Quick Tasks */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Recent Orders */}
                <div className="lg:col-span-2 bg-[#FAF8F5] border border-[#1A1816]/10 rounded-2xl p-5 shadow-[0_4px_20px_rgba(26,24,22,0.04)]">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#1A1816]/10">
                    <div className="flex items-center space-x-2">
                      <ShoppingBag className="w-4 h-4 text-tangerine" />
                      <h3 className="font-serif text-lg text-checkerboard font-medium">Recent Orders</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-tangerine hover:underline cursor-pointer font-medium"
                    >
                      View All Orders ({orders.length}) →
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <div className="py-12 px-4 text-center">
                      <div className="w-12 h-12 rounded-full bg-white border border-[#1A1816]/10 flex items-center justify-center text-[#8C827A] mx-auto mb-3 shadow-2xs">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                      <h4 className="font-serif text-base text-checkerboard font-medium mb-1">No Orders Yet</h4>
                      <p className="text-xs text-[#666059] max-w-sm mx-auto leading-relaxed">
                        Orders placed by customers on the storefront will appear here with customer delivery details, line items, and payment verification.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="text-[#8C827A] uppercase tracking-wider border-b border-[#1A1816]/10">
                            <th className="pb-2 font-medium">Order #</th>
                            <th className="pb-2 font-medium">Customer</th>
                            <th className="pb-2 font-medium">Date</th>
                            <th className="pb-2 font-medium">Status</th>
                            <th className="pb-2 font-medium text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1A1816]/5">
                          {orders.slice(0, 5).map((order) => (
                            <tr key={order.id} className="hover:bg-white transition-colors">
                              <td className="py-3 font-mono text-checkerboard font-medium">
                                #{order.order_number || order.id.slice(0, 8)}
                              </td>
                              <td className="py-3 text-[#666059]">{order.customer_email || 'User'}</td>
                              <td className="py-3 text-[#8C827A]">
                                {new Date(order.created_at).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                })}
                              </td>
                              <td className="py-3">
                                <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-semibold bg-stone-100 text-checkerboard">
                                  {order.status}
                                </span>
                              </td>
                              <td className="py-3 text-right font-medium text-checkerboard">
                                {formatINR(Number(order.total_amount) || 0)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Right 1 Col: Store Health & Pending Tasks */}
                <div className="bg-[#FAF8F5] border border-[#1A1816]/10 rounded-2xl p-5 space-y-4 shadow-[0_4px_20px_rgba(26,24,22,0.04)]">
                  <div className="pb-3 border-b border-[#1A1816]/10">
                    <h3 className="font-serif text-lg text-checkerboard font-medium">Store Operations</h3>
                    <p className="text-xs text-[#666059]">Daily checklist and action items</p>
                  </div>

                  <div className="space-y-3">
                    {/* Item 1: Pending Orders */}
                    <div className="p-3.5 rounded-xl bg-white border border-[#1A1816]/10 flex items-start space-x-3 shadow-2xs">
                      <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 grow">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-checkerboard font-medium">Order Dispatch</span>
                          <span className="text-[10px] text-amber-800 font-semibold">{pendingOrdersCount} Pending</span>
                        </div>
                        <p className="text-[11px] text-[#666059] mt-0.5 leading-snug">
                          {pendingOrdersCount === 0
                            ? 'All customer orders are fulfilled and up to date.'
                            : `${pendingOrdersCount} order(s) awaiting dispatch or courier assignment.`}
                        </p>
                      </div>
                    </div>

                    {/* Item 2: Stock Health */}
                    <div className="p-3.5 rounded-xl bg-white border border-[#1A1816]/10 flex items-start space-x-3 shadow-2xs">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 grow">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-checkerboard font-medium">Stock Levels</span>
                          <span className="text-[10px] text-emerald-800 font-semibold">
                            {lowStockCount === 0 ? 'Healthy' : `${lowStockCount} Low`}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#666059] mt-0.5 leading-snug">
                          {lowStockCount === 0
                            ? 'No low stock warnings across furniture inventory.'
                            : `${lowStockCount} product variant(s) below restock threshold.`}
                        </p>
                      </div>
                    </div>

                    {/* Item 3: Catalog Status */}
                    <div className="p-3.5 rounded-xl bg-white border border-[#1A1816]/10 flex items-start space-x-3 shadow-2xs">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0 mt-0.5">
                        <Package className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 grow">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-checkerboard font-medium">Catalogue Sync</span>
                          <span className="text-[10px] text-blue-800 font-semibold">Phase 03</span>
                        </div>
                        <p className="text-[11px] text-[#666059] mt-0.5 leading-snug">
                          Storefront active with curated showroom suites. Database catalog migration scheduled.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('customers')}
                      className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-stone-50 border border-[#1A1816]/10 text-checkerboard text-xs font-medium transition-colors flex items-center justify-center space-x-2 shadow-2xs cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Manage Customers ({customers.length})</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: PRODUCTS */}
          {/* ========================================================= */}
          {activeTab === 'products' && (
            <AdminProductManagement onProductChange={loadDashboardData} />
          )}

          {/* ========================================================= */}
          {/* TAB 3: ORDERS */}
          {/* ========================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1A1816]/10">
                <div>
                  <h2 className="font-serif text-xl text-checkerboard font-medium">Orders</h2>
                  <p className="text-xs text-[#666059]">Track customer orders, fulfilment status, and payment verification.</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-[#666059]">Total: {orders.length} orders</span>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="bg-[#FAF8F5] border border-[#1A1816]/10 rounded-2xl p-12 text-center shadow-[0_4px_20px_rgba(26,24,22,0.04)]">
                  <div className="w-14 h-14 rounded-full bg-white border border-[#1A1816]/10 flex items-center justify-center text-[#8C827A] mx-auto mb-4 shadow-2xs">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif text-xl text-checkerboard font-medium mb-2">No Orders Found</h3>
                  <p className="text-xs text-[#666059] max-w-md mx-auto leading-relaxed">
                    Customer orders placed through the website will appear here with customer names, delivery addresses, line items, and payment reconciliation.
                  </p>
                </div>
              ) : (
                <div className="bg-[#FAF8F5] border border-[#1A1816]/10 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(26,24,22,0.04)]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-100/70 text-[#8C827A] uppercase tracking-wider border-b border-[#1A1816]/10">
                      <tr>
                        <th className="p-4 font-medium">Order Number</th>
                        <th className="p-4 font-medium">Customer</th>
                        <th className="p-4 font-medium">Placed Date</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1A1816]/5">
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-white transition-colors">
                          <td className="p-4 font-mono font-medium text-checkerboard">#{o.order_number || o.id.slice(0, 8)}</td>
                          <td className="p-4 text-[#666059]">{o.customer_email || 'User'}</td>
                          <td className="p-4 text-[#8C827A]">
                            {new Date(o.created_at).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-semibold bg-stone-100 text-checkerboard">
                              {o.status}
                            </span>
                          </td>
                          <td className="p-4 text-right font-medium text-checkerboard">{formatINR(Number(o.total_amount) || 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: INVENTORY */}
          {/* ========================================================= */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1A1816]/10">
                <div>
                  <h2 className="font-serif text-xl text-checkerboard font-medium">Inventory</h2>
                  <p className="text-xs text-[#666059]">Monitor stock quantities, reorder thresholds, and warehouse availability.</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                    Stock Alerts: {lowStockCount}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#FAF8F5] border border-[#1A1816]/10 rounded-2xl p-5 shadow-[0_4px_20px_rgba(26,24,22,0.04)]">
                  <span className="text-xs text-[#8C827A] uppercase tracking-wider block mb-1">Total Stock Items</span>
                  <div className="text-2xl font-serif text-checkerboard">{inventory.length}</div>
                </div>
                <div className="bg-[#FAF8F5] border border-[#1A1816]/10 rounded-2xl p-5 shadow-[0_4px_20px_rgba(26,24,22,0.04)]">
                  <span className="text-xs text-[#8C827A] uppercase tracking-wider block mb-1">Low Stock Alerts</span>
                  <div className="text-2xl font-serif text-amber-700">{lowStockCount}</div>
                </div>
                <div className="bg-[#FAF8F5] border border-[#1A1816]/10 rounded-2xl p-5 shadow-[0_4px_20px_rgba(26,24,22,0.04)]">
                  <span className="text-xs text-[#8C827A] uppercase tracking-wider block mb-1">Out of Stock</span>
                  <div className="text-2xl font-serif text-checkerboard">
                    {inventory.filter((i) => i.quantity_available === 0).length}
                  </div>
                </div>
              </div>

              <div className="bg-[#FAF8F5] border border-[#1A1816]/10 rounded-2xl p-10 text-center shadow-[0_4px_20px_rgba(26,24,22,0.04)]">
                <div className="w-12 h-12 rounded-full bg-white border border-[#1A1816]/10 flex items-center justify-center text-tangerine mx-auto mb-3 shadow-2xs">
                  <Boxes className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg text-checkerboard font-medium mb-1">Inventory Tracking Active</h3>
                <p className="text-xs text-[#666059] max-w-md mx-auto leading-relaxed">
                  Real-time stock tracking is connected to the database. Detailed SKU stock adjustments will activate in tandem with Phase 03 product variants.
                </p>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: CUSTOMERS (USERS) */}
          {/* ========================================================= */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1A1816]/10">
                <div>
                  <h2 className="font-serif text-xl text-checkerboard font-medium">Customers</h2>
                  <p className="text-xs text-[#666059]">
                    View registered users, mobile numbers, account roles, and joined dates.
                  </p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-[#8C827A] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    placeholder="Search users..."
                    className="w-full bg-white border border-[#1A1816]/15 rounded-xl pl-9 pr-3 py-1.5 text-xs text-checkerboard placeholder-[#8C827A] focus:outline-hidden focus:border-tangerine transition-colors shadow-2xs"
                  />
                </div>
              </div>

              {filteredCustomers.length === 0 ? (
                <div className="bg-[#FAF8F5] border border-[#1A1816]/10 rounded-2xl p-10 text-center shadow-[0_4px_20px_rgba(26,24,22,0.04)]">
                  <div className="w-12 h-12 rounded-full bg-white border border-[#1A1816]/10 flex items-center justify-center text-[#8C827A] mx-auto mb-3 shadow-2xs">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-base text-checkerboard font-medium mb-1">No Users Found</h3>
                  <p className="text-xs text-[#666059]">
                    {customerSearch ? 'No user matches your search query.' : 'No user records found.'}
                  </p>
                </div>
              ) : (
                <div className="bg-[#FAF8F5] border border-[#1A1816]/10 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(26,24,22,0.04)]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-100/70 text-[#8C827A] uppercase tracking-wider border-b border-[#1A1816]/10">
                      <tr>
                        <th className="p-4 font-medium">User</th>
                        <th className="p-4 font-medium">Mobile Number</th>
                        <th className="p-4 font-medium">Role</th>
                        <th className="p-4 font-medium">Joined On</th>
                        <th className="p-4 font-medium text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1A1816]/5">
                      {filteredCustomers.map((c) => {
                        const name = c.full_name || 'User';
                        const initials = name
                          .split(' ')
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((n: string) => n[0].toUpperCase())
                          .join('') || 'U';

                        const isUserAdmin = Boolean(c.is_admin || c.role === 'admin');

                        return (
                          <tr key={c.id} className="hover:bg-white transition-colors">
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-tangerine text-white font-serif text-xs font-semibold flex items-center justify-center shrink-0">
                                  {initials}
                                </div>
                                <div>
                                  <span className="font-medium text-checkerboard block">{name}</span>
                                  <span className="text-[10px] text-[#8C827A] font-mono truncate max-w-[150px] block">
                                    ID: {c.id.slice(0, 8)}...
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-[#666059]">
                              {c.phone ? (
                                <span className="font-mono">{c.phone}</span>
                              ) : (
                                <span className="text-[#8C827A] italic">Not provided</span>
                              )}
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                                  isUserAdmin
                                    ? 'bg-tangerine/15 text-tangerine border border-tangerine/30'
                                    : 'bg-stone-100 text-[#666059]'
                                }`}
                              >
                                {isUserAdmin ? 'Admin' : 'User'}
                              </span>
                            </td>
                            <td className="p-4 text-[#8C827A]">
                              {new Date(c.created_at).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </td>
                            <td className="p-4 text-right">
                              <span className="inline-flex items-center space-x-1 text-emerald-700 text-[11px] font-medium">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Active</span>
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: SETTINGS */}
          {/* ========================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-[#1A1816]/10">
                <h2 className="font-serif text-xl text-checkerboard font-medium">Settings</h2>
                <p className="text-xs text-[#666059]">
                  Review store profile, physical showroom information, and admin credentials.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Store Profile Card */}
                <div className="bg-[#FAF8F5] border border-[#1A1816]/10 rounded-2xl p-6 space-y-4 shadow-[0_4px_20px_rgba(26,24,22,0.04)]">
                  <div className="flex items-center space-x-2 text-checkerboard font-medium pb-3 border-b border-[#1A1816]/10">
                    <Building2 className="w-4 h-4 text-tangerine" />
                    <span className="font-serif text-base">Store Identity</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-[#8C827A] block">Store Name</span>
                      <span className="text-checkerboard font-medium">Furniture Village</span>
                    </div>

                    <div>
                      <span className="text-[#8C827A] block">Currency</span>
                      <span className="text-checkerboard font-medium">Indian Rupee (INR — ₹)</span>
                    </div>

                    <div>
                      <span className="text-[#8C827A] block">Business Entity & GSTIN</span>
                      <span className="text-checkerboard font-medium">Furniture Village India Pvt. Ltd. · 29AABCF1234F1Z5</span>
                    </div>

                    <div>
                      <span className="text-[#8C827A] block">Flagship Showroom</span>
                      <span className="text-checkerboard font-medium">Indiranagar, 100 Feet Road, Bengaluru, Karnataka</span>
                    </div>

                    <div>
                      <span className="text-[#8C827A] block">Customer Support</span>
                      <span className="text-checkerboard font-medium">care@furnitureworld.com • +91 80 4000 8879</span>
                    </div>
                  </div>
                </div>

                {/* Admin Account Card */}
                <div className="bg-[#FAF8F5] border border-[#1A1816]/10 rounded-2xl p-6 space-y-4 shadow-[0_4px_20px_rgba(26,24,22,0.04)]">
                  <div className="flex items-center space-x-2 text-checkerboard font-medium pb-3 border-b border-[#1A1816]/10">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="font-serif text-base">Admin Profile</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-[#8C827A] block">Full Name</span>
                      <span className="text-checkerboard font-medium">{adminName}</span>
                    </div>

                    <div>
                      <span className="text-[#8C827A] block">Registered Email</span>
                      <span className="text-checkerboard font-medium">{user?.email}</span>
                    </div>

                    <div>
                      <span className="text-[#8C827A] block">Account Role</span>
                      <span className="inline-flex items-center space-x-1.5 text-emerald-700 font-semibold mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Admin</span>
                      </span>
                    </div>

                    <div className="pt-2">
                      <Link
                        href="/reset-password"
                        className="inline-flex items-center space-x-2 py-2 px-4 rounded-xl bg-white hover:bg-stone-50 border border-[#1A1816]/10 text-checkerboard text-xs font-medium transition-colors shadow-2xs"
                      >
                        <span>Change Account Password</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#8C827A]" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardEntryPage;
