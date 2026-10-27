const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Booking = require('./models/Booking');

dotenv.config();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  process.env.JWT_SECRET = 'imovies_super_secret_jwt_key_that_is_at_least_32_characters_long';
}

const app = express();
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to iMovies API - Server is running' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/movies', require('./routes/movieRoutes'));
app.use('/api/cinemas', require('./routes/cinemaRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/images', require('./routes/imageRoutes'));

app.use((err, req, res, next) => {
  if (
    err.name === 'MongooseError' ||
    err.name === 'MongoNetworkError' ||
    (err.message && err.message.includes('buffering timed out'))
  ) {
    console.warn('[AI Studio] Database offline — returning fallback response');
    if (req.method === 'GET') {
      return res.json(req.path.endsWith('s') || req.path.endsWith('s/') ? [] : {});
    }
    return res.status(503).json({ error: 'Service temporarily unavailable (database offline)' });
  }
  next(err);
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    try {
      if (mongoose.connection.readyState === 1) {
        await Booking.init();
      }
    } catch (e) {
      // Ignored when offline
    }

    const server = app.listen(PORT, '0.0.0.0');
    await new Promise((resolve, reject) => {
      server.once('listening', resolve);
      server.once('error', reject);
    });
    console.log(`iMovies Server running on http://0.0.0.0:${PORT}`);
  } catch (error) {
    console.error(`Failed to start iMovies Server: ${error.message}`);
    await mongoose.disconnect();
    process.exitCode = 1;
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;