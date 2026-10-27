import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Clock,
  Star,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Ticket,
  ChevronLeft,
  MoveHorizontal,
  Play,
  Building,
  User,
  ShieldCheck,
  Compass,
  Globe
} from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLocationContext } from '../context/LocationContext';
import TrailerModal from '../components/TrailerModal';
import CheckoutModal from '../components/CheckoutModal';
import MovieReviews from '../components/MovieReviews';
import LocationPickerModal from '../components/LocationPickerModal';
import { resolveMoviePoster, getFallbackMoviePoster, DEFAULT_FALLBACK_POSTER } from '../utils/moviePosters';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const COLS = [1, 2, 3, 4, 5, 6, 7, 8];

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { city, activeCountry, cinemas, selectedCinema, setSelectedCinema, formatPrice, getRawPrice } =
    useLocationContext();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showAllCast, setShowAllCast] = useState(false);

  // Screening Date (generate today + next 6 days)
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { dateStr, dayName, monthDay };
  });

  const [showDate, setShowDate] = useState(availableDates[0].dateStr);
  const [showTime, setShowTime] = useState('06:30 PM');

  // Seats & Reservation
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingError, setBookingError] = useState('');
  const [holdLoading, setHoldLoading] = useState(false);

  // Modals
  const [showTrailer, setShowTrailer] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [currentHoldId, setCurrentHoldId] = useState(null);

  // Fetch movie details
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/movies/${id}`);
        setMovie(data);
        if (data.showtimes?.length > 0) {
          setShowTime(data.showtimes.includes('06:30 PM') ? '06:30 PM' : data.showtimes[0]);
        }
      } catch (error) {
        console.error('Failed to load movie:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  // Fetch occupied seats whenever movie, date, or time changes
  useEffect(() => {
    if (!id) return;
    const fetchOccupied = async () => {
      try {
        const { data } = await API.get('/bookings/occupied', {
          params: { movieId: id, showDate, showTime }
        });
        setOccupiedSeats(data.occupiedSeats || []);
        setSelectedSeats([]);
      } catch (error) {
        console.error('Error fetching occupied seats:', error);
      }
    };
    fetchOccupied();
  }, [id, showDate, showTime]);

  const toggleSeat = (seatId) => {
    if (occupiedSeats.includes(seatId)) return;
    setBookingError('');
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  };

  const handleStartCheckout = async () => {
    if (!user) {
      navigate('/login', {
        state: {
          from: {
            pathname: `/movies/${id}`,
            search: `?showDate=${showDate}&showTime=${encodeURIComponent(showTime)}`
          }
        }
      });
      return;
    }
    if (selectedSeats.length === 0) {
      setBookingError('Please select at least one seat on the auditorium map.');
      return;
    }

    try {
      setHoldLoading(true);
      setBookingError('');

      // Call backend to lock temporary hold for 8 minutes
      const { data } = await API.post('/bookings/hold', {
        movie: movie._id,
        seats: selectedSeats,
        showDate,
        showTime
      });

      setCurrentHoldId(data.holdId);
      setShowCheckout(true);
    } catch (err) {
      setBookingError(
        err.response?.data?.message || 'One or more seats were just held by another guest. Please reselect.'
      );
      // Refresh occupied seats
      const { data } = await API.get('/bookings/occupied', {
        params: { movieId: id, showDate, showTime }
      });
      setOccupiedSeats(data.occupiedSeats || []);
    } finally {
      setHoldLoading(false);
    }
  };

  const handleBookingSuccess = (confirmedBooking) => {
    setShowCheckout(false);
    navigate('/bookings', {
      state: {
        newBooking: true,
        movieTitle: movie.title,
        seats: confirmedBooking.seats || selectedSeats,
        totalPrice: confirmedBooking.totalPrice,
        showDate,
        showTime
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center text-slate-400 space-y-3">
        <p className="text-lg font-semibold text-white">Screening Not Found</p>
        <button onClick={() => navigate('/')} className="text-xs text-amber-400 hover:underline">
          Return to All Movies
        </button>
      </div>
    );
  }

  const activeCinema = selectedCinema || cinemas[0] || { name: movie.theater || 'iMovies VIP Cinema' };
  const basePriceVal = (activeCinema?.basePrice) || movie.ticketPrice || 250;
  const rawUnitPrice = getRawPrice(basePriceVal);
  const formattedUnitPrice = formatPrice(basePriceVal);

  const vipSeatsCount = selectedSeats.filter((s) => ['F', 'G', 'H'].includes(s[0])).length;
  const standardSeatsCount = selectedSeats.length - vipSeatsCount;
  const standardUnitPrice = rawUnitPrice;
  const vipUnitPrice = Math.round(rawUnitPrice * 1.25);

  const baseTicketsTotal =
    selectedSeats.length > 0
      ? standardSeatsCount * standardUnitPrice + vipSeatsCount * vipUnitPrice
      : standardUnitPrice;

  const convenienceFee = Math.round(baseTicketsTotal * 0.05);
  const taxAmount = Math.round(baseTicketsTotal * 0.18);
  const grandTotal = baseTicketsTotal + convenienceFee + taxAmount;
  const totalAmountFormatted = formatPrice(grandTotal);

  const showtimesList =
    movie.showtimes && movie.showtimes.length > 0
      ? movie.showtimes
      : ['10:30 AM', '02:00 PM', '06:30 PM', '09:45 PM'];

  const genres = Array.isArray(movie.genre) ? movie.genre : [movie.genre];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B7280] hover:text-[#E63946] transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Worldwide Discoveries
      </button>

      {/* Movie Presentation Overview Header */}
      <div className="bg-white border border-[#EAE2D5] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-8 shadow-xs relative overflow-hidden cinema-vignette">
        {movie.backdropUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none filter blur-[1px]"
            style={{ backgroundImage: `url(${movie.backdropUrl})` }}
          />
        )}

        {/* Poster with Trailer Trigger - Full Canvas Theatrical Visibility */}
        <div className="relative w-44 sm:w-60 aspect-[2/3] rounded-2xl overflow-hidden shadow-sm mx-auto md:mx-0 border border-[#EAE2D5] shrink-0 group bg-[#FAF6EE] flex items-center justify-center">
          <img
            src={resolveMoviePoster(movie?.title, movie?.posterUrl)}
            alt={movie.title}
            referrerPolicy="no-referrer"
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 will-change-transform"
            onError={(e) => {
              const fallback = getFallbackMoviePoster(movie?.title, e.currentTarget.src);
              if (fallback && fallback !== e.currentTarget.src) {
                e.currentTarget.src = fallback;
                return;
              }
              if (e.currentTarget.src !== DEFAULT_FALLBACK_POSTER) {
                e.currentTarget.src = DEFAULT_FALLBACK_POSTER;
              }
            }}
            style={{
              imageRendering: '-webkit-optimize-contrast',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden'
            }}
          />

          <button
            type="button"
            onClick={() => setShowTrailer(true)}
            className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white/90 hover:bg-[#E63946] text-[#E63946] hover:text-white border border-[#EAE2D5] hover:border-[#E63946] flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer"
            title={movie.trailerKey ? "Watch Official 4K Trailer" : "View Official Trailer Status"}
          >
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </button>
        </div>

        <div className="relative z-10 flex-1 space-y-4">
          {/* Metadata line */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B7280]">
            {movie.category === 'upcoming' && (
              <span className="bg-[#FFC93C] text-[#2B2B2B] border border-[#E5B129] font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-md tracking-wider flex items-center gap-1 shadow-xs">
                <Calendar className="w-3 h-3" />
                Coming Soon
              </span>
            )}
            <span className="text-[#E63946] font-bold tracking-wide uppercase">
              {movie.language || 'English'}
            </span>
            <span aria-hidden="true" className="text-[#D1D5DB]">·</span>
            <span>{genres.join(', ')}</span>
            <span aria-hidden="true" className="text-[#D1D5DB]">·</span>
            <button
              type="button"
              onClick={() => document.getElementById('audience-reviews')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-1.5 text-[#7A5B14] bg-[#FFF6DC] border border-[#FFEDB0] px-2 py-0.5 rounded-md font-bold hover:bg-[#FFEDB0] transition-colors cursor-pointer group shadow-xs"
              title="Jump to verified audience reviews"
            >
              <Star className="w-3.5 h-3.5 fill-[#FFC93C] stroke-none" />
              <span className="font-mono tabular-nums">{movie.rating || 8.5} / 10</span>
              {movie.votes && (
                <span className="text-[11px] text-[#6B7280] font-normal">
                  ({movie.votes >= 1000 ? `${(movie.votes / 1000).toFixed(1)}k` : movie.votes} votes)
                </span>
              )}
              <span className="text-[10px] text-[#7A5B14] font-semibold underline ml-0.5">Reviews</span>
            </button>
            {movie.director && (
              <>
                <span aria-hidden="true" className="text-[#D1D5DB]">·</span>
                <span className="text-[#2B2B2B]">Dir. {movie.director}</span>
              </>
            )}
            <span aria-hidden="true" className="text-[#D1D5DB]">·</span>
            <button
              type="button"
              onClick={() => setShowTrailer(true)}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#FFF6DC] to-[#FEF3C7] hover:from-[#FEF08A] hover:to-[#FDE047] border border-[#FCD34D] text-[#92400E] px-3 py-1 rounded-lg text-[11px] font-black transition-all shadow-xs ml-1 cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              {movie.trailerKey ? 'Watch 4K Trailer' : 'Official Trailer Status'}
            </button>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#2B2B2B] tracking-tight [text-wrap:balance]">
            {movie.title}
          </h1>

          <p className="text-[#6B7280] text-xs sm:text-sm leading-relaxed max-w-3xl">
            {movie.description}
          </p>

          {/* Cast list with roles and expand toggle */}
          {movie.cast && movie.cast.length > 0 && (
            <div className="pt-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold text-[#9CA3AF] tracking-wider flex items-center gap-1.5">
                  <User className="w-3 h-3 text-[#E63946]" />
                  Starring Ensemble ({movie.cast.length} Cast Members)
                </span>
                {movie.cast.length > 6 && (
                  <button
                    type="button"
                    onClick={() => setShowAllCast((prev) => !prev)}
                    className="text-[11px] font-bold text-[#E63946] hover:underline cursor-pointer"
                  >
                    {showAllCast ? 'Show Fewer' : `View All (${movie.cast.length})`}
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {(showAllCast ? movie.cast : movie.cast.slice(0, 6)).map((actor, idx) => (
                  <div
                    key={idx}
                    className="bg-[#FFF9F0] border border-[#EAE2D5] text-[#2B2B2B] px-3 py-1.5 rounded-lg text-[11px] flex items-center gap-1.5 shadow-2xs hover:border-[#E63946]/40 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E63946]" />
                    <strong className="text-[#2B2B2B] font-bold">{actor.name}</strong>
                    {actor.character && (
                      <span className="text-[#B81D2D] font-medium bg-[#FDECEC] border border-[#FCD7D7] px-1.5 py-0.5 rounded text-[10px]">
                        as {actor.character}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1 text-xs text-[#6B7280]">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#E63946]" />
              <span className="font-mono tabular-nums text-[#2B2B2B] font-bold">{movie.duration || 120}</span> mins
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#E63946]" />
              <span className="text-[#2B2B2B] font-semibold">{activeCinema?.name || movie.theater}</span>
            </span>
            <span className="text-[#B81D2D] font-bold bg-[#FDECEC] border border-[#FCD7D7] px-3 py-1 rounded-md font-mono tabular-nums">
              {formattedUnitPrice} per seat
            </span>
          </div>

          {/* Cinema & Date Selector Module or Coming Soon Banner */}
          {movie.category === 'upcoming' && (!movie.showtimes || movie.showtimes.length === 0) ? (
            <div className="pt-4 border-t border-[#EAE2D5]">
              <div className="flex items-center gap-2.5 text-xs text-[#7A5B14] bg-[#FFF6DC] border border-[#FFEDB0] px-4 py-3 rounded-xl shadow-xs">
                <Calendar className="w-4 h-4 shrink-0 text-[#E5B129]" />
                <span className="font-semibold">
                  Theatrical Premiere: {movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '2026 Premiere'} · Advance Seat Reservations Open Soon
                </span>
              </div>
            </div>
          ) : (
            <div className="pt-4 border-t border-[#EAE2D5] space-y-4">
              {/* Preferred Cinema Selector in city with worldwide location switcher */}
              {cinemas && cinemas.length > 0 && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <div>
                      <label className="text-xs font-bold text-[#2B2B2B] flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-[#E63946]" />
                        Cinemas in {city}, {activeCountry?.name || activeCountry?.code} ({cinemas.length} available)
                      </label>
                      <p className="text-[11px] text-[#6B7280]">Real-time theatrical screens & premium formats worldwide</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowLocationModal(true)}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#E63946] hover:text-[#B81D2D] bg-[#FFF0F0] hover:bg-[#FEE2E2] px-2.5 py-1 rounded-lg border border-[#FCD7D7] transition-all cursor-pointer self-start sm:self-auto"
                      title="Change your city or country worldwide"
                    >
                      <Globe className="w-3 h-3" />
                      <span>Change City ({city})</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cinemas.map((cin) => {
                      const isSelected = activeCinema?._id === cin._id;
                      return (
                        <button
                          key={cin._id}
                          type="button"
                          onClick={() => setSelectedCinema(cin)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-[#E63946] text-white shadow-xs ring-2 ring-[#E63946]/30'
                              : 'bg-[#FFF9F0] border border-[#EAE2D5] text-[#2B2B2B] hover:bg-[#FFF6DC]'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3 h-3" />}
                          <span>{cin.name}</span>
                          {cin.formats && cin.formats.length > 0 && (
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-black tracking-wider ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-[#EAE2D5] text-[#6B7280]'
                              }`}
                            >
                              {cin.formats[0]}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Screening Date Cards */}
              <div>
                <label className="block text-xs font-bold text-[#2B2B2B] mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#E63946]" />
                  Screening Date
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {availableDates.map((item) => {
                    const isSelected = showDate === item.dateStr;
                    return (
                      <button
                        key={item.dateStr}
                        type="button"
                        onClick={() => setShowDate(item.dateStr)}
                        className={`px-3.5 py-2 rounded-xl text-center min-w-[72px] transition-all shrink-0 cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#E63946] to-[#C1121F] text-white font-bold shadow-sm shadow-[#E63946]/20'
                            : 'bg-white text-[#4B5563] hover:text-[#2B2B2B] border border-[#EAE2D5] hover:bg-[#FFF6DC]'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold block">{item.dayName}</span>
                        <span className="text-xs font-bold font-mono block mt-0.5">{item.monthDay}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Showtime Selection */}
              <div>
                <label className="block text-xs font-bold text-[#2B2B2B] mb-1.5">
                  Select Showtime
                </label>
                <div className="flex flex-wrap gap-2">
                  {showtimesList.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setShowTime(time)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                        showTime === time
                          ? 'bg-gradient-to-r from-[#E63946] to-[#C1121F] text-white font-bold shadow-sm shadow-[#E63946]/20'
                          : 'bg-white text-[#4B5563] hover:text-[#2B2B2B] border border-[#EAE2D5] hover:bg-[#FFF6DC]'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Auditorium & Checkout Layout OR Coming Soon Showcase */}
      {movie.category === 'upcoming' && (!movie.showtimes || movie.showtimes.length === 0) ? (
        <div className="bg-white border border-[#EAE2D5] rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xs relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF6DC] border border-[#FFEDB0] flex items-center justify-center text-[#E5B129] mx-auto shadow-xs">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="max-w-xl mx-auto space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#7A5B14] bg-[#FFF6DC] px-3.5 py-1 rounded-full border border-[#FFEDB0]">
              Theatrical Premiere Showcase
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2B2B2B]">
              Coming Soon to Luxury Auditoriums
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
              Advance seat reservations and IMAX laser showtimes for <strong className="text-[#2B2B2B]">{movie.title}</strong> will open closer to its official premiere date ({movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '2026'}). Real showtimes will be posted once certified by cinema distributors.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              type="button"
              onClick={() => setShowTrailer(true)}
              className="inline-flex items-center gap-2 bg-[#E63946] hover:bg-[#D62839] text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{movie.trailerKey ? 'Watch Official 4K Trailer' : 'Official Trailer Preview'}</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 bg-[#FFF9F0] hover:bg-[#FFF6DC] border border-[#EAE2D5] text-[#2B2B2B] font-bold px-5 py-3 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Browse Now Playing Movies
            </button>
          </div>
        </div>
      ) : (
      <>
        {/* All Cinema Houses Available in Current Location for Ticket Booking */}
        {cinemas && cinemas.length > 0 && (
          <section aria-label="Cinema Houses in Location" className="bg-white border border-[#EAE2D5] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE2D5] pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E63946] bg-[#FDECEC] border border-[#FCD7D7] px-3 py-1 rounded-lg">
                  <Building className="w-3.5 h-3.5 text-[#E63946]" />
                  <span>Available Cinema Houses in {city}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#2B2B2B]">
                  Select Cinema House for Ticket Booking
                </h2>
                <p className="text-xs text-[#6B7280]">
                  Choose from {cinemas.length} luxury cinema houses available in your current location featuring verified laser auditoriums and reserved recliners.
                </p>
              </div>
              <span className="text-xs font-bold text-[#7A5B14] bg-[#FFF6DC] border border-[#FFEDB0] px-3.5 py-1.5 rounded-xl self-start sm:self-auto font-mono">
                {cinemas.length} {cinemas.length === 1 ? 'Cinema House' : 'Cinema Houses'} in {city}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cinemas.map((cin) => {
                const isSelected = activeCinema?._id === cin._id;
                return (
                  <div
                    key={cin._id}
                    onClick={() => setSelectedCinema(cin)}
                    className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 text-left ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#FFF9F0] to-[#FFF6DC] border-[#E63946] shadow-sm ring-2 ring-[#E63946]/30'
                        : 'bg-[#FFFDF9] border-[#EAE2D5] hover:border-[#FFC93C] hover:bg-[#FFF6DC]/40'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-bold text-[#2B2B2B] leading-snug">
                          {cin.name}
                        </h3>
                        {isSelected ? (
                          <span className="text-[10px] uppercase font-extrabold tracking-wider bg-[#E63946] text-white px-2 py-0.5 rounded-md shrink-0 shadow-xs flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Active
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-[#6B7280] bg-white border border-[#EAE2D5] px-2 py-0.5 rounded-md shrink-0">
                            Select
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#6B7280] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#E63946] shrink-0" />
                        <span className="truncate">{cin.address || `${cin.city}, ${cin.country}`}</span>
                      </p>

                      {cin.formats && cin.formats.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {cin.formats.slice(0, 3).map((fmt, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-bold bg-white border border-[#EAE2D5] text-[#2B2B2B] px-1.5 py-0.5 rounded"
                            >
                              {fmt}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#EAE2D5]/70 text-[#6B7280]">
                      <span className="flex items-center gap-1 text-[#7A5B14] font-bold">
                        <Star className="w-3 h-3 fill-[#FFC93C] stroke-none" />
                        <span>{cin.rating || 4.8}</span>
                        <span className="font-normal text-[#9CA3AF]">({cin.screens || 8} screens)</span>
                      </span>
                      <span className="font-mono font-bold text-[#B81D2D]">
                        From {formatPrice(cin.basePrice || movie.ticketPrice || 350)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Auditorium Seat Map */}
        <div id="auditorium-seat-map" className="lg:col-span-2 bg-white border border-[#EAE2D5] rounded-3xl p-4 sm:p-8 space-y-6 sm:space-y-8 shadow-xs">
          {/* Luminous Curved Cinema Screen */}
          <div className="max-w-md mx-auto text-center space-y-3">
            <div className="cinema-screen-vip mx-auto" />
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#E63946] font-bold">
              All Eyes This Way — 4K Laser Projection
            </p>
          </div>

          {/* Mobile Horizontal Swipe Indicator */}
          <div className="sm:hidden flex items-center justify-center gap-2 text-[11px] text-[#7A5B14] bg-[#FFF6DC] py-1.5 px-3 rounded-lg border border-[#FFEDB0]">
            <MoveHorizontal className="w-3.5 h-3.5 text-[#E5B129] animate-pulse" />
            <span>Swipe horizontally to view full auditorium rows</span>
          </div>

          {/* Seat Grid A1 - H8 */}
          <div className="overflow-x-auto py-3 px-1 scrollbar-thin">
            <div className="min-w-[460px] max-w-lg mx-auto space-y-2.5">
              {ROWS.map((row) => {
                const isVipRow = ['F', 'G', 'H'].includes(row);
                return (
                  <div key={row} className="flex items-center justify-center gap-2 sm:gap-2.5">
                    <span className="w-5 text-xs font-bold text-[#9CA3AF] text-right font-mono shrink-0">
                      {row}
                    </span>
                    {COLS.map((col) => {
                      const seatId = `${row}${col}`;
                      const isOccupied = occupiedSeats.includes(seatId);
                      const isSelected = selectedSeats.includes(seatId);

                      return (
                        <React.Fragment key={seatId}>
                          {col === 5 && <div className="w-3 sm:w-5 shrink-0" />}
                          <button
                            type="button"
                            disabled={isOccupied}
                            onClick={() => toggleSeat(seatId)}
                            title={
                              isOccupied
                                ? `Seat ${seatId} Booked`
                                : `Seat ${seatId} ${isVipRow ? '(VIP Recliner)' : '(Standard)'}`
                            }
                            className={`seat-vip w-10 h-10 min-w-[40px] min-h-[40px] rounded-t-xl rounded-b-md text-xs font-mono font-bold flex items-center justify-center border shrink-0 cursor-pointer ${
                              isOccupied
                                ? 'bg-[#F3F4F6] border-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                                : isSelected
                                ? 'bg-[#FFC93C] border-[#E5B129] text-[#1A1D20] font-black shadow-sm ring-2 ring-[#FFC93C]/50 scale-105'
                                : isVipRow
                                ? 'bg-[#FFFDF5] border-[#FFEDB0] text-[#7A5B14] hover:border-[#FFC93C] hover:bg-[#FFF6DC]'
                                : 'bg-white border-[#DCD3C5] text-[#2B2B2B] hover:border-[#FFC93C] hover:bg-[#FFF6DC]'
                            }`}
                          >
                            {seatId}
                          </button>
                        </React.Fragment>
                      );
                    })}
                    <span className="w-5 text-xs font-bold text-[#9CA3AF] font-mono shrink-0">
                      {row}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Seating Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 border-t border-[#EAE2D5] text-xs text-[#6B7280]">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-white border border-[#DCD3C5] inline-block shadow-xs" />
              <span>Standard (A–E)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-[#FFFDF5] border border-[#FFEDB0] inline-block shadow-xs" />
              <span>VIP Recliner (F–H)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-[#FFC93C] border border-[#E5B129] inline-block shadow-xs" />
              <span className="text-[#B81D2D] font-bold">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-[#F3F4F6] border border-[#E5E7EB] inline-block" />
              <span>Reserved</span>
            </div>
          </div>
        </div>

        {/* Booking Summary Card */}
        <div className="bg-white border border-[#EAE2D5] rounded-3xl p-6 space-y-5 shadow-xs sticky top-24 w-full">
          <div className="flex items-center gap-2.5 border-b border-[#EAE2D5] pb-4">
            <div className="w-8 h-8 rounded-lg bg-[#FDECEC] border border-[#FCD7D7] flex items-center justify-center text-[#E63946]">
              <Ticket className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#2B2B2B]">
              Reservation Summary
            </h3>
          </div>

          <div className="space-y-3.5 text-xs sm:text-sm">
            <div className="flex justify-between items-baseline gap-2">
              <span className="text-[#6B7280]">Film</span>
              <span className="text-[#2B2B2B] font-bold text-right truncate max-w-[170px]">
                {movie.title}
              </span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-[#6B7280] shrink-0">Theatre</span>
              {cinemas && cinemas.length > 1 ? (
                <select
                  value={activeCinema?._id || ''}
                  onChange={(e) => {
                    const c = cinemas.find((item) => item._id === e.target.value);
                    if (c) setSelectedCinema(c);
                  }}
                  className="bg-[#FFF9F0] border border-[#EAE2D5] text-[#E63946] font-bold text-xs rounded-lg px-2 py-1 max-w-[180px] truncate focus:outline-none focus:border-[#E63946] cursor-pointer"
                  title="Switch to another cinema in this location"
                >
                  {cinemas.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-[#E63946] font-semibold text-right truncate max-w-[170px]">
                  {activeCinema?.name || movie.theater}
                </span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Screening Date</span>
              <span className="text-[#2B2B2B] font-mono font-bold">{showDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Showtime</span>
              <span className="text-[#E63946] font-bold">{showTime}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-[#6B7280]">Reserved Seats</span>
              <span className="text-[#2B2B2B] font-bold font-mono text-right">
                {selectedSeats.length > 0 ? (
                  <span className="bg-[#FFF6DC] border border-[#FFEDB0] text-[#7A5B14] px-2 py-0.5 rounded-md font-mono">
                    {selectedSeats.join(', ')}
                  </span>
                ) : (
                  'None selected'
                )}
              </span>
            </div>
          </div>

          {/* Checkout Payment Summary & Price Bifurcation when tickets are selected */}
          {selectedSeats.length > 0 ? (
            <div className="bg-[#FFFDF9] border border-[#FFEDB0] rounded-2xl p-3.5 space-y-2.5 text-xs animate-in fade-in">
              <div className="flex items-center justify-between border-b border-[#FFEDB0]/80 pb-2">
                <span className="font-bold text-[#7A5B14] uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Ticket className="w-3.5 h-3.5 text-[#E63946]" />
                  <span>Price Bifurcation</span>
                </span>
                <span className="text-[10px] font-mono text-[#D62839] font-bold">
                  {selectedSeats.length} {selectedSeats.length === 1 ? 'ticket' : 'tickets'}
                </span>
              </div>

              {standardSeatsCount > 0 && (
                <div className="flex justify-between text-[#4B5563]">
                  <span>
                    Standard Seats ({standardSeatsCount} × {activeCountry.symbol}{standardUnitPrice})
                  </span>
                  <span className="font-mono font-semibold text-[#2B2B2B]">
                    {activeCountry.symbol}{standardSeatsCount * standardUnitPrice}
                  </span>
                </div>
              )}

              {vipSeatsCount > 0 && (
                <div className="flex justify-between text-[#7A5B14]">
                  <span>
                    VIP Recliners ({vipSeatsCount} × {activeCountry.symbol}{vipUnitPrice})
                  </span>
                  <span className="font-mono font-semibold text-[#B81D2D]">
                    {activeCountry.symbol}{vipSeatsCount * vipUnitPrice}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-[#6B7280]">
                <span>Convenience Surcharge (5%)</span>
                <span className="font-mono font-semibold text-[#2B2B2B]">
                  {activeCountry.symbol}{convenienceFee}
                </span>
              </div>

              <div className="flex justify-between text-[#6B7280]">
                <span>Integrated GST / Tax (18%)</span>
                <span className="font-mono font-semibold text-[#2B2B2B]">
                  {activeCountry.symbol}{taxAmount}
                </span>
              </div>

              <div className="border-t border-[#EAE2D5] pt-2 flex items-center justify-between text-sm font-bold text-[#2B2B2B]">
                <span className="text-[#2B2B2B]">Total Payable ({activeCountry.currency})</span>
                <span className="text-xl font-black text-[#E63946] font-mono tabular-nums">
                  {totalAmountFormatted}
                </span>
              </div>
            </div>
          ) : (
            <div className="border-t border-[#EAE2D5] pt-3 flex items-center justify-between">
              <span className="text-[#6B7280] font-bold text-xs">Tickets From</span>
              <span className="text-xl font-black text-[#E63946] font-mono tabular-nums">
                {activeCountry.symbol}{rawUnitPrice} <span className="text-[10px] text-[#6B7280] font-normal">/ seat</span>
              </span>
            </div>
          )}

          {bookingError && (
            <div className="flex items-center gap-2 bg-[#FDECEC] border border-[#FCD7D7] text-[#B81D2D] text-xs p-3 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#E63946]" />
              <span>{bookingError}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleStartCheckout}
            disabled={holdLoading || selectedSeats.length === 0}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#E63946] via-[#ED3944] to-[#C1121F] hover:from-[#D62839] hover:to-[#9B111E] disabled:opacity-40 text-white font-extrabold py-3.5 rounded-xl shadow-md shadow-[#E63946]/25 hover:shadow-xl hover:shadow-[#E63946]/35 transition-all duration-200 text-xs sm:text-sm cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            {holdLoading
              ? 'Locking Recliner Hold...'
              : user
              ? `Proceed to Checkout (${selectedSeats.length} ${
                  selectedSeats.length === 1 ? 'Seat' : 'Seats'
                })`
              : 'Sign In to Reserve'}
          </button>
        </div>
      </div>
      </>
      )}

      {/* Verified Audience Reviews & Ratings Section */}
      <MovieReviews
        movieId={movie._id}
        movieTitle={movie.title}
        onScrollToBooking={() => {
          const el = document.getElementById('auditorium-seat-map');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 350, behavior: 'smooth' });
          }
        }}
      />

      {/* 4K Trailer Modal */}
      <TrailerModal
        isOpen={showTrailer}
        onClose={() => setShowTrailer(false)}
        trailerKey={movie.trailerKey}
        title={movie.title}
      />

      {/* 4-Step Checkout & Simulated Payment Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        movie={movie}
        cinema={activeCinema}
        availableCinemas={cinemas}
        onSelectCinema={setSelectedCinema}
        showDate={showDate}
        showTime={showTime}
        selectedSeats={selectedSeats}
        unitPrice={rawUnitPrice}
        formattedUnitPrice={formattedUnitPrice}
        currencySymbol={activeCountry.symbol}
        currencyCode={activeCountry.currency}
        user={user}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Worldwide Location Picker Modal */}
      <LocationPickerModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
      />
    </div>
  );
};

export default MovieDetails;