import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Building,
  Star,
  Film,
  Clock,
  Calendar,
  CheckCircle,
  Navigation,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Ticket,
  AlertCircle,
  Search,
  Filter
} from 'lucide-react';
import { useLocationContext } from '../context/LocationContext';
import { resolveMoviePoster, DEFAULT_FALLBACK_POSTER } from '../utils/moviePosters';
import {
  LOCATION_HIERARCHY,
  CITY_COORDINATES,
  calculateDistanceKm,
  findClosestLocation
} from '../data/locations';
import API from '../services/api';

const NearbyCinemaFinder = ({ className = '', defaultExpandedCinema = true }) => {
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
    setSelectedCinema,
    formatPrice,
    detectCurrentLocation
  } = useLocationContext();

  const [locating, setLocating] = useState(false);
  const [geoStatus, setGeoStatus] = useState(null);
  const [userCoords, setUserCoords] = useState(null);
  const [cinemaSearch, setCinemaSearch] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('All');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Showtimes cache keyed by cinemaId
  const [cinemaSchedules, setCinemaSchedules] = useState({});
  const [loadingSchedules, setLoadingSchedules] = useState({});
  const [expandedCinemas, setExpandedCinemas] = useState({});

  // 7 available days starting from today
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const formatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { dateStr, label, formatted };
  });

  // Browser Geolocation API call with India preselection and dual IP fallback
  const handleUseCurrentLocation = async () => {
    try {
      setLocating(true);
      setGeoStatus({
        type: 'info',
        message: 'Detecting live coordinates & discovering nearest luxury auditoriums...'
      });
      const detected = await detectCurrentLocation();
      if (detected) {
        setGeoStatus({
          type: 'success',
          message: `Live Location Verified! Nearest cinema cluster found in ${detected.city}, ${detected.state} (${detected.country}).`
        });
      }
    } catch (err) {
      setGeoStatus({
        type: 'error',
        message: err.message || 'Unable to retrieve location. Please choose city manually.'
      });
    } finally {
      setLocating(false);
    }
  };

  // Fetch showtimes for a cinema
  const fetchSchedule = async (cinemaId, retryCount = 0) => {
    if (cinemaSchedules[cinemaId] || loadingSchedules[cinemaId]) return;
    try {
      setLoadingSchedules((prev) => ({ ...prev, [cinemaId]: true }));
      const { data } = await API.get(`/cinemas/${cinemaId}/showtimes`);
      setCinemaSchedules((prev) => ({ ...prev, [cinemaId]: data.schedule || [] }));
    } catch (err) {
      if (retryCount < 1) {
        setTimeout(() => fetchSchedule(cinemaId, retryCount + 1), 600);
        return;
      }
      console.warn(`Cinema ${cinemaId} schedule lookup notice:`, err?.message || err);
      // Fallback empty array so loading spinner resolves cleanly
      setCinemaSchedules((prev) => ({ ...prev, [cinemaId]: [] }));
    } finally {
      setLoadingSchedules((prev) => ({ ...prev, [cinemaId]: false }));
    }
  };

  // Preload schedule for first cinema
  useEffect(() => {
    if (cinemas && cinemas.length > 0) {
      cinemas.slice(0, 2).forEach((c) => {
        fetchSchedule(c._id);
        if (defaultExpandedCinema) {
          setExpandedCinemas((prev) => ({ ...prev, [c._id]: true }));
        }
      });
    }
  }, [cinemas]);

  const toggleExpand = (cinemaId) => {
    setExpandedCinemas((prev) => {
      const nextState = !prev[cinemaId];
      if (nextState) {
        fetchSchedule(cinemaId);
      }
      return { ...prev, [cinemaId]: nextState };
    });
  };

  // Distance calculator helper
  const getCinemaDistanceKm = (cin) => {
    if (!userCoords) return null;
    const cityCoord = CITY_COORDINATES[cin.city];
    if (!cityCoord) return null;
    return calculateDistanceKm(userCoords.lat, userCoords.lng, cityCoord.lat, cityCoord.lng);
  };

  // Filter cinemas by search and format
  const filteredCinemas = cinemas.filter((c) => {
    const matchesSearch =
      !cinemaSearch ||
      c.name.toLowerCase().includes(cinemaSearch.toLowerCase()) ||
      c.address.toLowerCase().includes(cinemaSearch.toLowerCase());

    const matchesFormat =
      selectedFormat === 'All' ||
      (c.formats && c.formats.some((f) => f.toLowerCase().includes(selectedFormat.toLowerCase())));

    return matchesSearch && matchesFormat;
  });

  const handleSelectShowtime = (movie, cinema, time) => {
    setSelectedCinema(cinema);
    navigate(`/movies/${movie._id}?showDate=${selectedDate}&showTime=${encodeURIComponent(time)}`);
  };

  const statesList = activeCountry?.states || [];
  const citiesList = currentState?.cities || [];

  return (
    <div className={`bg-white border border-[#EAE2D5] rounded-3xl p-5 sm:p-8 space-y-6 shadow-xs ${className}`}>
      {/* Top Header Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#EAE2D5] pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#E63946] bg-[#FDECEC] border border-[#FCD7D7] px-2.5 py-0.5 rounded-lg">
            <Compass className="w-3.5 h-3.5" />
            <span>Real-Time Proximity Radar</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#2B2B2B] tracking-tight">
            Find Nearby Cinemas & Live Showtimes
          </h2>
          <p className="text-xs text-[#6B7280]">
            Select Country → State → City or use your device location to find nearby luxury auditoriums and tickets.
          </p>
        </div>

        {/* Location Controls: Use Current Location Button & Hierarchical Selectors */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={locating}
            className="flex items-center gap-2 bg-[#FFF6DC] hover:bg-[#FFEDB0] border border-[#FFC93C] text-[#2B2B2B] hover:text-[#1A1D20] px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Navigation className={`w-3.5 h-3.5 text-[#E63946] ${locating ? 'animate-spin' : ''}`} />
            <span>{locating ? 'Locating...' : 'Use Current Location'}</span>
          </button>

          {/* Hierarchical Country, State, and City Selectors */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#FFF9F0] border border-[#EAE2D5] p-1.5 rounded-xl text-xs">
            {/* Country Selector */}
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="bg-transparent text-[#2B2B2B] font-semibold px-1.5 py-1 focus:outline-none cursor-pointer"
              title="Select Country"
            >
              {LOCATION_HIERARCHY.map((c) => (
                <option key={c.code} value={c.code} className="bg-white text-[#2B2B2B]">
                  {c.flag} {c.name} ({c.currency})
                </option>
              ))}
            </select>

            <span className="text-[#DCD3C5]">/</span>

            {/* State / Province Selector */}
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="bg-transparent text-[#2B2B2B] font-medium px-1.5 py-1 focus:outline-none cursor-pointer max-w-[120px] truncate"
              title="Select State / Province"
            >
              {statesList.map((st) => (
                <option key={st.name} value={st.name} className="bg-white text-[#2B2B2B]">
                  {st.name}
                </option>
              ))}
            </select>

            <span className="text-[#DCD3C5]">/</span>

            {/* City Selector */}
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="bg-transparent text-[#E63946] font-bold px-1.5 py-1 focus:outline-none cursor-pointer max-w-[120px] truncate"
              title="Select City"
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

      {/* Geolocation Status Feedback Banner */}
      {geoStatus && (
        <div
          className={`flex items-start sm:items-center gap-2.5 p-3 rounded-xl text-xs animate-in fade-in duration-200 ${
            geoStatus.type === 'success'
              ? 'bg-[#FFF6DC] border border-[#FFEDB0] text-[#7A5B14]'
              : geoStatus.type === 'error'
              ? 'bg-[#FDECEC] border border-[#FCD7D7] text-[#B81D2D]'
              : 'bg-[#FFF9F0] border border-[#EAE2D5] text-[#6B7280]'
          }`}
        >
          {geoStatus.type === 'success' ? (
            <CheckCircle className="w-4 h-4 shrink-0 text-[#E5B129]" />
          ) : geoStatus.type === 'error' ? (
            <AlertCircle className="w-4 h-4 shrink-0 text-[#E63946]" />
          ) : (
            <Compass className="w-4 h-4 shrink-0 animate-spin text-[#E63946]" />
          )}
          <span className="font-semibold">{geoStatus.message}</span>
        </div>
      )}

      {/* Date & Search Bar Strip */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Date Selector Pills */}
        <div className="md:col-span-8 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {availableDates.map((d) => {
            const isSelected = selectedDate === d.dateStr;
            return (
              <button
                key={d.dateStr}
                type="button"
                onClick={() => setSelectedDate(d.dateStr)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#E63946] text-white font-bold shadow-xs'
                    : 'bg-[#FFF9F0] border border-[#EAE2D5] text-[#6B7280] hover:text-[#2B2B2B] hover:bg-[#FFF6DC]'
                }`}
              >
                <Calendar className="w-3 h-3" />
                <span>{d.label}</span>
                <span className={`text-[10px] font-mono ${isSelected ? 'text-white/80' : 'text-[#9CA3AF]'}`}>
                  ({d.formatted})
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Input */}
        <div className="md:col-span-4 relative">
          <Search className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter theatres by name or street..."
            value={cinemaSearch}
            onChange={(e) => setCinemaSearch(e.target.value)}
            className="w-full bg-[#FFF9F0] border border-[#DCD3C5] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#2B2B2B] placeholder-[#9CA3AF] focus:outline-none focus:border-[#E63946] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Cinema Listings with Live Showtimes */}
      {loadingCinemas ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 bg-[#FFF9F0] rounded-2xl animate-pulse border border-[#EAE2D5]" />
          ))}
        </div>
      ) : filteredCinemas.length === 0 ? (
        <div className="bg-[#FFF9F0] border border-[#EAE2D5] rounded-2xl p-8 text-center space-y-3">
          <Building className="w-8 h-8 text-[#9CA3AF] mx-auto" />
          <p className="text-sm font-bold text-[#2B2B2B]">
            {selectedFormat !== 'All'
              ? `No ${selectedFormat} Theatres Found in ${city}`
              : cinemaSearch
              ? `No Theatres matching "${cinemaSearch}" in ${city}`
              : `No Cinema Theatres Found in ${city}`}
          </p>
          <p className="text-xs text-[#6B7280] max-w-md mx-auto">
            {selectedFormat !== 'All' || cinemaSearch
              ? `Try resetting your filters to explore all available auditoriums in ${city}.`
              : 'Try switching cities or click "Use Current Location" to discover auditoriums near your coordinates.'}
          </p>
          {(selectedFormat !== 'All' || cinemaSearch) && (
            <button
              type="button"
              onClick={() => {
                setSelectedFormat('All');
                setCinemaSearch('');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#E63946] text-white hover:bg-[#D62839] transition-all cursor-pointer shadow-xs"
            >
              Show All Cinemas in {city}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCinemas.map((cinema) => {
            const isExpanded = Boolean(expandedCinemas[cinema._id]);
            const schedule = cinemaSchedules[cinema._id] || [];
            const isScheduleLoading = Boolean(loadingSchedules[cinema._id]);
            const distance = getCinemaDistanceKm(cinema);

            return (
              <div
                key={cinema._id}
                className="bg-white border border-[#EAE2D5] hover:border-[#FFC93C] rounded-2xl overflow-hidden transition-all duration-200 shadow-xs"
              >
                {/* Cinema Summary Header */}
                <div
                  onClick={() => toggleExpand(cinema._id)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-[#FFFDF5] transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-extrabold text-[#2B2B2B] tracking-wide flex items-center gap-1.5">
                        <Building className="w-4 h-4 text-[#E63946]" />
                        {cinema.name}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-[#E63946] bg-[#FDECEC] border border-[#FCD7D7] px-2 py-0.5 rounded-md">
                        {cinema.chain}
                      </span>
                      {distance !== null && (
                        <span className="text-[10px] font-mono text-[#047857] bg-[#ECFDF5] border border-[#A7F3D0] px-2 py-0.5 rounded-md">
                          📍 ~{distance} km away
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#6B7280] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
                      <span>{cinema.address}</span>
                      <span className="text-[#DCD3C5]">·</span>
                      <span className="font-mono text-[#2B2B2B] font-semibold">{cinema.screens} Screens</span>
                    </p>
                  </div>

                  {/* Rating, Price & Expand Button */}
                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="flex items-center gap-1 text-xs font-bold text-[#7A5B14] bg-[#FFF6DC] border border-[#FFEDB0] px-2.5 py-1 rounded-xl">
                      <Star className="w-3.5 h-3.5 fill-[#E5B129] stroke-none" />
                      <span>{cinema.rating || 4.9}</span>
                    </div>

                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] text-[#6B7280] block uppercase font-bold">Tickets</span>
                      <span className="text-xs font-bold text-[#E63946] font-mono">
                        {cinema.currencySymbol}{cinema.basePrice}
                      </span>
                    </div>

                    <div className="w-7 h-7 rounded-lg bg-[#FFF9F0] border border-[#EAE2D5] flex items-center justify-center text-[#6B7280]">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Formats and Amenities Pill Bar */}
                <div className="px-4 sm:px-5 py-2.5 bg-[#FFF9F0] border-t border-b border-[#EAE2D5] flex flex-wrap items-center gap-1.5">
                  {(cinema.formats || []).map((fmt) => (
                    <span
                      key={fmt}
                      className="text-[10px] font-bold text-[#2B2B2B] bg-white border border-[#EAE2D5] px-2 py-0.5 rounded-md shadow-xs"
                    >
                      {fmt}
                    </span>
                  ))}
                  <span className="text-[#DCD3C5] text-xs">|</span>
                  {(cinema.amenities || []).slice(0, 3).map((am) => (
                    <span key={am} className="text-[10px] text-[#6B7280] flex items-center gap-1">
                      <CheckCircle className="w-2.5 h-2.5 text-[#10B981]" />
                      <span>{am}</span>
                    </span>
                  ))}
                </div>

                {/* Expanded Section: Movies & Interactive Showtimes */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 bg-[#FFFDF5] space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#2B2B2B] flex items-center gap-1.5">
                        <Film className="w-3.5 h-3.5 text-[#E63946]" />
                        Today's Showtimes at {cinema.name}
                      </span>
                      <span className="text-[11px] text-[#6B7280]">
                        Date: <span className="text-[#E63946] font-bold">{selectedDate}</span>
                      </span>
                    </div>

                    {isScheduleLoading ? (
                      <div className="py-6 text-center text-xs text-[#6B7280] flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-[#E63946] border-t-transparent rounded-full animate-spin" />
                        <span>Loading verified showtimes...</span>
                      </div>
                    ) : schedule.length === 0 ? (
                      <p className="text-xs text-[#6B7280] py-3 text-center">
                        No movie screenings scheduled for the selected date. Please pick another day.
                      </p>
                    ) : (
                      <div className="divide-y divide-[#EAE2D5]">
                        {schedule.map(({ movie, showtimes, price }) => (
                          <div
                            key={movie._id}
                            className="py-3.5 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-3"
                          >
                            {/* Movie Info */}
                            <div className="flex items-center gap-3">
                              <img
                                src={resolveMoviePoster(movie?.title, movie?.posterUrl)}
                                alt={movie.title}
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  if (e.currentTarget.src !== DEFAULT_FALLBACK_POSTER) {
                                    e.currentTarget.src = DEFAULT_FALLBACK_POSTER;
                                  }
                                }}
                                className="w-12 h-16 object-cover rounded-xl shrink-0 border border-[#EAE2D5] shadow-xs"
                              />
                              <div className="space-y-1">
                                <h4 className="text-sm font-bold text-[#2B2B2B] hover:text-[#E63946] transition-colors">
                                  {movie.title}
                                </h4>
                                <div className="flex items-center gap-2 text-[11px] text-[#6B7280]">
                                  <span>{movie.duration}m</span>
                                  <span>·</span>
                                  <span className="text-[#2B2B2B] font-medium">
                                    {Array.isArray(movie.genre) ? movie.genre.slice(0, 2).join(', ') : movie.genre}
                                  </span>
                                  <span>·</span>
                                  <span className="text-[#7A5B14] font-mono flex items-center gap-1 font-bold">
                                    ★ {movie.rating || 8.5}
                                    {movie.votes && (
                                      <span className="text-[10px] text-[#9CA3AF] font-normal">
                                        ({movie.votes >= 1000 ? `${(movie.votes / 1000).toFixed(1)}k` : movie.votes})
                                      </span>
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Showtime Buttons */}
                            <div className="flex items-center gap-2 flex-wrap">
                              {(showtimes || ['10:30 AM', '02:00 PM', '06:30 PM', '09:45 PM']).map((time) => (
                                <button
                                  key={time}
                                  type="button"
                                  onClick={() => handleSelectShowtime(movie, cinema, time)}
                                  className="group flex flex-col items-center bg-white hover:bg-[#FFF6DC] hover:border-[#FFC93C] border border-[#DCD3C5] px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs text-center"
                                  title={`Book ${movie.title} at ${time}`}
                                >
                                  <span className="text-xs font-bold text-[#2B2B2B] font-mono">
                                    {time}
                                  </span>
                                  <span className="text-[9px] text-[#6B7280] font-medium">
                                    4K Laser
                                  </span>
                                </button>
                              ))}

                              <button
                                type="button"
                                onClick={() => handleSelectShowtime(movie, cinema, showtimes[0] || '06:30 PM')}
                                className="inline-flex items-center gap-1 bg-[#E63946] hover:bg-[#D62839] text-white px-3 py-2 rounded-xl text-xs font-bold transition-all ml-1 cursor-pointer shadow-xs"
                              >
                                <Ticket className="w-3 h-3" />
                                <span>Book Seats</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NearbyCinemaFinder;
