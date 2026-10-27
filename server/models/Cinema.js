const mongoose = require('mongoose');

const cinemaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    chain: { type: String, default: 'iMovies VIP' },
    country: { type: String, required: true },
    countryName: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    screens: { type: Number, default: 8 },
    formats: {
      type: [String],
      default: ['IMAX Laser', 'Dolby Atmos', 'VIP Recliner']
    },
    currency: { type: String, default: 'USD' },
    currencySymbol: { type: String, default: '$' },
    basePrice: { type: Number, default: 18 },
    amenities: {
      type: [String],
      default: ['Luxury Recliners', 'Gourmet In-Seat Dining', 'Valet Parking', '4K Laser']
    },
    rating: { type: Number, default: 4.8 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cinema', cinemaSchema);
