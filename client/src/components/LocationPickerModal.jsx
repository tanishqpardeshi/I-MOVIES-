import React, { useState } from 'react';
import { Globe, MapPin, Check, X, Search, Building, Compass, Layers, ChevronRight, AlertCircle } from 'lucide-react';
import { useLocationContext } from '../context/LocationContext';
import { LOCATION_HIERARCHY } from '../data/locations';

const LocationPickerModal = ({ isOpen, onClose }) => {
  const {
    country,
    state,
    city,
    activeCountry,
    currentState,
    selectedCinema,
    setCountry,
    setState,
    setCity,
    setSelectedCinema,
    cinemas,
    detectingLocation,
    locationStatus,
    detectCurrentLocation
  } = useLocationContext();

  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const currentCountryObj = activeCountry || LOCATION_HIERARCHY[0];
  const statesList = currentCountryObj.states || [];
  const currentCitiesList = currentState?.cities || [];

  // Filter countries or states or cities based on search
  const filteredCountries = LOCATION_HIERARCHY.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.states?.some((st) =>
        st.name.toLowerCase().includes(q) || st.cities.some((ct) => ct.toLowerCase().includes(q))
      )
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-[#EAE2D5] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE2D5] bg-[#FFF9F0]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FDECEC] border border-[#FCD7D7] flex items-center justify-center text-[#E63946]">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#2B2B2B] tracking-wide">
                Choose Location Hierarchy
              </h3>
              <p className="text-[11px] text-[#6B7280]">
                Select Country → State/Province → City for cinema showtimes & local currencies
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#FFF6DC] text-[#6B7280] hover:text-[#2B2B2B] border border-[#EAE2D5] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close location picker"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Location Action Banner */}
        <div className="p-4 bg-[#FFFDF5] border-b border-[#EAE2D5] flex flex-col gap-2.5">
          <button
            type="button"
            onClick={async () => {
              try {
                await detectCurrentLocation();
              } catch {
                // error is captured in locationStatus
              }
            }}
            disabled={detectingLocation}
            className="w-full bg-[#FFF6DC] hover:bg-[#FFEDB0] border border-[#FFC93C] text-[#2B2B2B] font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-all text-xs shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Compass className={`w-4 h-4 text-[#E63946] ${detectingLocation ? 'animate-spin' : ''}`} />
            <span>
              {detectingLocation ? 'Detecting your country, state & city...' : 'Use My Current Location'}
            </span>
          </button>

          {locationStatus?.message && (
            <div className="flex items-center gap-2 text-[11px] text-[#7A5B14] bg-[#FFF6DC] border border-[#FFEDB0] px-3 py-1.5 rounded-lg animate-in fade-in">
              <Check className="w-3.5 h-3.5 shrink-0 text-[#E5B129]" />
              <span>{locationStatus.message}</span>
              {locationStatus.isIndia && (
                <span className="ml-auto text-[10px] bg-[#E63946] text-white px-2 py-0.5 rounded font-bold">
                  India Preselected
                </span>
              )}
            </div>
          )}

          {locationStatus?.error && (
            <div className="flex items-center gap-2 text-[11px] text-[#B81D2D] bg-[#FDECEC] border border-[#FCD7D7] px-3 py-1.5 rounded-lg animate-in fade-in">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#E63946]" />
              <span>{locationStatus.error}</span>
            </div>
          )}
        </div>

        {/* Active Selection Breadcrumb Summary */}
        <div className="px-6 py-2.5 bg-[#FFF9F0] border-b border-[#EAE2D5] flex items-center gap-2 text-xs text-[#6B7280] overflow-x-auto">
          <span className="text-[10px] uppercase font-bold text-[#E63946] tracking-wider shrink-0">Selected:</span>
          <span className="font-semibold text-[#2B2B2B] shrink-0">{currentCountryObj.name} ({currentCountryObj.code})</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
          <span className="font-semibold text-[#2B2B2B] shrink-0">{state || 'Select State'}</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
          <span className="font-bold text-[#E63946] shrink-0">{city || 'Select City'}</span>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-[#EAE2D5] bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search country, state, or city name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#FFF9F0] border border-[#DCD3C5] rounded-xl pl-10 pr-4 py-2 text-xs text-[#2B2B2B] placeholder-[#9CA3AF] focus:outline-none focus:border-[#E63946] focus:bg-white"
            />
          </div>
        </div>

        {/* 3-Step Selection Scrollable Container */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs scrollbar-thin bg-white">
          {/* STEP 1: Country */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] uppercase tracking-wider font-bold text-[#2B2B2B] flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#E63946] text-white font-black text-[10px] flex items-center justify-center">1</span>
                <span>Select Country</span>
              </label>
              <span className="text-[10px] text-[#6B7280]">
                {filteredCountries.length} countries available
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filteredCountries.map((c) => {
                const isSelected = c.code === country;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setCountry(c.code)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#FFF6DC] border-[#FFC93C] text-[#2B2B2B] shadow-xs ring-1 ring-[#FFC93C]'
                        : 'bg-[#FFF9F0] border-[#EAE2D5] text-[#2B2B2B] hover:bg-[#FFF6DC]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-base shrink-0">{c.flag}</span>
                      <span className="font-semibold truncate">{c.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#E63946] font-bold ml-1 shrink-0">
                      {c.currency}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: State / Province / Region */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] uppercase tracking-wider font-bold text-[#2B2B2B] flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#E63946] text-white font-black text-[10px] flex items-center justify-center">2</span>
                <span>Select State / Province / Region ({currentCountryObj.name})</span>
              </label>
              <span className="text-[10px] text-[#6B7280]">
                {statesList.length} regions
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {statesList.map((st) => {
                const isSelected = st.name.toLowerCase() === (state || '').toLowerCase();
                return (
                  <button
                    key={st.name}
                    type="button"
                    onClick={() => setState(st.name)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#E63946] text-white font-bold border-[#D62839] shadow-xs'
                        : 'bg-[#FFF9F0] border-[#EAE2D5] text-[#2B2B2B] hover:bg-[#FFF6DC]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <Layers className={`w-3 h-3 shrink-0 ${isSelected ? 'text-white' : 'text-[#E63946]'}`} />
                      <span className="truncate">{st.name}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: City */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] uppercase tracking-wider font-bold text-[#2B2B2B] flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#E63946] text-white font-black text-[10px] flex items-center justify-center">3</span>
                <span>Select City in {state || currentCountryObj.name}</span>
              </label>
            </div>
            {currentCitiesList.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {currentCitiesList.map((ct) => {
                  const isSelected = ct.toLowerCase() === (city || '').toLowerCase();
                  return (
                    <button
                      key={ct}
                      type="button"
                      onClick={() => setCity(ct)}
                      className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#FFC93C] text-[#1A1D20] border-[#E5B129] font-bold shadow-xs'
                          : 'bg-[#FFF9F0] border-[#EAE2D5] text-[#2B2B2B] hover:bg-[#FFF6DC]'
                      }`}
                    >
                      <MapPin className="w-3 h-3 text-[#E63946]" />
                      <span>{ct}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-[#6B7280] italic">Please select a state to view available cities.</p>
            )}
          </div>

          {/* Cinemas Available in this City */}
          {cinemas && cinemas.length > 0 && (
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-bold text-[#2B2B2B] mb-2 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#E63946]" />
                <span>Preferred Luxury Auditorium in {city}</span>
              </label>
              <div className="space-y-2">
                {cinemas.map((cin) => {
                  const isSelected = selectedCinema?._id === cin._id;
                  return (
                    <button
                      key={cin._id}
                      type="button"
                      onClick={() => setSelectedCinema(cin)}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#FFF6DC] border-[#FFC93C] text-[#2B2B2B]'
                          : 'bg-[#FFF9F0] border-[#EAE2D5] text-[#2B2B2B] hover:bg-[#FFF6DC]'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Building className="w-3.5 h-3.5 text-[#E63946] shrink-0" />
                          <span className="font-bold text-[#2B2B2B] text-xs">{cin.name}</span>
                        </div>
                        <p className="text-[11px] text-[#6B7280] pl-5.5">{cin.address}</p>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#E63946] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EAE2D5] bg-[#FFF9F0] flex items-center justify-between">
          <div className="text-[11px] text-[#6B7280] truncate max-w-xs sm:max-w-md">
            Active: <strong className="text-[#2B2B2B]">{city}</strong>, {state}, {currentCountryObj.name}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-[#E63946] hover:bg-[#D62839] text-white font-bold text-xs shadow-xs cursor-pointer transition-colors"
          >
            Apply Location ({city})
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPickerModal;
