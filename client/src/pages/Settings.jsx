import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Lock,
  Globe,
  Building,
  ShieldCheck,
  Check,
  Save,
  AlertCircle,
  Eye,
  EyeOff,
  Bell,
  Sparkles,
  ArrowLeft,
  Crown,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocationContext, COUNTRIES } from '../context/LocationContext';
import { PHONE_COUNTRY_CODES, parsePhoneNumber, getPhoneCodeByCountry } from '../data/phoneCodes';
import API from '../services/api';

const Settings = () => {
  const { user, updateProfile, logout } = useAuth();
  const { country: currentContextCountry, city: currentContextCity, cinemas } = useLocationContext();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneCode, setPhoneCode] = useState('+91');
  const [phoneNational, setPhoneNational] = useState('');
  const [preferredCountry, setPreferredCountry] = useState('IN');
  const [preferredCity, setPreferredCity] = useState('Mumbai');
  const [preferredCinema, setPreferredCinema] = useState('');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Notifications
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailReceipts, setEmailReceipts] = useState(true);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      if (user.phone) {
        const parsed = parsePhoneNumber(user.phone);
        setPhoneCode(parsed.dialCode);
        setPhoneNational(parsed.nationalNumber);
      } else {
        const defaultCode = getPhoneCodeByCountry(user.preferredCountry || currentContextCountry || 'IN');
        setPhoneCode(defaultCode.code);
      }
      setPreferredCountry(user.preferredCountry || currentContextCountry || 'IN');
      setPreferredCity(user.preferredCity || currentContextCity || 'Mumbai');
      setPreferredCinema(user.preferredCinema || '');
    }
  }, [user, currentContextCountry, currentContextCity]);

  // Load latest profile from API
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const { data } = await API.get('/auth/profile');
        if (data) {
          if (data.username) setUsername(data.username);
          if (data.email) setEmail(data.email);
          if (data.phone) {
            const parsed = parsePhoneNumber(data.phone);
            setPhoneCode(parsed.dialCode);
            setPhoneNational(parsed.nationalNumber);
          }
          if (data.preferredCountry) setPreferredCountry(data.preferredCountry);
          if (data.preferredCity) setPreferredCity(data.preferredCity);
          if (data.preferredCinema) setPreferredCinema(data.preferredCinema);
        }
      } catch (err) {
        if (user) {
          if (user.username) setUsername(user.username);
          if (user.email) setEmail(user.email);
          if (user.phone) {
            const parsed = parsePhoneNumber(user.phone);
            setPhoneCode(parsed.dialCode);
            setPhoneNational(parsed.nationalNumber);
          }
          if (user.preferredCountry) setPreferredCountry(user.preferredCountry);
          if (user.preferredCity) setPreferredCity(user.preferredCity);
          if (user.preferredCinema) setPreferredCinema(user.preferredCinema || '');
        }
      }
    };
    if (user) {
      fetchLatest();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4 px-4">
        <p className="text-[#2B2B2B] font-bold text-lg">Please sign in to access your Account Settings</p>
        <Link
          to="/login"
          className="inline-block px-6 py-2.5 rounded-xl bg-[#E63946] hover:bg-[#D62839] text-white font-bold text-xs shadow-md transition-all"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const selectedCountryObj = COUNTRIES.find((c) => c.code === preferredCountry) || COUNTRIES[0];
  const availableCities = selectedCountryObj?.cities || ['Mumbai', 'Delhi', 'Bengaluru'];
  const selectedPhoneObj = PHONE_COUNTRY_CODES.find((p) => p.code === phoneCode) || PHONE_COUNTRY_CODES[0];

  const handleCountryChange = (code) => {
    setPreferredCountry(code);
    const countryData = COUNTRIES.find((c) => c.code === code);
    if (countryData && countryData.cities && countryData.cities.length > 0) {
      setPreferredCity(countryData.cities[0]);
    }
    const matchingPhone = getPhoneCodeByCountry(code);
    if (matchingPhone) {
      setPhoneCode(matchingPhone.code);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!username.trim()) {
      setErrorMsg('Full name cannot be empty.');
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        setErrorMsg('New password must be at least 6 characters long.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMsg('New passwords do not match. Please re-enter.');
        return;
      }
      if (!currentPassword) {
        setErrorMsg('Please enter your current password to confirm password change.');
        return;
      }
    }

    try {
      setLoading(true);
      const fullPhone = phoneNational.trim() ? `${phoneCode} ${phoneNational.trim()}` : '';
      await updateProfile({
        username: username.trim(),
        email: email.trim(),
        phone: fullPhone,
        preferredCountry,
        preferredCity,
        preferredCinema,
        currentPassword: newPassword ? currentPassword : undefined,
        newPassword: newPassword ? newPassword : undefined
      });

      setSuccessMsg('Account details and settings successfully updated!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        setSuccessMsg('');
      }, 5000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update account details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      {/* Header with Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE2D5] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-1">
            <Link to="/profile" className="hover:text-[#E63946] transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Profile</span>
            </Link>
            <span>/</span>
            <span className="text-[#E63946] font-semibold">Account Settings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2B2B2B] tracking-tight flex items-center gap-3">
            <span>Account Settings</span>
            {user.role === 'admin' ? (
              <span className="text-xs uppercase font-bold tracking-wider text-rose-800 bg-[#FDECEC] border border-rose-200 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-[#E63946]" />
                Admin
              </span>
            ) : (
              <span className="text-xs uppercase font-bold tracking-wider text-amber-900 bg-[#FFF6DC] border border-amber-300/70 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                Verified Patron
              </span>
            )}
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Manage your personal profile, contact information, default theater, and security credentials.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link
            to="/profile"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#FFF6DC] border border-[#EAE2D5] hover:border-[#FFC93C] text-[#2B2B2B] hover:text-[#C1121F] text-xs font-bold transition-all shadow-sm"
          >
            <User className="w-4 h-4 text-[#E63946]" />
            <span>View Profile</span>
          </Link>
        </div>
      </div>

      {/* Status Messages */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-3 shadow-xs animate-in fade-in">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-[#FDECEC] border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold flex items-center gap-3 shadow-xs animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-[#E63946] shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Personal Details */}
        <div className="bg-white border border-[#EAE2D5] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-[#EAE2D5] pb-3">
            <User className="w-4 h-4 text-[#E63946]" />
            <h2 className="text-base font-bold text-[#2B2B2B] tracking-wide">Personal Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2B2B2B] flex items-center gap-1.5">
                <span>Full Name / Display Name</span>
                <span className="text-[#E63946]">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="e.g. John Doe"
                  className="w-full bg-[#FFFDF9] border border-[#EAE2D5] focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946]/30 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#2B2B2B] placeholder-[#9CA3AF] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2B2B2B] flex items-center gap-1.5">
                <span>Email Address</span>
                <span className="text-[#E63946]">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full bg-[#FFFDF9] border border-[#EAE2D5] focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946]/30 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#2B2B2B] placeholder-[#9CA3AF] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-[#2B2B2B] flex items-center justify-between gap-1.5">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#E63946]" />
                  <span>Phone Number (for SMS Passes & Instant Seat Hold Alerts)</span>
                </span>
                <span className="text-[11px] font-mono font-bold text-[#D62839]">
                  {selectedPhoneObj?.flag} {selectedPhoneObj?.name} ({selectedPhoneObj?.code})
                </span>
              </label>

              <div className="flex flex-col sm:flex-row gap-2.5">
                {/* Comprehensive Worldwide Country Dial Code Dropdown */}
                <div className="relative sm:w-64 shrink-0">
                  <select
                    value={phoneCode}
                    onChange={(e) => setPhoneCode(e.target.value)}
                    aria-label="Country Dial Code"
                    className="w-full bg-[#FFFDF9] hover:bg-[#FFF6DC]/50 border border-[#EAE2D5] focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946]/30 rounded-xl px-3 py-2.5 text-xs text-[#2B2B2B] font-medium focus:outline-none transition-colors cursor-pointer"
                  >
                    {PHONE_COUNTRY_CODES.map((item) => (
                      <option key={`${item.country}-${item.code}`} value={item.code}>
                        {item.flag} {item.code} — {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* National Phone Number Input */}
                <div className="relative flex-1">
                  <input
                    type="tel"
                    value={phoneNational}
                    onChange={(e) => setPhoneNational(e.target.value)}
                    placeholder={selectedPhoneObj?.placeholder || '98765 43210'}
                    className="w-full bg-[#FFFDF9] border border-[#EAE2D5] focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946]/30 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#2B2B2B] placeholder-[#9CA3AF] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#6B7280] pt-0.5">
                <span>
                  Configured for all international country regions with instant SMS boarding pass links.
                </span>
                {phoneNational && (
                  <span className="font-mono text-[#2B2B2B] font-bold text-[10px] bg-[#FFF6DC] border border-[#FFEDB0] px-2 py-0.5 rounded">
                    Full Number: {phoneCode} {phoneNational}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Preferred Theaters & Location */}
        <div className="bg-white border border-[#EAE2D5] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-[#EAE2D5] pb-3">
            <Globe className="w-4 h-4 text-[#E63946]" />
            <h2 className="text-base font-bold text-[#2B2B2B] tracking-wide">Theatrical Location Preferences</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2B2B2B]">Default Country</label>
              <select
                value={preferredCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full bg-[#FFFDF9] border border-[#EAE2D5] focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946]/30 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#2B2B2B] focus:outline-none transition-colors"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name} ({c.currency})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2B2B2B]">Default City / Metro</label>
              <select
                value={preferredCity}
                onChange={(e) => setPreferredCity(e.target.value)}
                className="w-full bg-[#FFFDF9] border border-[#EAE2D5] focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946]/30 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#2B2B2B] focus:outline-none transition-colors"
              >
                {availableCities.map((ct) => (
                  <option key={ct} value={ct}>
                    {ct}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-[#2B2B2B] flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#E63946]" />
                <span>Preferred Home Theatre</span>
              </label>
              <input
                type="text"
                value={preferredCinema}
                onChange={(e) => setPreferredCinema(e.target.value)}
                placeholder="e.g. iMovies Lincoln Square IMAX Laser or PVR ICON Lower Parel"
                className="w-full bg-[#FFFDF9] border border-[#EAE2D5] focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946]/30 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#2B2B2B] placeholder-[#9CA3AF] focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Security & Password Update */}
        <div className="bg-white border border-[#EAE2D5] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-[#EAE2D5] pb-3">
            <Lock className="w-4 h-4 text-[#E63946]" />
            <h2 className="text-base font-bold text-[#2B2B2B] tracking-wide">Security & Password (Optional)</h2>
          </div>
          <p className="text-xs text-[#6B7280]">
            Leave these fields blank if you do not wish to change your existing password.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-[#2B2B2B]">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password to verify identity"
                  className="w-full bg-[#FFFDF9] border border-[#EAE2D5] focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946]/30 rounded-xl px-4 pr-10 py-2.5 text-xs sm:text-sm text-[#2B2B2B] placeholder-[#9CA3AF] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#2B2B2B]"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2B2B2B]">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-[#FFFDF9] border border-[#EAE2D5] focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946]/30 rounded-xl px-4 pr-10 py-2.5 text-xs sm:text-sm text-[#2B2B2B] placeholder-[#9CA3AF] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#2B2B2B]"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2B2B2B]">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full bg-[#FFFDF9] border border-[#EAE2D5] focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946]/30 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#2B2B2B] placeholder-[#9CA3AF] focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Notification Preferences */}
        <div className="bg-white border border-[#EAE2D5] rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-[#EAE2D5] pb-3">
            <Bell className="w-4 h-4 text-[#E63946]" />
            <h2 className="text-base font-bold text-[#2B2B2B] tracking-wide">Pass Delivery & Alerts</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFFDF9] border border-[#EAE2D5] cursor-pointer hover:border-[#FFC93C] transition-colors">
              <div>
                <p className="text-xs font-bold text-[#2B2B2B]">Instant SMS Boarding Pass Link</p>
                <p className="text-[11px] text-[#6B7280]">Receive direct QR passes on mobile prior to movie showtime</p>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 accent-[#E63946] rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFFDF9] border border-[#EAE2D5] cursor-pointer hover:border-[#FFC93C] transition-colors">
              <div>
                <p className="text-xs font-bold text-[#2B2B2B]">Email Tax Invoices & Calendar Reminders</p>
                <p className="text-[11px] text-[#6B7280]">PDF receipts and automatic .ics calendar sync</p>
              </div>
              <input
                type="checkbox"
                checked={emailReceipts}
                onChange={(e) => setEmailReceipts(e.target.checked)}
                className="w-4 h-4 accent-[#E63946] rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Section 5: Account Session & Sign Out */}
        <div className="bg-white border border-rose-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-rose-100 pb-3">
            <div className="flex items-center gap-2.5">
              <LogOut className="w-4 h-4 text-[#E63946]" />
              <h2 className="text-base font-bold text-[#2B2B2B] tracking-wide">Account Session & Security</h2>
            </div>
            <span className="text-[11px] font-semibold text-[#E63946] bg-[#FDECEC] border border-rose-200 px-2.5 py-0.5 rounded-lg">
              Active Session
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-semibold text-[#2B2B2B]">
                Logged in as <span className="text-[#2B2B2B] font-bold">{user.username}</span>{' '}
                <span className="text-[#6B7280]">({user.email})</span>
              </p>
              <p className="text-xs text-[#6B7280] leading-relaxed max-w-xl">
                Need to switch accounts or secure this device? Signing out will safely invalidate your active browser session tokens and return you to the login screen.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#FDECEC] hover:bg-rose-100 border border-rose-200 text-[#E63946] hover:text-[#D62839] font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0 group"
            >
              <LogOut className="w-4 h-4 text-[#E63946] group-hover:translate-x-0.5 transition-transform" />
              <span>Log Out of iMovies</span>
            </button>
          </div>
        </div>

        {/* Submit Button Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            to="/profile"
            className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-[#EAE2D5] text-[#2B2B2B] text-xs font-bold transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-[#E63946] hover:bg-[#D62839] text-white font-bold px-7 py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving Changes...' : 'Save Account Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
