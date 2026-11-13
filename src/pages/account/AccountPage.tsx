import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Link from '@/components/common/Link';
import { useAuth } from '@/context/AuthContext';
import { AddressService } from '@/lib/services/addressService';
import { CustomerAddress, AddressFormData, INDIAN_STATES } from '@/types/address';
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
  Phone,
  Camera,
  Plus,
  Trash2,
  Home,
  Briefcase,
  Building,
  ShieldAlert,
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { user, profile, isAdmin, signOut, updateProfile, uploadAvatar, updatePassword, refreshProfile } = useAuth();
  const navigate = useNavigate();

  // Edit profile state (Full Name & Phone)
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedName, setEditedName] = useState(profile?.fullName || '');
  const [editedPhone, setEditedPhone] = useState(profile?.phone || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Avatar upload state
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [avatarSuccess, setAvatarSuccess] = useState(false);

  // Password update state
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'orders' | 'addresses'>('profile');

  // Address registry state
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [addressSuccess, setAddressSuccess] = useState<string | null>(null);

  // Add / Edit address form state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [addressFormData, setAddressFormData] = useState<AddressFormData>({
    recipientName: '',
    phone: '',
    streetLine1: '',
    streetLine2: '',
    landmark: '',
    city: '',
    stateProvince: 'Maharashtra',
    postalCode: '',
    addressType: 'Home',
    isDefault: false,
  });

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

  // Synchronize local form inputs when profile updates
  useEffect(() => {
    if (profile) {
      setEditedName(profile.fullName || '');
      setEditedPhone(profile.phone || '');
    }
  }, [profile]);

  // Load addresses when tab is active or user changes
  const loadAddresses = useCallback(async () => {
    if (!user) return;
    setIsLoadingAddresses(true);
    setAddressError(null);
    const result = await AddressService.fetchAddresses(user.id);
    setIsLoadingAddresses(false);
    if (result.error) {
      setAddressError(result.error);
    } else {
      setAddresses(result.data);
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'addresses' && user) {
      loadAddresses();
    }
  }, [activeTab, user, loadAddresses]);

  const handleSaveProfile = async () => {
    if (!editedName.trim()) {
      setProfileError('Name cannot be empty.');
      return;
    }

    if (editedPhone.trim() && !AddressService.validatePhone(editedPhone)) {
      setProfileError('Please enter a valid 10-digit Indian phone number.');
      return;
    }

    setIsSavingProfile(true);
    setProfileError(null);
    setProfileSuccess(false);

    const result = await updateProfile({
      fullName: editedName,
      phone: editedPhone.trim() || null,
    });
    setIsSavingProfile(false);

    if (result.success) {
      setProfileSuccess(true);
      setIsEditingProfile(false);
      setTimeout(() => setProfileSuccess(false), 3000);
      await refreshProfile();
    } else {
      setProfileError(result.error || 'Failed to update profile.');
    }
  };

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    setAvatarError(null);
    setAvatarSuccess(false);

    const result = await uploadAvatar(file);
    setIsUploadingAvatar(false);

    if (result.success) {
      setAvatarSuccess(true);
      setTimeout(() => setAvatarSuccess(false), 3000);
      await refreshProfile();
    } else {
      setAvatarError(result.error || 'Failed to upload avatar image.');
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressFormData({
      recipientName: profile?.fullName || '',
      phone: profile?.phone || '',
      streetLine1: '',
      streetLine2: '',
      landmark: '',
      city: '',
      stateProvince: 'Maharashtra',
      postalCode: '',
      addressType: 'Home',
      isDefault: addresses.length === 0,
    });
    setAddressError(null);
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr: CustomerAddress) => {
    setEditingAddressId(addr.id);
    setAddressFormData({
      recipientName: addr.recipientName,
      phone: addr.phone,
      streetLine1: addr.streetLine1,
      streetLine2: addr.streetLine2 || '',
      landmark: addr.landmark || '',
      city: addr.city,
      stateProvince: addr.stateProvince,
      postalCode: addr.postalCode,
      addressType: addr.addressType,
      isDefault: addr.isDefault,
    });
    setAddressError(null);
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!AddressService.validatePinCode(addressFormData.postalCode)) {
      setAddressError('Please enter a valid 6-digit Indian PIN code (e.g. 400001).');
      return;
    }

    if (!AddressService.validatePhone(addressFormData.phone)) {
      setAddressError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setIsSavingAddress(true);
    setAddressError(null);

    let result;
    if (editingAddressId) {
      result = await AddressService.updateAddress(user.id, editingAddressId, addressFormData);
    } else {
      result = await AddressService.addAddress(user.id, addressFormData);
    }

    setIsSavingAddress(false);

    if (result.error) {
      setAddressError(result.error);
    } else {
      setIsAddressModalOpen(false);
      setAddressSuccess(editingAddressId ? 'Residence address successfully updated.' : 'New residence destination registered.');
      setTimeout(() => setAddressSuccess(null), 3500);
      await loadAddresses();
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!user) return;
    if (!window.confirm('Are you sure you wish to remove this delivery residence from your registry?')) {
      return;
    }

    const result = await AddressService.deleteAddress(user.id, addressId);
    if (result.error) {
      setAddressError(result.error);
    } else {
      setAddressSuccess('Address removed from registry.');
      setTimeout(() => setAddressSuccess(null), 3000);
      await loadAddresses();
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    if (!user) return;
    const result = await AddressService.setDefault(user.id, addressId);
    if (result.error) {
      setAddressError(result.error);
    } else {
      setAddressSuccess('Primary residence updated.');
      setTimeout(() => setAddressSuccess(null), 3000);
      await loadAddresses();
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
              <div className="relative group shrink-0">
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

                {/* Avatar change overlay */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  title="Upload New Avatar"
                  className="absolute inset-0 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:opacity-50"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleAvatarFileChange}
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="font-serif text-2xl sm:text-3xl text-checkerboard font-normal">
                    {customerName}
                  </h1>

                  {isAdmin && (
                    <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#1A1816] text-tangerine text-[10px] font-semibold tracking-wider uppercase border border-tangerine/30 shadow-xs">
                      <ShieldAlert className="w-3 h-3 text-tangerine" />
                      <span>Atelier Administrator</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-1.5 text-xs font-sans text-[#666059]">
                  <div className="flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#8C827A]" />
                    <span>{customerEmail}</span>
                  </div>

                  {profile?.phone && (
                    <div className="flex items-center space-x-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#8C827A]" />
                      <span>{profile.phone}</span>
                    </div>
                  )}

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

            {/* Right: Actions */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="inline-flex items-center space-x-2 py-2.5 px-5 rounded-full bg-[#1A1816] hover:bg-tangerine text-white text-xs uppercase tracking-wider font-semibold transition-all duration-200 shadow-md"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-tangerine" />
                  <span>Atelier Console</span>
                </Link>
              )}

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
        {profileSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-xs flex items-center space-x-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
            <span>Profile information successfully updated.</span>
          </div>
        )}

        {avatarSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-xs flex items-center space-x-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
            <span>Profile avatar image successfully updated in Supabase Storage.</span>
          </div>
        )}

        {avatarError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{avatarError}</span>
          </div>
        )}

        {passwordSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-xs flex items-center space-x-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
            <span>Security password successfully changed.</span>
          </div>
        )}

        {addressSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-xs flex items-center space-x-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
            <span>{addressSuccess}</span>
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
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 px-4 text-xs uppercase tracking-[0.14em] font-semibold transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'addresses'
                ? 'border-tangerine text-checkerboard'
                : 'border-transparent text-[#666059] hover:text-checkerboard'
            }`}
          >
            Residence Addresses ({addresses.length})
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
        </div>

        {/* Tab 1: Profile Details */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#FAF8F5] border border-[#1A1816]/10 rounded-3xl p-6 sm:p-8 shadow-2xs">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-xl text-checkerboard">Personal Identification</h2>
                  {!isEditingProfile && (
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(true)}
                      className="inline-flex items-center space-x-1.5 text-xs text-tangerine font-semibold hover:underline cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Information</span>
                    </button>
                  )}
                </div>

                {profileError && (
                  <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{profileError}</span>
                  </div>
                )}

                <div className="space-y-5">
                  {/* Full Name Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#1A1816]/10 gap-3">
                    <div>
                      <span className="block text-[11px] uppercase tracking-wider text-[#8C827A] font-medium">
                        Full Name
                      </span>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="bg-white border border-[#1A1816]/20 rounded-xl px-3 py-2 text-sm text-checkerboard focus:outline-hidden focus:border-tangerine mt-1 w-full max-w-xs"
                          placeholder="Your full name"
                        />
                      ) : (
                        <span className="text-base text-checkerboard font-medium mt-0.5 block">
                          {customerName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Phone Number Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#1A1816]/10 gap-3">
                    <div>
                      <span className="block text-[11px] uppercase tracking-wider text-[#8C827A] font-medium">
                        Contact Mobile (India)
                      </span>
                      {isEditingProfile ? (
                        <input
                          type="tel"
                          value={editedPhone}
                          onChange={(e) => setEditedPhone(e.target.value)}
                          className="bg-white border border-[#1A1816]/20 rounded-xl px-3 py-2 text-sm text-checkerboard focus:outline-hidden focus:border-tangerine mt-1 w-full max-w-xs"
                          placeholder="e.g. 9876543210"
                        />
                      ) : (
                        <span className="text-base text-checkerboard font-medium mt-0.5 block">
                          {profile?.phone || 'Not registered'}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#8C827A]">
                      For courier dispatch & installation liaison
                    </span>
                  </div>

                  {/* Registered Email (Immutable) */}
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

                  {/* Account Authorization Tier */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="block text-[11px] uppercase tracking-wider text-[#8C827A] font-medium">
                        Account Privileges & Tier
                      </span>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm font-semibold capitalize text-checkerboard">
                          {profile?.role || 'Customer'}
                        </span>
                        {isAdmin && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-tangerine/10 text-tangerine font-semibold uppercase">
                            Admin Access Granted
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[11px] text-[#8C827A]">
                      Protected by PostgreSQL 17 RBAC
                    </span>
                  </div>

                  {/* Save/Cancel for Edit Profile */}
                  {isEditingProfile && (
                    <div className="flex items-center space-x-3 pt-3">
                      <button
                        type="button"
                        onClick={handleSaveProfile}
                        disabled={isSavingProfile}
                        className="py-2.5 px-6 rounded-full bg-checkerboard hover:bg-tangerine text-white text-xs uppercase tracking-wider font-semibold transition-colors disabled:opacity-50 cursor-pointer flex items-center space-x-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>{isSavingProfile ? 'Saving...' : 'Save Profile'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingProfile(false);
                          setEditedName(profile?.fullName || '');
                          setEditedPhone(profile?.phone || '');
                          setProfileError(null);
                        }}
                        className="py-2.5 px-5 rounded-full border border-[#1A1816]/15 text-xs text-[#666059] hover:text-checkerboard transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Atelier Concierge */}
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

        {/* Tab 2: Indian Residence Addresses Registry */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl text-checkerboard">Residence Registry</h2>
                <p className="text-xs text-[#666059] mt-0.5">
                  Saved Indian delivery destinations for seamless white-glove installation
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddAddress}
                className="inline-flex items-center space-x-2 py-2.5 px-5 rounded-full bg-checkerboard hover:bg-tangerine text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-md self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Residence</span>
              </button>
            </div>

            {addressError && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{addressError}</span>
              </div>
            )}

            {isLoadingAddresses ? (
              <div className="bg-[#FAF8F5] border border-[#1A1816]/10 rounded-3xl p-12 text-center">
                <div className="w-8 h-8 rounded-full border-2 border-checkerboard/20 border-t-tangerine animate-spin mx-auto mb-3" />
                <p className="text-xs text-[#666059]">Querying residence registry...</p>
              </div>
            ) : addresses.length === 0 ? (
              <div className="bg-[#FAF8F5] border border-[#1A1816]/10 rounded-3xl p-10 sm:p-14 text-center shadow-2xs">
                <div className="w-14 h-14 rounded-full bg-checkerboard/10 text-checkerboard flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-2xl text-checkerboard mb-2">No Saved Residences</h3>
                <p className="text-xs sm:text-sm text-[#666059] max-w-md mx-auto mb-6 leading-relaxed">
                  Add your primary villa, residence, or commercial salon destination for expedited bespoke deliveries.
                </p>
                <button
                  type="button"
                  onClick={handleOpenAddAddress}
                  className="inline-flex items-center space-x-2 py-3 px-6 rounded-full bg-tangerine hover:bg-tangerine/90 text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register First Residence</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`bg-[#FAF8F5] border rounded-3xl p-6 transition-all duration-200 shadow-2xs flex flex-col justify-between ${
                      addr.isDefault ? 'border-tangerine/50 ring-1 ring-tangerine/30' : 'border-[#1A1816]/10'
                    }`}
                  >
                    <div>
                      {/* Top bar with tags */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-checkerboard/5 text-checkerboard text-[10px] font-semibold uppercase tracking-wider">
                            {addr.addressType === 'Home' && <Home className="w-3 h-3 mr-1" />}
                            {addr.addressType === 'Work' && <Briefcase className="w-3 h-3 mr-1" />}
                            {addr.addressType === 'Other' && <Building className="w-3 h-3 mr-1" />}
                            <span>{addr.addressType}</span>
                          </span>

                          {addr.isDefault && (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-tangerine/15 text-tangerine text-[10px] font-semibold uppercase tracking-wider">
                              <Check className="w-3 h-3" />
                              <span>Primary Residence</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditAddress(addr)}
                            className="p-1.5 rounded-lg text-[#8C827A] hover:text-checkerboard hover:bg-white transition-colors cursor-pointer"
                            title="Edit Address"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="p-1.5 rounded-lg text-[#8C827A] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Address"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Recipient details */}
                      <h4 className="font-serif text-lg text-checkerboard font-medium mb-1">
                        {addr.recipientName}
                      </h4>
                      <p className="text-xs text-[#8C827A] flex items-center space-x-1.5 mb-3">
                        <Phone className="w-3 h-3" />
                        <span>{addr.phone}</span>
                      </p>

                      {/* Address text */}
                      <div className="text-xs text-[#666059] leading-relaxed space-y-0.5">
                        <p>{addr.streetLine1}</p>
                        {addr.streetLine2 && <p>{addr.streetLine2}</p>}
                        {addr.landmark && <p className="italic text-[#8C827A]">Landmark: {addr.landmark}</p>}
                        <p className="font-medium text-checkerboard">
                          {addr.city}, {addr.stateProvince} — {addr.postalCode}
                        </p>
                        <p className="text-[11px] text-[#8C827A]">{addr.country}</p>
                      </div>
                    </div>

                    {/* Bottom default toggle */}
                    {!addr.isDefault && (
                      <div className="pt-4 mt-4 border-t border-[#1A1816]/10">
                        <button
                          type="button"
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="text-[11px] text-tangerine hover:underline font-semibold cursor-pointer"
                        >
                          Set as Primary Residence
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Security & Login */}
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

        {/* Tab 4: Bespoke Orders Placeholder */}
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

        {/* Modal: Add or Edit Residence Address */}
        {isAddressModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white border border-[#1A1816]/15 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-[#1A1816]/10 mb-5">
                <h3 className="font-serif text-xl text-checkerboard">
                  {editingAddressId ? 'Edit Residence Destination' : 'Add Residence Destination'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="p-1 rounded-full text-[#8C827A] hover:text-checkerboard hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {addressError && (
                <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{addressError}</span>
                </div>
              )}

              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-medium text-[#666059] mb-1">
                      Recipient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={addressFormData.recipientName}
                      onChange={(e) => setAddressFormData({ ...addressFormData, recipientName: e.target.value })}
                      placeholder="e.g. Parth Patil"
                      className="w-full bg-[#FAF8F5] border border-[#1A1816]/15 rounded-xl px-3.5 py-2 text-sm text-checkerboard focus:outline-hidden focus:border-tangerine"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-medium text-[#666059] mb-1">
                      Phone Number (10 digits) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={addressFormData.phone}
                      onChange={(e) => setAddressFormData({ ...addressFormData, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-[#FAF8F5] border border-[#1A1816]/15 rounded-xl px-3.5 py-2 text-sm text-checkerboard focus:outline-hidden focus:border-tangerine"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-medium text-[#666059] mb-1">
                    Address Line 1 (Villa/Flat, Building, Street) *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressFormData.streetLine1}
                    onChange={(e) => setAddressFormData({ ...addressFormData, streetLine1: e.target.value })}
                    placeholder="e.g. Penthouse 4B, Malabar Residences, B.G. Kher Marg"
                    className="w-full bg-[#FAF8F5] border border-[#1A1816]/15 rounded-xl px-3.5 py-2 text-sm text-checkerboard focus:outline-hidden focus:border-tangerine"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-medium text-[#666059] mb-1">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      value={addressFormData.streetLine2 || ''}
                      onChange={(e) => setAddressFormData({ ...addressFormData, streetLine2: e.target.value })}
                      placeholder="e.g. Near Governor's Estate"
                      className="w-full bg-[#FAF8F5] border border-[#1A1816]/15 rounded-xl px-3.5 py-2 text-sm text-checkerboard focus:outline-hidden focus:border-tangerine"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-medium text-[#666059] mb-1">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={addressFormData.landmark || ''}
                      onChange={(e) => setAddressFormData({ ...addressFormData, landmark: e.target.value })}
                      placeholder="e.g. Opposite Hanging Gardens"
                      className="w-full bg-[#FAF8F5] border border-[#1A1816]/15 rounded-xl px-3.5 py-2 text-sm text-checkerboard focus:outline-hidden focus:border-tangerine"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-medium text-[#666059] mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={addressFormData.city}
                      onChange={(e) => setAddressFormData({ ...addressFormData, city: e.target.value })}
                      placeholder="Mumbai"
                      className="w-full bg-[#FAF8F5] border border-[#1A1816]/15 rounded-xl px-3 py-2 text-sm text-checkerboard focus:outline-hidden focus:border-tangerine"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-medium text-[#666059] mb-1">
                      State *
                    </label>
                    <select
                      value={addressFormData.stateProvince}
                      onChange={(e) => setAddressFormData({ ...addressFormData, stateProvince: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#1A1816]/15 rounded-xl px-2.5 py-2 text-xs text-checkerboard focus:outline-hidden focus:border-tangerine"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-medium text-[#666059] mb-1">
                      PIN Code (6 Digits) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={addressFormData.postalCode}
                      onChange={(e) => setAddressFormData({ ...addressFormData, postalCode: e.target.value })}
                      placeholder="400006"
                      className="w-full bg-[#FAF8F5] border border-[#1A1816]/15 rounded-xl px-3 py-2 text-sm text-checkerboard focus:outline-hidden focus:border-tangerine"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-medium text-[#666059] mb-1.5">
                      Destination Type
                    </label>
                    <div className="flex items-center space-x-2">
                      {(['Home', 'Work', 'Other'] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setAddressFormData({ ...addressFormData, addressType: type })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider cursor-pointer border transition-colors ${
                            addressFormData.addressType === type
                              ? 'bg-checkerboard text-white border-checkerboard'
                              : 'bg-white text-[#666059] border-[#1A1816]/15 hover:border-checkerboard'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="inline-flex items-center space-x-2 text-xs text-checkerboard font-medium cursor-pointer self-start sm:self-end">
                    <input
                      type="checkbox"
                      checked={addressFormData.isDefault}
                      onChange={(e) => setAddressFormData({ ...addressFormData, isDefault: e.target.checked })}
                      className="w-4 h-4 rounded-sm border-gray-300 text-tangerine focus:ring-tangerine"
                    />
                    <span>Make Primary Residence</span>
                  </label>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#1A1816]/10">
                  <button
                    type="button"
                    onClick={() => setIsAddressModalOpen(false)}
                    className="py-2.5 px-5 rounded-full border border-[#1A1816]/15 text-xs text-[#666059] hover:text-checkerboard transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingAddress}
                    className="py-2.5 px-6 rounded-full bg-checkerboard hover:bg-tangerine text-white text-xs uppercase tracking-wider font-semibold transition-colors disabled:opacity-50 cursor-pointer flex items-center space-x-2 shadow-md"
                  >
                    {isSavingAddress ? (
                      <>
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{editingAddressId ? 'Update Residence' : 'Save Residence'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountPage;
