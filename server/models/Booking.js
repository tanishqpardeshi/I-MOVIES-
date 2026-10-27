const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  seats: { type: [String], required: true },
  totalPrice: { type: Number, required: true },
  showDate: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  showTime: {
    type: String,
    default: '06:30 PM'
  },
  bookingRef: {
    type: String,
    default: () => `IMV-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
  },
  cinema: { type: String, default: 'iMovies IMAX Laser' },
  city: { type: String, default: 'New York' },
  country: { type: String, default: 'US' },
  currency: { type: String, default: 'INR' },
  seatTier: { type: String, default: 'Standard' },
  customer: {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' }
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'pending', 'refunded'],
    default: 'paid'
  },
  paymentMethod: { type: String, default: 'Test Payment Gateway' },
  paymentTransactionId: {
    type: String,
    default: () => `TXN_${Math.random().toString(36).substring(2, 10).toUpperCase()}`
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  },
  bookingDate: { type: Date, default: Date.now }
});

bookingSchema.index(
  { movie: 1, showDate: 1, showTime: 1, seats: 1 },
  { unique: true, name: 'unique_movie_show_seat' }
);

module.exports = mongoose.model('Booking', bookingSchema);