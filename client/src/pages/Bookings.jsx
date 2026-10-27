import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  Film,
  CheckCircle,
  X,
  Sparkles,
  Printer,
  Ban,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import API from '../services/api';
import { useLocationContext } from '../context/LocationContext';
import { resolveMoviePoster, DEFAULT_FALLBACK_POSTER } from '../utils/moviePosters';

const Bookings = () => {
  const location = useLocation();
  const { formatPrice } = useLocationContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(Boolean(location.state?.newBooking));

  // Cancellation modal state
  const [cancelModal, setCancelModal] = useState({ isOpen: false, bookingId: null, movieTitle: '' });
  const [cancelling, setCancelling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/bookings/user');
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handlePrint = (bookingRef) => {
    window.print();
  };

  const handleConfirmCancel = async () => {
    if (!cancelModal.bookingId) return;
    try {
      setCancelling(true);
      await API.post(`/bookings/${cancelModal.bookingId}/cancel`);
      setCancelMessage('Your reservation has been cancelled. Simulated refund issued.');
      fetchBookings();
      setTimeout(() => {
        setCancelModal({ isOpen: false, bookingId: null, movieTitle: '' });
        setCancelMessage('');
      }, 1500);
    } catch (err) {
      setCancelMessage(err.response?.data?.message || 'Failed to cancel reservation');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Newly Confirmed VIP Reservation Banner */}
      {showToast && (
        <div className="bg-[#FFF6DC] border border-[#FFEDB0] rounded-2xl p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 shadow-xs animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFC93C] text-[#1A1D20] flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#2B2B2B] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#E5B129]" />
                VIP Reservation Confirmed!
              </p>
              <p className="text-xs text-[#6B7280] mt-0.5">
                {location.state?.movieTitle ? (
                  <>
                    Your seats for{' '}
                    <span className="text-[#E63946] font-bold">{location.state.movieTitle}</span> (
                    {Array.isArray(location.state.seats)
                      ? location.state.seats.join(', ')
                      : location.state.seats}
                    ) have been issued below.
                  </>
                ) : (
                  'Your digital boarding pass has been secured and issued below.'
                )}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowToast(false)}
            className="text-[#6B7280] hover:text-[#2B2B2B] p-1 rounded-lg transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE2D5] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2B2B2B] flex items-center gap-3">
            <Ticket className="w-7 h-7 text-[#E63946]" />
            Confirmed Digital Passes
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1.5">
            Present this authentic digital boarding pass upon arrival at the auditorium suite
          </p>
        </div>
        <Link
          to="/"
          className="text-xs font-bold bg-white hover:bg-[#FFF6DC] border border-[#EAE2D5] text-[#E63946] px-4 py-2.5 rounded-xl transition-colors self-start sm:self-auto shadow-xs"
        >
          + Reserve Another Film
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white border border-[#EAE2D5] rounded-3xl p-12 text-center space-y-4 shadow-xs">
          <Film className="w-12 h-12 text-[#FFC93C] mx-auto" />
          <h3 className="text-lg font-bold text-[#2B2B2B]">No Passes Reserved Yet</h3>
          <p className="text-xs text-[#6B7280] max-w-md mx-auto leading-relaxed">
            You do not currently have any active movie reservations. Explore the worldwide showcase, test the interactive seat map, and confirm your seats.
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-block bg-[#E63946] hover:bg-[#D62839] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-colors shadow-xs"
            >
              Browse Now Showing
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => {
            const movie = booking.movie || {};
            const seatsList = Array.isArray(booking.seats) ? booking.seats.join(', ') : booking.seats;
            const isCancelled = booking.status === 'cancelled';
            const bookingRef =
              booking.bookingRef || `IMV-${(booking._id || '').slice(-6).toUpperCase()}`;

            return (
              <div
                key={booking._id}
                className={`relative bg-white border rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-xs transition-all ${
                  isCancelled
                    ? 'border-[#EAE2D5] opacity-60 bg-[#FAFAFA]'
                    : 'border-[#EAE2D5] hover:border-[#FFC93C]'
                }`}
              >
                {/* Main Pass Section */}
                <div className="flex flex-col sm:flex-row gap-5 p-5 sm:p-6 flex-1 items-start sm:items-center">
                  <img
                    src={resolveMoviePoster(movie?.title, movie?.posterUrl)}
                    alt={movie.title || 'Movie'}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      if (e.currentTarget.src !== DEFAULT_FALLBACK_POSTER) {
                        e.currentTarget.src = DEFAULT_FALLBACK_POSTER;
                      }
                    }}
                    className="w-20 sm:w-28 aspect-[3/4] rounded-xl object-cover border border-[#EAE2D5] shadow-xs shrink-0"
                  />

                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {isCancelled ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#B81D2D] bg-[#FDECEC] border border-[#FCD7D7] px-2.5 py-0.5 rounded-md">
                          <Ban className="w-3 h-3" />
                          Reservation Cancelled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#7A5B14] bg-[#FFF6DC] border border-[#FFEDB0] px-2.5 py-0.5 rounded-md">
                          <CheckCircle className="w-3 h-3 text-[#E5B129]" />
                          Confirmed VIP Admission
                        </span>
                      )}

                      <span className="text-[10px] text-[#6B7280] font-mono">
                        Ref: <strong className="text-[#2B2B2B]">{bookingRef}</strong>
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-[#2B2B2B] tracking-tight truncate">
                      {movie.title || 'Feature Film Presentation'}
                    </h3>

                    <p className="text-xs text-[#6B7280] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#E63946] shrink-0" />
                      <span className="truncate">
                        {booking.cinema || movie.theater || 'iMovies VIP Cinema'}
                      </span>
                    </p>

                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1 text-xs text-[#6B7280]">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#E63946]" />
                        <span className="font-mono text-[#2B2B2B]">
                          {booking.showDate || new Date(booking.bookingDate).toLocaleDateString()}
                        </span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#E63946]" />
                        <span className="font-bold text-[#E63946]">
                          {booking.showTime || '06:30 PM'}
                        </span>
                      </span>
                      {booking.paymentMethod && (
                        <span className="text-[11px] font-semibold text-[#065F46] bg-[#ECFDF5] border border-[#A7F3D0] px-2 py-0.5 rounded-lg truncate max-w-xs">
                          {booking.paymentMethod}
                        </span>
                      )}
                    </div>

                    {/* Actions: Print and Cancel */}
                    <div className="flex items-center gap-3 pt-2 text-xs">
                      <button
                        type="button"
                        onClick={() => handlePrint(bookingRef)}
                        className="inline-flex items-center gap-1.5 text-[#6B7280] hover:text-[#2B2B2B] transition-colors cursor-pointer font-medium"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Pass</span>
                      </button>

                      {!isCancelled && (
                        <button
                          type="button"
                          onClick={() =>
                            setCancelModal({
                              isOpen: true,
                              bookingId: booking._id,
                              movieTitle: movie.title || 'Movie'
                            })
                          }
                          className="inline-flex items-center gap-1.5 text-[#B81D2D] hover:text-[#991B1B] transition-colors cursor-pointer font-medium"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Cancel Pass</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Perforated Stub Divider (Dashed with notches) */}
                <div className="relative border-t md:border-t-0 md:border-l border-dashed border-[#EAE2D5] bg-[#FFF9F0] p-5 sm:p-6 flex flex-row md:flex-col justify-between items-center md:items-end min-w-[220px]">
                  {/* Decorative notch cutouts on desktop */}
                  <div className="hidden md:block absolute -top-3 -left-3 w-6 h-6 rounded-full bg-[#FFF9F0] border border-[#EAE2D5]" />
                  <div className="hidden md:block absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-[#FFF9F0] border border-[#EAE2D5]" />

                  <div className="text-left md:text-right space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#6B7280] block">
                      Reserved Recliners
                    </span>
                    <span className="text-base font-black font-mono text-[#2B2B2B] block">
                      {seatsList}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#6B7280] block pt-1">
                      {isCancelled ? 'Refund Status' : 'Amount Paid'}
                    </span>
                    <span className="text-xl font-black text-[#E63946] font-mono tabular-nums block">
                      {isCancelled
                        ? 'Refunded'
                        : `${booking.currency || '₹'} ${booking.totalPrice}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-2 md:pt-4">
                    <div className="bg-white p-1.5 rounded-xl border border-[#EAE2D5] shadow-xs">
                      <QrCode className="w-7 h-7 text-[#2B2B2B]" />
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] uppercase tracking-wider text-[#6B7280] block">
                        Scan at Gate
                      </span>
                      <span className="text-xs font-mono font-bold text-[#E63946]">
                        #{bookingRef.slice(-6)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {cancelModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-[#EAE2D5] rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FDECEC] border border-[#FCD7D7] text-[#E63946] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#2B2B2B]">
                  Cancel Reservation?
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Are you sure you want to cancel your passes for <strong>{cancelModal.movieTitle}</strong>?
                </p>
              </div>
            </div>

            <p className="text-xs text-[#6B7280] bg-[#FFF9F0] border border-[#EAE2D5] p-3 rounded-xl leading-relaxed">
              Your reserved seats will immediately be released back into auditorium inventory, and a simulated full refund will be processed to your original test payment method.
            </p>

            {cancelMessage && (
              <p className="text-xs font-bold text-[#E63946] text-center">{cancelMessage}</p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancelModal({ isOpen: false, bookingId: null, movieTitle: '' })}
                className="px-4 py-2 rounded-xl bg-white hover:bg-[#FFF6DC] text-[#2B2B2B] border border-[#EAE2D5] text-xs font-semibold cursor-pointer transition-colors"
              >
                Keep Reservation
              </button>
              <button
                type="button"
                disabled={cancelling}
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl bg-[#E63946] hover:bg-[#D62839] text-white font-bold text-xs shadow-xs cursor-pointer transition-colors"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;