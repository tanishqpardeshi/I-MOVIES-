import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Ticket,
  MapPin,
  Calendar,
  AlertCircle,
  X,
  Lock,
  Sparkles,
  Zap,
  ArrowRight,
  QrCode,
  Smartphone,
  Check,
  Loader2
} from 'lucide-react';
import API from '../services/api';
import { resolveMoviePoster, DEFAULT_FALLBACK_POSTER } from '../utils/moviePosters';

const CheckoutModal = ({
  isOpen,
  onClose,
  movie,
  cinema,
  showDate,
  showTime,
  selectedSeats,
  unitPrice,
  formattedUnitPrice,
  currencySymbol,
  currencyCode,
  user,
  onBookingSuccess,
  availableCinemas = [],
  onSelectCinema
}) => {
  const [step, setStep] = useState(1); // 1: Details & Summary, 2: Payment, 3: Processing
  const [customerName, setCustomerName] = useState(user?.username || 'VIP Patron');
  const [customerEmail, setCustomerEmail] = useState(user?.email || 'patron@imovies.com');
  const [customerPhone, setCustomerPhone] = useState('+1 (555) 234-5678');

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  // UPI Payment states
  const [upiId, setUpiId] = useState('eshani@okhdfcbank');
  const [upiVerified, setUpiVerified] = useState(false);
  const [upiVerifying, setUpiVerifying] = useState(false);
  const [upiError, setUpiError] = useState('');
  const [upiVerifiedDetails, setUpiVerifiedDetails] = useState(null);
  const [upiMode, setUpiMode] = useState('id'); // 'id' | 'qr'

  // Hold Timer (8 minutes = 480 seconds)
  const [timeLeft, setTimeLeft] = useState(480);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setError('');
      setTimeLeft(480);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setError('Your seat hold has expired. Please reselect your seats to ensure availability.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const vipSeatsCount = selectedSeats.filter((s) => ['F', 'G', 'H'].includes(s[0])).length;
  const standardSeatsCount = selectedSeats.length - vipSeatsCount;
  const standardUnitPrice = unitPrice;
  const vipUnitPrice = Math.round(unitPrice * 1.25);

  const admissionsSubtotal =
    standardSeatsCount * standardUnitPrice + vipSeatsCount * vipUnitPrice;
  const bookingFee = Math.round(admissionsSubtotal * 0.05);
  const taxAmount = Math.round(admissionsSubtotal * 0.18);
  const discountAmount = discountApplied ? Math.round(admissionsSubtotal * 0.15) : 0;
  const finalTotal = admissionsSubtotal + bookingFee + taxAmount - discountAmount;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (discountCode.trim().toUpperCase() === 'VIP15' || discountCode.trim().toUpperCase() === 'IMOVIES') {
      setDiscountApplied(true);
      setError('');
    } else {
      setError('Invalid voucher code. Try "VIP15" for 15% VIP discount.');
    }
  };

  const getBankNameFromHandle = (handle) => {
    const lower = (handle || '').toLowerCase();
    if (lower.includes('okhdfc') || lower.includes('hdfc')) return 'HDFC Bank';
    if (lower.includes('oksbi') || lower.includes('sbi')) return 'State Bank of India';
    if (lower.includes('okicici') || lower.includes('icici')) return 'ICICI Bank';
    if (lower.includes('okaxis') || lower.includes('axis')) return 'Axis Bank';
    if (lower.includes('paytm')) return 'Paytm Payments Bank';
    if (lower.includes('ybl') || lower.includes('ibl')) return 'YES Bank / PhonePe';
    if (lower.includes('apl')) return 'Amazon Pay (Axis Bank)';
    if (lower.includes('barodampay')) return 'Bank of Baroda';
    if (lower.includes('pnb')) return 'Punjab National Bank';
    return 'Unified Payments Interface (NPCI)';
  };

  const validateUpiFormat = (id) => {
    return /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z0-9.\-_]{2,64}$/.test((id || '').trim());
  };

  const handleVerifyUpi = () => {
    setUpiError('');
    const cleanId = upiId.trim();
    if (!cleanId) {
      setUpiError('Please enter a UPI ID to verify.');
      return;
    }
    if (!validateUpiFormat(cleanId)) {
      setUpiError('Invalid format. Please enter format like username@okhdfcbank or 9876543210@paytm');
      return;
    }

    setUpiVerifying(true);
    setTimeout(() => {
      setUpiVerifying(false);
      const parts = cleanId.split('@');
      const bankName = getBankNameFromHandle(parts[1]);
      const name = customerName?.trim() || user?.username || 'VIP Patron';
      setUpiVerified(true);
      setUpiVerifiedDetails({
        name,
        bank: bankName,
        vpa: cleanId
      });
      setError('');
    }, 500);
  };

  const quickHandles = ['@okhdfcbank', '@oksbi', '@paytm', '@ybl', '@okicici', '@apl'];

  const handleApplyQuickHandle = (handle) => {
    let base = upiId.trim();
    if (base.includes('@')) {
      base = base.split('@')[0];
    }
    const newId = `${base || 'patron'}${handle}`;
    setUpiId(newId);
    setUpiVerified(false);
    setUpiVerifiedDetails(null);
    setUpiError('');
  };

  const fillTestCredentials = () => {
    if (paymentMethod === 'card') {
      setCardNumber('4242 4242 4242 4242');
      setCardExpiry('08/29');
      setCardCvc('314');
    } else if (paymentMethod === 'upi') {
      const testId = 'eshani@okhdfcbank';
      setUpiId(testId);
      setUpiVerifying(false);
      setUpiVerified(true);
      setUpiVerifiedDetails({
        name: customerName || user?.username || 'Eshani Jain',
        bank: 'HDFC Bank',
        vpa: testId
      });
      setUpiError('');
    }
  };

  const handleProcessPayment = async () => {
    if (timeLeft <= 0) {
      setError('Seat hold reservation has expired. Please select seats again.');
      return;
    }

    if (paymentMethod === 'upi' && upiMode === 'id') {
      const cleanId = upiId.trim();
      if (!cleanId) {
        setError('Please enter your UPI ID (e.g. username@okhdfcbank).');
        return;
      }
      if (!validateUpiFormat(cleanId)) {
        setError('Please enter a valid UPI ID (e.g. username@okhdfcbank or 9876543210@paytm).');
        return;
      }
      if (!upiVerified) {
        const parts = cleanId.split('@');
        const bankName = getBankNameFromHandle(parts[1]);
        setUpiVerified(true);
        setUpiVerifiedDetails({
          name: customerName || user?.username || 'VIP Patron',
          bank: bankName,
          vpa: cleanId
        });
      }
    }

    try {
      setSubmitting(true);
      setError('');

      let formattedPaymentMethod = 'Sandbox Visa (•••• 4242)';
      if (paymentMethod === 'upi') {
        const cleanId = upiId.trim() || 'patron@upi';
        const bank = upiVerifiedDetails?.bank || getBankNameFromHandle(cleanId.split('@')[1]);
        formattedPaymentMethod =
          upiMode === 'qr'
            ? 'UPI Dynamic QR (Verified NPCI Collect)'
            : `UPI: ${cleanId} (${bank})`;
      } else if (paymentMethod === 'digital') {
        formattedPaymentMethod = 'Apple Pay / Google Pay';
      }

      // Send payment & booking payload
      const { data } = await API.post('/bookings', {
        movie: movie._id,
        seats: selectedSeats,
        showDate,
        showTime,
        cinema: cinema?.name || movie.theater || 'iMovies IMAX Laser',
        city: cinema?.city || 'New York',
        country: cinema?.country || 'US',
        currency: currencyCode || 'USD',
        seatTier: selectedSeats.some((s) => ['F', 'G', 'H'].includes(s[0])) ? 'VIP Recliner' : 'Standard',
        customer: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone
        },
        paymentMethod: formattedPaymentMethod
      });

      onBookingSuccess(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment simulation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-[#EAE2D5] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header with Hold Countdown Banner */}
        <div className="bg-[#FFF9F0] border-b border-[#EAE2D5] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FDECEC] border border-[#FCD7D7] text-[#E63946] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2B2B2B] tracking-tight">
                Secure Checkout & Payment
              </h3>
              <p className="text-[11px] text-[#6B7280]">Step {step} of 2 · 256-bit Encrypted Reservation</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Hold Timer */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
                timeLeft < 60
                  ? 'bg-[#FDECEC] border-[#FCD7D7] text-[#B81D2D] animate-pulse'
                  : 'bg-[#FFF6DC] border-[#FFEDB0] text-[#7A5B14]'
              }`}
              title="Seats held exclusively for you"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{timerFormatted}</span>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white hover:bg-[#FFF6DC] text-[#6B7280] hover:text-[#2B2B2B] border border-[#EAE2D5] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm bg-white">
          {/* Reservation Overview Strip */}
          <div className="bg-[#FFF9F0] border border-[#EAE2D5] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={resolveMoviePoster(movie?.title, movie?.posterUrl)}
                alt={movie.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  if (e.currentTarget.src !== DEFAULT_FALLBACK_POSTER) {
                    e.currentTarget.src = DEFAULT_FALLBACK_POSTER;
                  }
                }}
                className="w-12 h-16 rounded-xl object-cover object-center border border-[#EAE2D5] shrink-0 shadow-xs"
              />
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-[#2B2B2B] truncate">{movie.title}</h4>
                <div className="text-xs text-[#6B7280] flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#E63946] shrink-0" />
                  {availableCinemas && availableCinemas.length > 1 && onSelectCinema ? (
                    <select
                      value={cinema?._id || ''}
                      onChange={(e) => {
                        const found = availableCinemas.find((c) => c._id === e.target.value);
                        if (found) onSelectCinema(found);
                      }}
                      className="bg-white border border-[#EAE2D5] text-[#2B2B2B] text-[11px] font-bold rounded-lg px-2 py-0.5 focus:outline-none focus:border-[#E63946] cursor-pointer max-w-[220px] truncate"
                      title="Switch cinema house"
                    >
                      {availableCinemas.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="truncate max-w-[200px] font-bold text-[#2B2B2B]">{cinema?.name || movie.theater || 'iMovies VIP Cinema'}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#6B7280] mt-1">
                  <span>{showDate}</span>
                  <span>·</span>
                  <span className="text-[#E63946] font-bold">{showTime}</span>
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-[#6B7280] block mb-1">Seats</span>
              <span className="inline-block px-2.5 py-1 bg-[#FFF6DC] border border-[#FFEDB0] text-[#7A5B14] rounded-lg text-xs font-bold font-mono">
                {selectedSeats.join(', ')}
              </span>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-[#FDECEC] border border-[#FCD7D7] text-[#B81D2D] text-xs p-3 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#E63946]" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 ? (
            /* STEP 1: Customer Details & Order Summary */
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#2B2B2B] mb-3 flex items-center gap-1.5">
                  <Ticket className="w-3.5 h-3.5 text-[#E63946]" />
                  1. Contact & Boarding Pass Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-[#2B2B2B] mb-1">Primary Patron Name *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-[#FFF9F0] border border-[#DCD3C5] focus:border-[#E63946] focus:ring-2 focus:ring-[#FFC93C]/30 focus:bg-white rounded-xl px-3.5 py-2 text-[#2B2B2B] text-xs focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2B2B2B] mb-1">Pass Delivery Email *</label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-[#FFF9F0] border border-[#DCD3C5] focus:border-[#E63946] focus:ring-2 focus:ring-[#FFC93C]/30 focus:bg-white rounded-xl px-3.5 py-2 text-[#2B2B2B] text-xs focus:outline-none transition-all"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#2B2B2B] mb-1">Mobile Contact (SMS Confirmation)</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-[#FFF9F0] border border-[#DCD3C5] focus:border-[#E63946] focus:ring-2 focus:ring-[#FFC93C]/30 focus:bg-white rounded-xl px-3.5 py-2 text-[#2B2B2B] text-xs focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Promo Code Entry */}
              <div className="bg-[#FFFDF5] border border-[#FFEDB0] rounded-2xl p-3.5 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Promo code (e.g. VIP15)"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="flex-1 bg-white border border-[#DCD3C5] rounded-xl px-3 py-1.5 text-xs text-[#2B2B2B] uppercase tracking-wider focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946]"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-3.5 py-1.5 rounded-xl bg-[#FFC93C] hover:bg-[#E5B129] text-[#1A1D20] text-xs font-bold transition-colors cursor-pointer"
                >
                  Apply Code
                </button>
              </div>

              {/* Detailed Itemized Price Bifurcation */}
              <div className="bg-[#FFFDF9] border border-[#FFEDB0] rounded-2xl p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-[#FFEDB0] pb-2">
                  <span className="font-bold text-[#7A5B14] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-[#E63946]" />
                    <span>Payment Summary &amp; Price Bifurcation</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#D62839] font-bold">
                    {selectedSeats.length} {selectedSeats.length === 1 ? 'ticket' : 'tickets'}
                  </span>
                </div>

                {standardSeatsCount > 0 && (
                  <div className="flex justify-between text-[#4B5563]">
                    <span>
                      Standard Auditorium Seats ({standardSeatsCount} × {currencySymbol}{standardUnitPrice})
                    </span>
                    <span className="font-mono text-[#2B2B2B] font-bold">
                      {currencySymbol}{standardSeatsCount * standardUnitPrice}
                    </span>
                  </div>
                )}

                {vipSeatsCount > 0 && (
                  <div className="flex justify-between text-[#7A5B14]">
                    <span>
                      VIP Recliner Suites ({vipSeatsCount} × {currencySymbol}{vipUnitPrice})
                    </span>
                    <span className="font-mono text-[#B81D2D] font-bold">
                      {currencySymbol}{vipSeatsCount * vipUnitPrice}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-[#6B7280]">
                  <span>Convenience &amp; Laser Projection Surcharge (5%)</span>
                  <span className="font-mono text-[#2B2B2B] font-bold">
                    {currencySymbol}{bookingFee}
                  </span>
                </div>

                <div className="flex justify-between text-[#6B7280]">
                  <span>Integrated GST / Entertainment Tax (18%)</span>
                  <span className="font-mono text-[#2B2B2B] font-bold">
                    {currencySymbol}{taxAmount}
                  </span>
                </div>

                {discountApplied && (
                  <div className="flex justify-between text-[#047857] font-semibold bg-[#ECFDF5] border border-[#A7F3D0] p-2 rounded-xl">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> VIP Privilege Discount (15%)
                    </span>
                    <span className="font-mono">
                      -{currencySymbol}{discountAmount}
                    </span>
                  </div>
                )}

                <div className="flex justify-between pt-2.5 border-t border-[#EAE2D5] text-sm font-bold text-[#2B2B2B]">
                  <span>Grand Total Payable ({currencyCode})</span>
                  <span className="text-xl font-black text-[#E63946] font-mono">
                    {currencySymbol}{finalTotal}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* STEP 2: Simulated Payment Gateway (Test Mode) */
            <div className="space-y-5">
              {/* Step 2 Price Bifurcation Quick Summary Strip */}
              <div className="bg-[#FFF9F0] border border-[#EAE2D5] rounded-2xl p-3 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#6B7280] block text-[10px] uppercase font-bold">Bifurcation Overview</span>
                  <span className="text-[#2B2B2B] font-semibold">
                    Admissions: <strong className="font-mono">{currencySymbol}{admissionsSubtotal}</strong> · Fees &amp; Tax: <strong className="font-mono">{currencySymbol}{bookingFee + taxAmount}</strong>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#6B7280] uppercase font-bold block">Total Due</span>
                  <span className="text-base font-black text-[#E63946] font-mono">
                    {currencySymbol}{finalTotal}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 bg-[#FFF6DC] border border-[#FFEDB0] rounded-2xl p-3 text-xs text-[#7A5B14]">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#E5B129] shrink-0" />
                  <span>
                    <strong>Sandbox Mode:</strong> Testing simulation mode. Zero actual charges.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {paymentMethod === 'upi' ? (
                    <button
                      type="button"
                      onClick={fillTestCredentials}
                      className="text-[11px] underline font-bold text-[#B81D2D] hover:text-[#E63946] shrink-0 cursor-pointer"
                    >
                      Auto-Fill Test UPI
                    </button>
                  ) : paymentMethod === 'card' ? (
                    <button
                      type="button"
                      onClick={fillTestCredentials}
                      className="text-[11px] underline font-bold text-[#B81D2D] hover:text-[#E63946] shrink-0 cursor-pointer"
                    >
                      Auto-Fill Test Card
                    </button>
                  ) : null}
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('upi');
                    setError('');
                  }}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    paymentMethod === 'upi'
                      ? 'bg-[#FFF6DC] border-[#FFC93C] text-[#2B2B2B] ring-2 ring-[#FFC93C]/40 shadow-xs'
                      : 'bg-[#FFF9F0] border-[#EAE2D5] text-[#6B7280] hover:text-[#2B2B2B]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#097939] to-[#0D532A] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                    UPI
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate text-[#2B2B2B]">UPI Payment</p>
                    <p className="text-[10px] text-[#6B7280] truncate">GPay, PhonePe, Paytm</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('card');
                    setError('');
                  }}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-[#FFF6DC] border-[#FFC93C] text-[#2B2B2B] ring-2 ring-[#FFC93C]/40 shadow-xs'
                      : 'bg-[#FFF9F0] border-[#EAE2D5] text-[#6B7280] hover:text-[#2B2B2B]'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#E63946] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate text-[#2B2B2B]">Credit / Debit Card</p>
                    <p className="text-[10px] text-[#6B7280] truncate">Visa, Mastercard</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('digital');
                    setError('');
                  }}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    paymentMethod === 'digital'
                      ? 'bg-[#FFF6DC] border-[#FFC93C] text-[#2B2B2B] ring-2 ring-[#FFC93C]/40 shadow-xs'
                      : 'bg-[#FFF9F0] border-[#EAE2D5] text-[#6B7280] hover:text-[#2B2B2B]'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-[#E5B129] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate text-[#2B2B2B]">Express Digital</p>
                    <p className="text-[10px] text-[#6B7280] truncate">Apple / Google Pay</p>
                  </div>
                </button>
              </div>

              {/* UPI Gateway Section */}
              {paymentMethod === 'upi' ? (
                <div className="space-y-4 bg-[#FFF9F0] border border-[#EAE2D5] p-4 sm:p-5 rounded-2xl">
                  {/* Mode switcher: VPA ID or Dynamic QR */}
                  <div className="flex items-center gap-2 p-1 bg-white border border-[#EAE2D5] rounded-xl">
                    <button
                      type="button"
                      onClick={() => setUpiMode('id')}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        upiMode === 'id'
                          ? 'bg-[#E63946] text-white shadow-xs'
                          : 'text-[#6B7280] hover:text-[#2B2B2B]'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Enter UPI ID / VPA</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUpiMode('qr')}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        upiMode === 'qr'
                          ? 'bg-[#E63946] text-white shadow-xs'
                          : 'text-[#6B7280] hover:text-[#2B2B2B]'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Scan UPI QR Code</span>
                    </button>
                  </div>

                  {upiMode === 'id' ? (
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold text-[#2B2B2B]">
                            Virtual Payment Address (UPI ID) *
                          </label>
                          {upiVerified && (
                            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Verified VPA
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              value={upiId}
                              onChange={(e) => {
                                setUpiId(e.target.value);
                                setUpiVerified(false);
                                setUpiVerifiedDetails(null);
                                setUpiError('');
                              }}
                              placeholder="e.g. yourname@okhdfcbank or mobile@paytm"
                              className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:outline-none transition-all ${
                                upiVerified
                                  ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                                  : 'border-[#DCD3C5] focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946]'
                              }`}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={handleVerifyUpi}
                            disabled={upiVerifying || !upiId.trim()}
                            className="px-4 py-2.5 bg-[#FFC93C] hover:bg-[#E5B129] disabled:opacity-50 text-[#1A1D20] text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs"
                          >
                            {upiVerifying ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Verifying...</span>
                              </>
                            ) : upiVerified ? (
                              <>
                                <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-800" />
                                <span>Verified</span>
                              </>
                            ) : (
                              <span>Verify UPI ID</span>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Quick Bank Handle Suggestions */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        <span className="text-[11px] text-[#6B7280] font-medium mr-1">Popular handles:</span>
                        {quickHandles.map((handle) => (
                          <button
                            key={handle}
                            type="button"
                            onClick={() => handleApplyQuickHandle(handle)}
                            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-white hover:bg-[#FFF6DC] border border-[#EAE2D5] text-[#2B2B2B] transition-colors cursor-pointer"
                          >
                            {handle}
                          </button>
                        ))}
                      </div>

                      {/* Verified VPA details notification badge */}
                      {upiVerified && upiVerifiedDetails && (
                        <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl p-3 flex items-center justify-between gap-3 text-xs animate-in fade-in">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-6 h-6 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-extrabold text-[#065F46] truncate">
                                Verified: {upiVerifiedDetails.name}
                              </p>
                              <p className="text-[11px] text-[#047857] truncate">
                                Bank: <span className="font-bold">{upiVerifiedDetails.bank}</span> · VPA: {upiVerifiedDetails.vpa}
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-[#065F46] bg-white border border-[#A7F3D0] px-2 py-0.5 rounded-md shrink-0">
                            NPCI Ready
                          </span>
                        </div>
                      )}

                      {/* UPI Error message */}
                      {upiError && (
                        <div className="flex items-center gap-2 bg-[#FDECEC] border border-[#FCD7D7] text-[#B81D2D] text-xs p-2.5 rounded-xl">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#E63946]" />
                          <span>{upiError}</span>
                        </div>
                      )}

                      {/* Supported UPI Apps strip */}
                      <div className="pt-2 border-t border-[#EAE2D5] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#6B7280]">
                        <span>Supported UPI Apps:</span>
                        <div className="flex items-center gap-1.5 font-bold text-[10px] flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-white border border-[#EAE2D5] text-[#1E3A8A]">Google Pay</span>
                          <span className="px-2 py-0.5 rounded bg-white border border-[#EAE2D5] text-[#5F259F]">PhonePe</span>
                          <span className="px-2 py-0.5 rounded bg-white border border-[#EAE2D5] text-[#00BAF2]">Paytm</span>
                          <span className="px-2 py-0.5 rounded bg-white border border-[#EAE2D5] text-[#0066B2]">BHIM</span>
                          <span className="px-2 py-0.5 rounded bg-white border border-[#EAE2D5] text-[#111827]">CRED</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Dynamic UPI QR Code View */
                    <div className="text-center py-2 space-y-3">
                      <div className="relative inline-block bg-white p-4 rounded-2xl border-2 border-[#EAE2D5] shadow-xs">
                        <svg className="w-36 h-36 mx-auto text-[#2B2B2B]" viewBox="0 0 100 100" fill="currentColor">
                          {/* Corner positioning marks */}
                          <rect x="5" y="5" width="28" height="28" fill="#1F2937" rx="3" />
                          <rect x="9" y="9" width="20" height="20" fill="white" rx="1" />
                          <rect x="13" y="13" width="12" height="12" fill="#1F2937" rx="1" />

                          <rect x="67" y="5" width="28" height="28" fill="#1F2937" rx="3" />
                          <rect x="71" y="9" width="20" height="20" fill="white" rx="1" />
                          <rect x="75" y="13" width="12" height="12" fill="#1F2937" rx="1" />

                          <rect x="5" y="67" width="28" height="28" fill="#1F2937" rx="3" />
                          <rect x="9" y="71" width="20" height="20" fill="white" rx="1" />
                          <rect x="13" y="75" width="12" height="12" fill="#1F2937" rx="1" />

                          {/* Data elements */}
                          <rect x="38" y="10" width="6" height="6" fill="#1F2937" />
                          <rect x="48" y="14" width="6" height="6" fill="#1F2937" />
                          <rect x="58" y="8" width="5" height="5" fill="#1F2937" />
                          <rect x="38" y="22" width="6" height="6" fill="#1F2937" />
                          <rect x="48" y="24" width="5" height="5" fill="#1F2937" />

                          <rect x="10" y="38" width="6" height="6" fill="#1F2937" />
                          <rect x="20" y="44" width="5" height="5" fill="#1F2937" />
                          
                          {/* Center UPI Badge */}
                          <rect x="37" y="37" width="26" height="26" fill="#097939" rx="5" />
                          <text x="50" y="54" fill="white" fontSize="9" fontWeight="900" textAnchor="middle">UPI</text>

                          <rect x="68" y="38" width="6" height="6" fill="#1F2937" />
                          <rect x="80" y="42" width="7" height="6" fill="#1F2937" />
                          <rect x="74" y="52" width="5" height="6" fill="#1F2937" />

                          <rect x="38" y="68" width="6" height="6" fill="#1F2937" />
                          <rect x="48" y="74" width="6" height="6" fill="#1F2937" />
                          <rect x="58" y="68" width="5" height="5" fill="#1F2937" />
                          <rect x="44" y="84" width="8" height="6" fill="#1F2937" />
                          <rect x="58" y="80" width="6" height="6" fill="#1F2937" />
                          <rect x="70" y="70" width="6" height="6" fill="#1F2937" />
                          <rect x="82" y="78" width="6" height="6" fill="#1F2937" />
                          <rect x="74" y="86" width="6" height="6" fill="#1F2937" />
                        </svg>
                        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-[#097939] text-white px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase shadow-xs">
                          Scan & Pay
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs font-bold text-[#2B2B2B]">
                          Scan QR using GPay, PhonePe, Paytm, BHIM, or any UPI App
                        </p>
                        <p className="text-[11px] text-[#6B7280]">
                          Collect Request: <span className="text-[#E63946] font-bold font-mono">{currencySymbol}{finalTotal}</span> · Payee: <span className="font-bold text-[#2B2B2B]">iMovies Cinemas</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : paymentMethod === 'card' ? (
                <div className="space-y-3.5 bg-[#FFF9F0] border border-[#EAE2D5] p-4 rounded-2xl">
                  <div>
                    <label className="block text-xs font-bold text-[#2B2B2B] mb-1">Card Number (Sandbox)</label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-white border border-[#DCD3C5] rounded-xl pl-9 pr-4 py-2 text-[#2B2B2B] font-mono text-xs focus:border-[#E63946] focus:outline-none focus:ring-1 focus:ring-[#E63946]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#2B2B2B] mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-white border border-[#DCD3C5] rounded-xl px-3 py-2 text-[#2B2B2B] font-mono text-xs focus:border-[#E63946] focus:outline-none text-center focus:ring-1 focus:ring-[#E63946]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#2B2B2B] mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full bg-white border border-[#DCD3C5] rounded-xl px-3 py-2 text-[#2B2B2B] font-mono text-xs focus:border-[#E63946] focus:outline-none text-center focus:ring-1 focus:ring-[#E63946]"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#FFF9F0] border border-[#EAE2D5] p-6 rounded-2xl text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-[#FFF6DC] border border-[#FFEDB0] text-[#7A5B14] flex items-center justify-center mx-auto">
                    <Lock className="w-5 h-5 text-[#E5B129]" />
                  </div>
                  <p className="text-xs font-bold text-[#2B2B2B]">Biometric Quick Checkout Ready</p>
                  <p className="text-[11px] text-[#6B7280] max-w-sm mx-auto">
                    Simulated biometric authentication will authorize payment of {currencySymbol}
                    {finalTotal} upon confirmation.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-[#EAE2D5] bg-[#FFF9F0] flex items-center justify-between gap-4">
          {step === 1 ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#FFF6DC] text-[#2B2B2B] border border-[#EAE2D5] text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel Hold
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!customerName || !customerEmail || timeLeft <= 0}
                className="flex items-center gap-2 bg-[#E63946] hover:bg-[#D62839] disabled:opacity-40 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#FFF6DC] text-[#2B2B2B] border border-[#EAE2D5] text-xs font-bold transition-colors cursor-pointer"
              >
                Back to Details
              </button>
              <button
                type="button"
                disabled={submitting || timeLeft <= 0}
                onClick={handleProcessPayment}
                className="flex items-center gap-2 bg-[#E63946] hover:bg-[#D62839] disabled:opacity-40 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>
                  {submitting
                    ? 'Authorizing Booking...'
                    : paymentMethod === 'upi'
                    ? `Pay ${currencySymbol}${finalTotal} via UPI`
                    : `Authorize ${currencySymbol}${finalTotal} (${currencyCode})`}
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
