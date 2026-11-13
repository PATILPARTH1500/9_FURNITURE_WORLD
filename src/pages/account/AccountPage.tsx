import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Link from '@/components/common/Link';
import { useAuth } from '@/context/AuthContext';
import {
  Mail,
  ShieldCheck,
  Calendar,
  LogOut,
  Edit2,
  Check,
  X,
  Package,
  MapPin,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { user, profile, signOut, updateProfile, updatePassword, refreshProfile } = useAuth();
  const navigate = useNavigate();

  // Edit profile state
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(profile?.fullName || '');
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  // Password update state
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'orders' | 'addresses'>('profile');

  // Customer display metadata
  const customerEmail = user?.email || 'customer@residence.com';
  const customerName = profile?.fullName || user?.user_metadata?.full_name || user?.user_metadata?.name || 'Valued Patron';
  const avatarUrl = profile?.avatarUrl || user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const isGoogleUser = user?.app_metadata?.provider === 'google' || user?.identities?.some((id) => id.provider === 'google');
  const isEmailVerified = Boolean(user?.email_confirmed_at);

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : 'Recent Member';

  // Monogram initials
  const initials = customerName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n: string) => n[0].toUpperCase())
    .join('') || 'FW';

  const handleSaveName = async () => {
    if (!editedName.trim()) {
      setNameError('Name cannot be empty.');
      return;
    }

    setIsSavingName(true);
    setNameError(null);
    setNameSuccess(false);

    const result = await updateProfile({ fullName: editedName });
    setIsSavingName(false);

    if (result.success) {
      setNameSuccess(true);
      setIsEditingName(false);
      setTimeout(() => setNameSuccess(false), 3000);
      await refreshProfile();
    } else {
      setNameError(result.error || 'Failed to update name.');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setIsSavingPassword(true);
    const result = await updatePassword(newPassword);
    setIsSavingPassword(false);

    if (result.success) {
      setPasswordSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
      setIsUpdatingPassword(false);
      setTimeout(() => setPasswordSuccess(false), 4000);
    } else {
      setPasswordError(result.error || 'Failed to update password.');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-cream py-12 sm:py-16 px-4 sm:px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex items-center space-x-2 text-xs font-sans text-[#666059]">
          <Link href="/" className="hover:text-checkerboard transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-checkerboard font-medium">Customer Sanctuary</span>
        </div>

        {/* Hero Customer Card */}
        <div className="bg-[#FAF8F5] border border-[#1A1816]/10 rounded-3xl p-6 sm:p-10 shadow-[0_16px_40px_rgba(26,24,22,0.06)] mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Left: Avatar & Customer Info */}
            <div className="flex items-center space-x-5">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={customerName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-white shadow-md"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-checkerboard text-white font-serif text-xl sm:text-2xl flex items-center justify-center tracking-widest font-semibold border-2 border-white shadow-md">
                  {initials}
                </div>
              )}

              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="font-serif text-2xl sm:text-3xl text-checkerboard font-normal">
                    {customerName}
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-1.5 text-xs font-sans text-[#666059]">
                  <div className="flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#8C827A]" />
                    <span>{customerEmail}</span>
                  </div>

                  {isEmailVerified && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 text-[10px] font-medium tracking-wide">
                      <ShieldCheck className="w-3 h-3 text-green-600" />
                      <span>Verified Client</span>
                    </span>
                  )}

                  <div className="flex items-center space-x-1.5 text-[#8C827A]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Member since {memberSince}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Sign Out CTA */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center space-x-2 py-2.5 px-5 rounded-full border border-[#1A1816]/20 bg-white hover:bg-red-50 hover:border-red-200 hover:text-red-700 text-checkerboard text-xs uppercase tracking-wider font-semibold transition-all duration-200 shadow-2xs cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Global Notifications */}
        {nameSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-xs flex items-center space-x-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
            <span>Profile name successfully updated.</span>
          </div>
        )}

        {passwordSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-xs flex items-center space-x-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
            <span>Security password successfully changed.</span>
          </div>
        )}

        {/* Account Tabs */}
        <div className="flex border-b border-[#1A1816]/10 mb-8 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-4 text-xs uppercase tracking-[0.14em] font-semibold transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-tangerine text-checkerboard'
                : 'border-transparent text-[#666059] hover:text-checkerboard'
            }`}
          >
            Profile & Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`pb-3 px-4 text-xs uppercase tracking-[0.14em] font-semibold transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-tangerine text-checkerboard'
                : 'border-transparent text-[#666059] hover:text-checkerboard'
            }`}
          >
            Security & Login
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-4 text-xs uppercase tracking-[0.14em] font-semibold transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-tangerine text-checkerboard'
                : 'border-transparent text-[#666059] hover:text-checkerboard'
            }`}
          >
            Bespoke Orders
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 px-4 text-xs uppercase tracking-[0.14em] font-semibold transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'addresses'
                ? 'border-tangerine text-checkerboard'
                : 'border-transparent text-[#666059] hover:text-checkerboard'
            }`}
          >
            Residence Addresses
          </button>
        </div>

        {/* Tab 1: Profile Details */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#FAF8F5] border border-[#1A1816]/10 rounded-3xl p-6 sm:p-8 shadow-2xs">
                <h2 className="font-serif text-xl text-checkerboard mb-6">Personal Identification</h2>

                {nameError && (
                  <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{nameError}</span>
                  </div>
                )}

                <div className="space-y-5">
                  {/* Full Name Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#1A1816]/10 gap-3">
                    <div>
                      <span className="block text-[11px] uppercase tracking-wider text-[#8C827A] font-medium">
                        Full Name
                      </span>
                      {isEditingName ? (
                        <div className="flex items-center space-x-2 mt-1.5">
                          <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="bg-white border border-[#1A1816]/20 rounded-xl px-3 py-1.5 text-sm text-checkerboard focus:outline-hidden focus:border-tangerine"
                            placeholder="Your full name"
                          />
                          <button
                            type="button"
                            onClick={handleSaveName}
                            disabled={isSavingName}
                            className="p-2 rounded-xl bg-checkerboard text-white hover:bg-tangerine transition-colors disabled:opacity-50"
                            title="Save"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditingName(false);
                              setEditedName(profile?.fullName || '');
                            }}
                            className="p-2 rounded-xl bg-white border border-[#1A1816]/15 text-[#666059] hover:text-checkerboard transition-colors"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-base text-checkerboard font-medium mt-0.5 block">
                          {customerName}
                        </span>
                      )}
                    </div>
                    {!isEditingName && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditedName(customerName);
                          setIsEditingName(true);
                        }}
                        className="inline-flex items-center space-x-1.5 text-xs text-tangerine font-semibold hover:underline self-start sm:self-auto cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>

                  {/* Email Row (Read-Only) */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#1A1816]/10 gap-3">
                    <div>
                      <span className="block text-[11px] uppercase tracking-wider text-[#8C827A] font-medium">
                        Registered Email
                      </span>
                      <span className="text-base text-checkerboard font-medium mt-0.5 block">
                        {customerEmail}
                      </span>
                    </div>
                    <span className="text-xs text-[#8C827A] font-sans">
                      Verified Identity
                    </span>
                  </div>

                  {/* Auth Provider */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="block text-[11px] uppercase tracking-wider text-[#8C827A] font-medium">
                        Authentication Method
                      </span>
                      <span className="text-sm text-checkerboard mt-0.5 block">
                        {isGoogleUser ? 'Google OAuth 2.0 Single Sign-On' : 'Encrypted Password & Email'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Quick Status / Concierge */}
            <div className="space-y-6">
              <div className="bg-[#FAF8F5] border border-[#1A1816]/10 rounded-3xl p-6 shadow-2xs">
                <span className="text-[10px] uppercase tracking-[0.2em] text-tangerine font-semibold block mb-2">
                  Atelier Concierge
                </span>
                <h3 className="font-serif text-lg text-checkerboard mb-2">Private Residence Liaison</h3>
                <p className="text-xs text-[#666059] leading-relaxed mb-4">
                  Need custom millwork, white-glove delivery coordination, or bespoke architectural finishes?
                </p>
                <Link
                  href="/#visit-us"
                  className="inline-flex items-center space-x-2 text-xs font-semibold text-checkerboard hover:text-tangerine transition-colors"
                >
                  <span>Connect with Showroom</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Security & Login */}
        {activeTab === 'security' && (
          <div className="max-w-2xl bg-[#FAF8F5] border border-[#1A1816]/10 rounded-3xl p-6 sm:p-8 shadow-2xs">
            <h2 className="font-serif text-xl text-checkerboard mb-2">Security & Credentials</h2>
            <p className="text-xs text-[#666059] mb-6 font-sans">
              Manage your passphrases and cryptographic session parameters.
            </p>

            {passwordError && (
              <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {isGoogleUser ? (
              <div className="p-4 rounded-2xl bg-white border border-[#1A1816]/10 text-xs text-[#666059] leading-relaxed">
                Your account is authenticated through Google Single Sign-On. Your password and 2-step verification are securely governed by your Google Account security settings.
              </div>
            ) : (
              <div>
                {!isUpdatingPassword ? (
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#1A1816]/10">
                    <div className="flex items-center space-x-3">
                      <Lock className="w-4 h-4 text-[#8C827A]" />
                      <span className="text-xs text-checkerboard font-medium">Password Authentication</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsUpdatingPassword(true)}
                      className="text-xs font-semibold text-tangerine hover:underline cursor-pointer"
                    >
                      Change Password
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleUpdatePassword} className="space-y-4 p-5 rounded-2xl bg-white border border-[#1A1816]/10">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-medium text-[#666059] mb-1">
                        New Password (min 8 characters)
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        placeholder="••••••••••••"
                        className="w-full bg-[#FAF8F5] border border-[#1A1816]/15 rounded-xl px-3.5 py-2.5 text-sm text-checkerboard focus:outline-hidden focus:border-tangerine"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-medium text-[#666059] mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="••••••••••••"
                        className="w-full bg-[#FAF8F5] border border-[#1A1816]/15 rounded-xl px-3.5 py-2.5 text-sm text-checkerboard focus:outline-hidden focus:border-tangerine"
                      />
                    </div>

                    <div className="flex items-center space-x-3 pt-2">
                      <button
                        type="submit"
                        disabled={isSavingPassword}
                        className="py-2 px-5 rounded-full bg-checkerboard hover:bg-tangerine text-white text-xs uppercase tracking-wider font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {isSavingPassword ? 'Updating...' : 'Save Password'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsUpdatingPassword(false);
                          setPasswordError(null);
                        }}
                        className="py-2 px-4 rounded-full border border-[#1A1816]/15 text-xs text-[#666059] hover:text-checkerboard transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Bespoke Orders Placeholder */}
        {activeTab === 'orders' && (
          <div className="bg-[#FAF8F5] border border-[#1A1816]/10 rounded-3xl p-10 sm:p-14 text-center shadow-2xs">
            <div className="w-14 h-14 rounded-full bg-tangerine/10 text-tangerine flex items-center justify-center mx-auto mb-4">
              <Package className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-2xl text-checkerboard mb-2">No Active Acquisitions</h3>
            <p className="text-xs sm:text-sm text-[#666059] max-w-md mx-auto mb-6 leading-relaxed">
              When you acquire signature bespoke furniture pieces, tracking, crafting updates, and freight details will be chronicled here.
            </p>
            <Link
              href="/collections"
              className="inline-flex items-center space-x-2 py-3 px-6 rounded-full bg-checkerboard hover:bg-tangerine text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-md"
            >
              <span>Explore Collection Catalogue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Tab 4: Residence Addresses Placeholder */}
        {activeTab === 'addresses' && (
          <div className="bg-[#FAF8F5] border border-[#1A1816]/10 rounded-3xl p-10 sm:p-14 text-center shadow-2xs">
            <div className="w-14 h-14 rounded-full bg-checkerboard/10 text-checkerboard flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-2xl text-checkerboard mb-2">Residence Registry</h3>
            <p className="text-xs sm:text-sm text-[#666059] max-w-md mx-auto mb-6 leading-relaxed">
              Save your primary residence and vacation villa delivery destinations for seamless white-glove installation dispatch.
            </p>
            <span className="inline-block px-3 py-1 rounded-full bg-checkerboard/5 text-checkerboard text-[10px] uppercase tracking-wider font-semibold">
              Registry Configuration Available Upon Order Dispatch
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountPage;
