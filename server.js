const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./server/config/db');
const Booking = require('./server/models/Booking');

dotenv.config();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  process.env.JWT_SECRET = 'imovies_super_secret_jwt_key_that_is_at_least_32_characters_long';
}

const PORT = parseInt(process.env.PORT || '3000', 10);
const isProduction = process.env.NODE_ENV === 'production';

async function start() {
  const app = express();
  app.set('trust proxy', 1);

  app.use(cors());
  app.use(express.json());

  // Connect database if configured
  await connectDB();
  try {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      await Booking.init();
    }
  } catch (e) {
    // Ignored when offline
  }

  // API Routes
  app.use('/api/auth', require('./server/routes/authRoutes'));
  app.use('/api/movies', require('./server/routes/movieRoutes'));
  app.use('/api/cinemas', require('./server/routes/cinemaRoutes'));
  app.use('/api/bookings', require('./server/routes/bookingRoutes'));
  app.use('/posters', express.static(path.resolve(__dirname, 'client/public/posters'), {
    maxAge: '7d',
    immutable: true
  }));
  app.use('/api/images', require('./server/routes/imageRoutes'));

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Handle database offline errors gracefully
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

  const clientDist = path.resolve(__dirname, 'client/dist');

  if (isProduction && fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
    app.get('*', (req, res) => {
      res.sendFile(path.join(clientDist, 'index.html'));
    });
  } else {
    // Mount Vite dev server middleware
    try {
      const { createServer: createViteServer } = require('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
        appType: 'spa',
        root: path.resolve(__dirname, 'client')
      });
      app.use(vite.middlewares);
    } catch (err) {
      console.warn('[iMovies] Vite middleware error, trying static files:', err.message);
      if (fs.existsSync(clientDist)) {
        app.use(express.static(clientDist));
        app.get('*', (req, res) => {
          res.sendFile(path.join(clientDist, 'index.html'));
        });
      }
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[iMovies] Server running on http://0.0.0.0:${PORT}`);
  });
}

process.on('uncaughtException', (err) => {
  console.warn('[iMovies] Process uncaught exception:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.warn('[iMovies] Process unhandled rejection:', reason?.message || reason);
});

start().catch((err) => {
  console.error('[iMovies] Fatal server startup error:', err);
  process.exit(1);
});
