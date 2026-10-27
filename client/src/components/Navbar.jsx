import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Ticket, LogOut, User, Crown, Globe, Building, Search, Compass, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocationContext } from '../context/LocationContext';
import LocationPickerModal from './LocationPickerModal';
import MovieSearchBar from './MovieSearchBar';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { country, state, city, activeCountry, detectCurrentLocation, detectingLocation } = useLocationContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EAE2D5] shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group whitespace-nowrap shrink-0">
            {/* Attractive Custom Cinema Emblem */}
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#FF4D5A] via-[#E63946] to-[#9E0B19] p-0.5 shadow-md shadow-[#E63946]/25 group-hover:shadow-lg group-hover:shadow-[#E63946]/40 group-hover:scale-105 transition-all duration-300 flex items-center justify-center">
              <div className="w-full h-full rounded-[10px] bg-gradient-to-b from-black/20 via-transparent to-black/40 flex items-center justify-center relative overflow-hidden">
                {/* Specular highlight */}
                <div className="absolute -top-3 -right-3 w-7 h-7 bg-white/30 rounded-full blur-xs pointer-events-none" />
                
                {/* Cinema Projector / Film Star Emblem SVG */}
                <svg className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white drop-shadow-xs" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2.5" y="4" width="19" height="16" rx="3.5" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="5.5" cy="7.5" r="1.1" fill="#FFC93C" />
                  <circle cx="5.5" cy="12" r="1.1" fill="#FFC93C" />
                  <circle cx="5.5" cy="16.5" r="1.1" fill="#FFC93C" />
                  <circle cx="18.5" cy="7.5" r="1.1" fill="#FFC93C" />
                  <circle cx="18.5" cy="12" r="1.1" fill="#FFC93C" />
                  <circle cx="18.5" cy="16.5" r="1.1" fill="#FFC93C" />
                  <path d="M10 8.5L16 12L10 15.5V8.5Z" fill="url(#logoGoldGrad)" />
                  <defs>
                    <linearGradient id="logoGoldGrad" x1="10" y1="8.5" x2="16" y2="15.5" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFF4B8" />
                      <stop offset="1" stopColor="#FFC93C" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Logo Typography with sparkling flair */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#1F2937]">
                  <span className="text-[#E63946] inline-block -mr-0.5">i</span>
                  <span>Movies</span>
                </span>
                <span className="text-[9px] uppercase font-bold tracking-[0.2em] bg-gradient-to-r from-[#FFF6DC] to-[#FFEDB0] text-[#7A5B14] border border-[#FFC93C]/50 px-1.5 py-0.5 rounded-md shadow-2xs hidden xs:inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E63946] inline-block animate-pulse" />
                  <span>Cinemas</span>
                </span>
              </div>
              <span className="text-[9px] font-bold tracking-wider text-[#9CA3AF] uppercase hidden sm:block mt-0.5">
                IMAX Laser & Recliner Suites
              </span>
            </div>
          </Link>

          {/* Nav Links - Purely Movies & Cinemas (Passes removed near Movies/Cinemas as requested) */}
          <nav className="hidden sm:flex items-center gap-6 text-xs sm:text-sm font-semibold">
            <Link
              to="/"
              className={`whitespace-nowrap transition-colors relative py-1 ${
                isActive('/') ? 'text-[#E63946] font-bold' : 'text-[#6B7280] hover:text-[#E63946]'
              }`}
            >
              Movies
              {isActive('/') && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#E63946] rounded-full" />
              )}
            </Link>

            <Link
              to="/cinemas"
              className={`whitespace-nowrap flex items-center gap-1.5 transition-colors relative py-1 ${
                isActive('/cinemas') ? 'text-[#E63946] font-bold' : 'text-[#6B7280] hover:text-[#E63946]'
              }`}
            >
              <Building className="w-3.5 h-3.5 text-[#E63946]" />
              <span>Cinemas</span>
              {isActive('/cinemas') && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#E63946] rounded-full" />
              )}
            </Link>
          </nav>

          {/* Universal Movie Search Bar (Desktop / Tablet) */}
          <div className="hidden sm:block flex-1 max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-2 sm:mx-4 lg:mx-8">
            <MovieSearchBar />
          </div>

          {/* Right Section: Mobile Search Toggle + Location Selector & Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Mobile Search Toggle */}
            <button
              type="button"
              onClick={() => setShowMobileSearch((prev) => !prev)}
              aria-label="Toggle movie search bar"
              className={`sm:hidden w-8 h-8 rounded-xl flex items-center justify-center transition-colors border ${
                showMobileSearch
                  ? 'bg-[#E63946] text-white border-[#E63946]'
                  : 'bg-white text-[#E63946] border-[#EAE2D5] hover:bg-[#FFF6DC]'
              }`}
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Quick Live Location Button */}
            <button
              type="button"
              onClick={async () => {
                try {
                  await detectCurrentLocation();
                } catch (e) {
                  console.error(e);
                }
              }}
              disabled={detectingLocation}
              title="Fetch live location automatically"
              className="w-8 h-8 rounded-xl bg-white hover:bg-[#FFF6DC] border border-[#EAE2D5] text-[#E63946] flex items-center justify-center transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Compass className={`w-3.5 h-3.5 ${detectingLocation ? 'animate-spin' : ''}`} />
            </button>

            {/* Worldwide Location Selector Pill */}
            <button
              type="button"
              onClick={() => setShowLocationModal(true)}
              className="flex items-center gap-1.5 text-xs text-[#2B2B2B] bg-[#FFF9F0] hover:bg-[#FFF6DC] border border-[#EAE2D5] px-2.5 sm:px-3 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer"
              title={`Change Country, State & City (${city}, ${state || ''}, ${activeCountry?.name || ''})`}
            >
              <Globe className="w-3.5 h-3.5 text-[#E63946]" aria-hidden="true" />
              <span className="font-bold text-[#2B2B2B] max-w-[80px] sm:max-w-[100px] truncate">
                {city}
              </span>
              <span className="text-[10px] font-mono text-[#D62839] font-bold hidden xs:inline">
                ({activeCountry?.currency})
              </span>
            </button>

            {user ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 sm:gap-2 text-xs text-[#2B2B2B] bg-white hover:bg-[#FFF6DC] border border-[#EAE2D5] px-2.5 sm:px-3 py-1.5 rounded-xl shadow-xs transition-colors"
                  title="View Profile"
                >
                  {user.role === 'admin' ? (
                    <Crown className="w-3.5 h-3.5 text-[#E5B129] shrink-0" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-[#E63946] shrink-0" />
                  )}
                  <span className="font-bold text-[#2B2B2B] truncate max-w-[70px] sm:max-w-[110px]">
                    {user.username}
                  </span>
                </Link>

                <Link
                  to="/settings"
                  title="Account Settings"
                  aria-label="Account Settings"
                  className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl text-[#6B7280] hover:text-[#E63946] bg-white hover:bg-[#FFF6DC] border border-[#EAE2D5] transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs sm:text-sm font-bold text-[#2B2B2B] hover:text-[#E63946] bg-white hover:bg-[#FFF6DC] border border-[#EAE2D5] px-3 sm:px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap shadow-xs inline-flex items-center gap-1.5"
                  title="Sign In to your account"
                >
                  <User className="w-3.5 h-3.5 text-[#E63946]" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/settings"
                  className="text-xs sm:text-sm font-bold bg-[#E63946] hover:bg-[#D62839] text-white px-3 sm:px-4 py-1.5 rounded-xl shadow-sm shadow-[#E63946]/20 transition-all whitespace-nowrap inline-flex items-center gap-1.5"
                  title="Settings"
                >
                  <Settings className="w-3.5 h-3.5 text-white" />
                  <span>Settings</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar Expansion */}
        {showMobileSearch && (
          <div className="sm:hidden px-3 py-2.5 bg-[#FFF9F0] border-t border-[#EAE2D5] shadow-md">
            <MovieSearchBar onSearchSubmit={() => setShowMobileSearch(false)} />
          </div>
        )}
      </header>

      {/* Worldwide Region Modal */}
      <LocationPickerModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
      />
    </>
  );
};

export default Navbar;