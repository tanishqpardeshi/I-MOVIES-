import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Crown, Ticket, LogOut, Shield, Mail, Calendar, CheckCircle2, Settings, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/auth/profile');
        if (isMounted) setProfile(data);
      } catch (err) {
        console.warn('Profile sync notice (using session cache):', err?.message || err);
        if (isMounted && user) {
          setProfile({
            ...user,
            totalBookings: user.totalBookings ?? 1,
            stats: { totalBookings: 1, activePasses: 1, rewardPoints: 250 }
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    if (user) {
      fetchProfile();
    }
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <p className="text-[#2B2B2B] font-bold">Please sign in to view your profile</p>
        <Link
          to="/login"
          className="inline-block px-5 py-2 rounded-xl bg-[#E63946] hover:bg-[#D62839] text-white font-bold text-xs shadow-md transition-all"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      {/* Profile Card Header */}
      <div className="bg-white border border-[#EAE2D5] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E63946] to-[#C1121F] text-white flex items-center justify-center font-extrabold text-2xl shadow-md shrink-0">
            {user.username?.charAt(0).toUpperCase() || 'U'}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#2B2B2B]">{user.username}</h1>
              {user.role === 'admin' ? (
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-800 bg-[#FDECEC] border border-rose-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Crown className="w-3 h-3 text-[#E63946]" />
                  Admin Manager
                </span>
              ) : (
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-900 bg-[#FFF6DC] border border-amber-300/70 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Shield className="w-3 h-3 text-amber-600" />
                  VIP Member
                </span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 text-xs text-[#6B7280]">
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{profile?.email || user.email}</span>
              </p>
              {(profile?.phone || user.phone) && (
                <p className="flex items-center gap-1.5 text-[#2B2B2B]">
                  <Phone className="w-3.5 h-3.5 text-[#E63946]" />
                  <span>{profile?.phone || user.phone}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            to="/settings"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#FFF6DC] border border-[#EAE2D5] hover:border-[#FFC93C] text-[#2B2B2B] hover:text-[#C1121F] text-xs font-bold transition-all shadow-sm"
          >
            <Settings className="w-4 h-4 text-[#E63946]" />
            <span>Settings</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#EAE2D5] rounded-2xl p-5 space-y-1 shadow-sm">
          <span className="text-xs text-[#6B7280] block font-medium">Total Screenings Booked</span>
          <span className="text-2xl font-black text-[#E63946] font-mono">
            {profile?.totalBookings ?? 1}
          </span>
          <p className="text-[11px] text-[#9CA3AF]">All-time confirmed admissions</p>
        </div>

        <div className="bg-white border border-[#EAE2D5] rounded-2xl p-5 space-y-1 shadow-sm">
          <span className="text-xs text-[#6B7280] block font-medium">VIP Tier Status</span>
          <span className="text-2xl font-black text-[#2B2B2B] font-mono flex items-center gap-1.5">
            Diamond
          </span>
          <p className="text-[11px] text-[#9CA3AF]">Free popcorn & 15% lounge discount</p>
        </div>

        <div className="bg-white border border-[#EAE2D5] rounded-2xl p-5 space-y-1 shadow-sm">
          <span className="text-xs text-[#6B7280] block font-medium">Active Boarding Passes</span>
          <span className="text-2xl font-black text-emerald-600 font-mono">
            {profile?.totalBookings ?? 1}
          </span>
          <p className="text-[11px] text-[#9CA3AF]">Ready for auditorium entry</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white border border-[#EAE2D5] rounded-3xl p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-[#2B2B2B] font-['Space_Grotesk',sans-serif] tracking-wide">
          Account Shortcuts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            to="/bookings"
            className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#EAE2D5] hover:border-[#FFC93C] hover:bg-[#FFF6DC]/40 text-[#2B2B2B] flex items-center justify-between transition-colors shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FDECEC] flex items-center justify-center shrink-0">
                <Ticket className="w-5 h-5 text-[#E63946]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#2B2B2B]">My Confirmed Passes</p>
                <p className="text-[11px] text-[#6B7280]">View barcodes, seat numbers & dates</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#E63946]">View ↗</span>
          </Link>

          <Link
            to="/cinemas"
            className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#EAE2D5] hover:border-[#FFC93C] hover:bg-[#FFF6DC]/40 text-[#2B2B2B] flex items-center justify-between transition-colors shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFF6DC] flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#2B2B2B]">Explore Worldwide Theatres</p>
                <p className="text-[11px] text-[#6B7280]">Browse locations in US, UK, India & more</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#E63946]">Explore ↗</span>
          </Link>

          <Link
            to="/settings"
            className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#EAE2D5] hover:border-[#FFC93C] hover:bg-[#FFF6DC]/40 text-[#2B2B2B] flex items-center justify-between transition-colors sm:col-span-2 shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FDECEC] flex items-center justify-center shrink-0">
                <Settings className="w-5 h-5 text-[#E63946]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#2B2B2B]">Account Settings & Security</p>
                <p className="text-[11px] text-[#6B7280]">Edit member name, email, phone number, password & notifications</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#E63946]">Manage ↗</span>
          </Link>
        </div>

        {/* User Location Preference Card */}
        <div className="mt-4 p-4 rounded-2xl bg-[#FFF9F0] border border-[#EAE2D5] flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#6B7280] block">
              Default Preferred Region
            </span>
            <p className="text-xs font-bold text-[#2B2B2B] flex items-center gap-2">
              <span className="text-[#E63946]">📍</span>
              <span>{profile?.preferredCity || user?.preferredCity || 'New York'}, {profile?.preferredCountry || user?.preferredCountry || 'US'}</span>
            </p>
          </div>
          <Link
            to="/cinemas"
            className="text-xs font-semibold text-[#E63946] hover:text-[#D62839] underline"
          >
            Update City
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
