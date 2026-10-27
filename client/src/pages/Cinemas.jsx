import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building,
  MapPin,
  Star,
  Film,
  Sparkles,
  Clock,
  Compass,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { useLocationContext, COUNTRIES } from '../context/LocationContext';
import NearbyCinemaFinder from '../components/NearbyCinemaFinder';

const Cinemas = () => {
  const navigate = useNavigate();
  const {
    country,
    state,
    city,
    cinemas,
    loadingCinemas,
    activeCountry,
    currentState,
    setCountry,
    setState,
    setCity,
    formatPrice,
    setSelectedCinema,
    detectCurrentLocation,
    detectingLocation,
    locationStatus
  } = useLocationContext();

  const [activeFormatFilter, setActiveFormatFilter] = useState('All');

  const FORMATS = ['All', 'IMAX Laser', 'Dolby Cinema', 'VIP Recliners', '4DX', 'ScreenX'];

  const filteredCinemas = cinemas.filter((c) => {
    if (activeFormatFilter === 'All') return true;
    return c.formats && c.formats.some((f) => f.toLowerCase().includes(activeFormatFilter.toLowerCase()));
  });

  const statesList = activeCountry?.states || [];
  const citiesList = currentState?.cities || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Geolocation Nearby Cinema Finder & Showtimes */}
      <NearbyCinemaFinder />

      {/* Header for All Theatres Directory */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#EAE2D5] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#E63946] bg-[#FDECEC] border border-[#FCD7D7] px-3 py-1 rounded-lg mb-2">
            <Compass className="w-3.5 h-3.5 text-[#E63946]" />
            Global Luxury Exhibition Network
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#2B2B2B] tracking-tight">
            Worldwide Cinema Theatres
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1 max-w-2xl">
            Explore world-class auditoriums featuring laser projection, immersive 12-channel Dolby Atmos sound, and motorized leather recliners in {city}, {state ? `${state}, ` : ''}{activeCountry?.name}.
          </p>
        </div>

        {/* Quick Country Switcher & Use Current Location */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 self-stretch md:self-auto">
          <button
            type="button"
            onClick={async () => {
              try {
                await detectCurrentLocation();
              } catch {
                // handled in status
              }
            }}
            disabled={detectingLocation}
            className="flex items-center justify-center gap-2 bg-[#FFF6DC] hover:bg-[#FFEDB0] border border-[#FFC93C] text-[#2B2B2B] hover:text-[#1A1D20] px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
            title="Automatically detect nearby cinema city"
          >
            <Compass className={`w-3.5 h-3.5 text-[#E63946] ${detectingLocation ? 'animate-spin' : ''}`} />
            <span>{detectingLocation ? 'Locating...' : 'Use My Current Location'}</span>
          </button>

          <div className="flex flex-wrap items-center gap-1.5 bg-[#FFF9F0] border border-[#EAE2D5] p-1.5 rounded-2xl text-xs">
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="bg-transparent text-[#2B2B2B] font-semibold px-1.5 py-1 focus:outline-none cursor-pointer"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-white text-[#2B2B2B]">
                  {c.code} {c.name}
                </option>
              ))}
            </select>
            <span className="text-[#DCD3C5]">|</span>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="bg-transparent text-[#2B2B2B] font-medium px-1.5 py-1 focus:outline-none cursor-pointer max-w-[110px] truncate"
            >
              {statesList.map((st) => (
                <option key={st.name} value={st.name} className="bg-white text-[#2B2B2B]">
                  {st.name}
                </option>
              ))}
            </select>
            <span className="text-[#DCD3C5]">|</span>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="bg-transparent text-[#E63946] font-bold px-1.5 py-1 focus:outline-none cursor-pointer max-w-[110px] truncate"
            >
              {citiesList.map((ct) => (
                <option key={ct} value={ct} className="bg-white text-[#2B2B2B]">
                  {ct}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {locationStatus?.message && (
        <div className="bg-[#FFF6DC] border border-[#FFEDB0] text-[#7A5B14] text-xs px-4 py-2 rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 shrink-0 text-[#E5B129]" />
          <span>{locationStatus.message} — displaying nearby cinemas in {city}.</span>
        </div>
      )}

      {/* Format Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {FORMATS.map((fmt) => (
          <button
            key={fmt}
            type="button"
            onClick={() => setActiveFormatFilter(fmt)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeFormatFilter === fmt
                ? 'bg-gradient-to-r from-[#E63946] to-[#C1121F] text-white shadow-sm shadow-[#E63946]/20'
                : 'bg-white border border-[#EAE2D5] text-[#4B5563] hover:text-[#2B2B2B] hover:bg-[#FFF6DC]'
            }`}
          >
            {fmt}
          </button>
        ))}
      </div>

      {/* Cinema Listings */}
      {loadingCinemas ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-64 rounded-3xl bg-white animate-pulse border border-[#EAE2D5]" />
          ))}
        </div>
      ) : filteredCinemas.length === 0 ? (
        <div className="bg-white border border-[#EAE2D5] rounded-3xl p-12 text-center space-y-3 shadow-xs">
          <Building className="w-10 h-10 text-[#9CA3AF] mx-auto" />
          <h3 className="text-base font-bold text-[#2B2B2B]">
            {activeFormatFilter !== 'All' ? `No ${activeFormatFilter} Theatres in ${city}` : `No Theatres in ${city}`}
          </h3>
          <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
            {activeFormatFilter !== 'All'
              ? `No auditoriums in ${city} match "${activeFormatFilter}". Reset your format filter to explore all local screens.`
              : `Try choosing a different city in ${activeCountry.name}.`}
          </p>
          {activeFormatFilter !== 'All' && (
            <button
              type="button"
              onClick={() => setActiveFormatFilter('All')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#E63946] text-white hover:bg-[#D62839] transition-all cursor-pointer shadow-xs"
            >
              Show All Theatres in {city}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCinemas.map((cin) => (
            <div
              key={cin._id}
              className="bg-white border border-[#EAE2D5] hover:border-[#E63946]/50 rounded-3xl p-6 space-y-5 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#E63946]/10"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[#B91C1C] bg-gradient-to-r from-[#FDECEC] to-[#FEE2E2] border border-[#FECACA] px-2.5 py-0.5 rounded-lg shadow-xs">
                      {cin.city}, {cin.country}
                    </span>
                    <span className="text-xs text-[#6B7280] font-mono">{cin.screens} Auditoriums</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1F2937] tracking-tight">{cin.name}</h3>
                  <p className="text-xs text-[#6B7280] flex items-center gap-1.5 pt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#E63946] shrink-0" />
                    <span>{cin.address}</span>
                  </p>
                </div>

                <div className="flex items-center gap-1 text-xs font-black text-[#92400E] bg-gradient-to-r from-[#FFF6DC] to-[#FEF3C7] border border-[#FCD34D] px-2.5 py-1 rounded-xl shrink-0 shadow-xs">
                  <Star className="w-3.5 h-3.5 fill-[#F59E0B] stroke-none" />
                  <span className="font-mono">{cin.rating || 4.9}</span>
                </div>
              </div>

              {/* Formats Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {cin.formats.map((fmt) => (
                  <span
                    key={fmt}
                    className="text-[11px] font-bold text-[#2B2B2B] bg-[#FFF9F0] border border-[#EAE2D5] px-2.5 py-1 rounded-lg"
                  >
                    {fmt}
                  </span>
                ))}
              </div>

              {/* Amenities */}
              <div className="border-t border-[#EAE2D5] pt-3">
                <p className="text-[10px] uppercase font-bold tracking-wider text-[#6B7280] mb-2">
                  Auditorium Features
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-[#2B2B2B]">
                  {cin.amenities.map((am) => (
                    <div key={am} className="flex items-center gap-1.5 text-[11px]">
                      <CheckCircle className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                      <span className="truncate text-[#4B5563]">{am}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Action */}
              <div className="pt-3 border-t border-[#EAE2D5] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#6B7280] block uppercase tracking-wider font-bold">Tickets From</span>
                  <span className="text-base font-extrabold text-[#E63946] font-mono">
                    {cin.currencySymbol}
                    {cin.basePrice}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#E63946] to-[#C1121F] hover:from-[#D62839] hover:to-[#9B111E] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm shadow-[#E63946]/20 hover:shadow-md transition-all cursor-pointer"
                >
                  <Film className="w-3.5 h-3.5" />
                  View Screenings Here
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cinemas;
