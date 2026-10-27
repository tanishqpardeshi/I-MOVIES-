const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const inMemoryStore = require('../config/inMemoryStore');
const https = require('https');

const isMongoConnected = () => Boolean(mongoose.connection && mongoose.connection.readyState === 1);
const TMDB_API_KEY = (process.env.TMDB_API_KEY || '').trim();
const hasValidTmdbKey = TMDB_API_KEY.length >= 10 && !TMDB_API_KEY.includes('your_');

// Helper to make server-side HTTPS request to TMDB
const fetchFromTmdb = (endpoint, params = {}) => {
  return new Promise((resolve, reject) => {
    if (!TMDB_API_KEY) {
      return reject(new Error('TMDB_API_KEY not configured'));
    }

    const queryParams = new URLSearchParams({
      api_key: TMDB_API_KEY,
      language: 'en-US',
      ...params
    });

    const url = `https://api.themoviedb.org/3${endpoint}?${queryParams.toString()}`;

    const req = https.get(url, { timeout: 4000 }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(parsed.status_message || 'TMDB API error'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('TMDB request timeout'));
    });
  });
};

// Map TMDB item to our standard Movie object
const formatTmdbMovie = (item, extra = {}) => {
  const genres = item.genres ? item.genres.map((g) => g.name) : ['Action', 'Adventure'];
  const trailer = (extra.videos?.results || []).find(
    (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  );
  const cast = (extra.credits?.cast || []).slice(0, 5).map((c) => ({
    name: c.name,
    character: c.character,
    profileUrl: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : ''
  }));
  const director = (extra.credits?.crew || []).find((c) => c.job === 'Director')?.name || '';

  return {
    _id: `tmdb_${item.id}`,
    tmdbId: String(item.id),
    title: item.title || item.original_title,
    description: item.overview || 'Synopsis coming soon.',
    genre: genres.length > 0 ? genres : ['Cinema Presentation'],
    duration: item.runtime || 135,
    posterUrl: item.poster_path ? `https://image.tmdb.org/t/p/w780${item.poster_path}` : '',
    backdropUrl: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : '',
    releaseDate: item.release_date || new Date().toISOString(),
    ticketPrice: 280,
    theater: 'iMovies IMAX Laser - Screen 1',
    rating: Number(item.vote_average ? item.vote_average.toFixed(1) : 8.5),
    language: item.original_language === 'en' ? 'English' : item.original_language?.toUpperCase() || 'English',
    trailerKey: trailer ? trailer.key : '',
    director,
    cast,
    category: 'now_playing',
    showtimes: ['10:30 AM', '02:00 PM', '06:30 PM', '09:45 PM'],
    countryAvailability: ['US', 'GB', 'IN', 'CA', 'AU', 'DE', 'JP', 'SG', 'AE'],
    isLiveTmdb: true
  };
};

// @desc    Fetch all active movies with worldwide filtering
exports.getMovies = async (req, res) => {
  const { search, genre, category, country, language, industry, sortBy, minRating } = req.query;

  // Attempt live TMDB if API key is provided and requested
  if (hasValidTmdbKey && (category || search)) {
    try {
      let tmdbEndpoint = '/movie/now_playing';
      if (category === 'upcoming') tmdbEndpoint = '/movie/upcoming';
      if (category === 'popular') tmdbEndpoint = '/movie/popular';
      if (search) tmdbEndpoint = '/search/movie';

      const tmdbData = await fetchFromTmdb(tmdbEndpoint, {
        query: search || undefined,
        region: country || undefined
      });

      if (tmdbData && Array.isArray(tmdbData.results) && tmdbData.results.length > 0) {
        let liveMovies = tmdbData.results.slice(0, 16).map((m) => formatTmdbMovie(m));
        if (minRating && Number(minRating) > 0) {
          liveMovies = liveMovies.filter((m) => Number(m.rating || 0) >= Number(minRating));
        }
        return res.status(200).json(liveMovies);
      }
    } catch (tmdbErr) {
      console.warn('[TMDB Live] Falling back to verified catalog:', tmdbErr.message);
    }
  }

  // Fast-path: When MongoDB is offline, immediately return inMemoryStore catalog with zero latency
  if (!isMongoConnected()) {
    let movies = inMemoryStore.getMovies(search, genre, category, country, language, industry, sortBy, minRating);
    if (req.query.limit) {
      const parsedLimit = parseInt(req.query.limit, 10);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        movies = movies.slice(0, parsedLimit);
      }
    }
    return res.status(200).json(movies);
  }

  // Database Query with Mongoose (when connected)
  try {
    const query = {};

    if (search) {
      const trimmed = search.trim();
      const fuzzyVowel = trimmed.replace(/aa+/gi, 'a?a?').replace(/ee+/gi, 'e?e?').replace(/oo+/gi, 'o?o?');
      query.$or = [
        { title: { $regex: trimmed, $options: 'i' } },
        { title: { $regex: fuzzyVowel, $options: 'i' } },
        { aliases: { $regex: trimmed, $options: 'i' } },
        { aliases: { $regex: fuzzyVowel, $options: 'i' } },
        { description: { $regex: trimmed, $options: 'i' } },
        { director: { $regex: trimmed, $options: 'i' } },
        { 'cast.name': { $regex: trimmed, $options: 'i' } },
        { genre: { $regex: trimmed, $options: 'i' } }
      ];
    }
    if (industry && industry !== 'All') {
      query.industry = new RegExp(`^${industry}$`, 'i');
    }
    if (genre && genre !== 'All') {
      query.genre = { $in: [genre] };
    }
    if (minRating && Number(minRating) > 0) {
      query.rating = { $gte: Number(minRating) };
    }
    if (category && category !== 'all') {
      if (category === 'past') {
        query.$or = [
          { category: 'past' },
          { category: 'popular' },
          { releaseDate: { $lt: new Date('2024-01-01') } }
        ];
      } else {
        query.category = category;
      }
    }
    if (language && language !== 'All') {
      query.language = new RegExp(`^${language}$`, 'i');
    }
    if (country) {
      query.countryAvailability = { $in: [country.toUpperCase()] };
    }

    let sortObj = { releaseDate: -1 };
    if (sortBy === 'genre') sortObj = { genre: 1, title: 1 };
    if (sortBy === 'rating') sortObj = { rating: -1 };
    if (sortBy === 'title') sortObj = { title: 1 };
    if (sortBy === 'duration') sortObj = { duration: -1 };
    if (sortBy === 'upcoming_first') sortObj = { releaseDate: -1 };
    if (sortBy === 'past_first') sortObj = { releaseDate: 1 };
    if (sortBy === 'releaseDate') sortObj = { releaseDate: -1 };

    let movies = await Movie.find(query).sort(sortObj);
    if (movies && movies.length > 0) {
      if (req.query.limit) {
        const parsedLimit = parseInt(req.query.limit, 10);
        if (!isNaN(parsedLimit) && parsedLimit > 0) movies = movies.slice(0, parsedLimit);
      }
      return res.status(200).json(movies);
    }

    // In-memory fallback
    let fallbackMovies = inMemoryStore.getMovies(search, genre, category, country, language, industry, sortBy, minRating);
    if (req.query.limit) {
      const parsedLimit = parseInt(req.query.limit, 10);
      if (!isNaN(parsedLimit) && parsedLimit > 0) fallbackMovies = fallbackMovies.slice(0, parsedLimit);
    }
    return res.status(200).json(fallbackMovies);
  } catch (error) {
    // In-memory fallback if MongoDB is offline
    let movies = inMemoryStore.getMovies(search, genre, category, country, language, industry, sortBy, minRating);
    if (req.query.limit) {
      const parsedLimit = parseInt(req.query.limit, 10);
      if (!isNaN(parsedLimit) && parsedLimit > 0) movies = movies.slice(0, parsedLimit);
    }
    return res.status(200).json(movies);
  }
};

// @desc    Fetch single movie by ID with cast and trailer
// @route   GET /api/movies/:id
exports.getMovieById = async (req, res) => {
  const { id } = req.params;

  // If TMDB ID format: tmdb_XXXXX
  if (id.startsWith('tmdb_') && hasValidTmdbKey) {
    const rawTmdbId = id.replace('tmdb_', '');
    try {
      const tmdbMovie = await fetchFromTmdb(`/movie/${rawTmdbId}`, {
        append_to_response: 'videos,credits'
      });
      if (tmdbMovie) {
        return res.status(200).json(formatTmdbMovie(tmdbMovie, tmdbMovie));
      }
    } catch (err) {
      console.warn('[TMDB Details] Fallback:', err.message);
    }
  }

  // Fast-path: When MongoDB is offline, use inMemoryStore immediately
  if (!isMongoConnected()) {
    const movie = inMemoryStore.getMovieById(id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    return res.status(200).json(movie);
  }

  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      // Check in-memory store in case it was created there or seeded
      const fallbackMovie = inMemoryStore.getMovieById(id);
      if (fallbackMovie) return res.status(200).json(fallbackMovie);
      return res.status(404).json({ message: 'Movie not found' });
    }
    return res.status(200).json(movie);
  } catch (error) {
    const movie = inMemoryStore.getMovieById(id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    return res.status(200).json(movie);
  }
};

// @desc    Add a new movie (Admin)
// @route   POST /api/movies
exports.addMovie = async (req, res) => {
  const {
    title,
    description,
    genre,
    duration,
    posterUrl,
    backdropUrl,
    trailerKey,
    releaseDate,
    ticketPrice,
    theater,
    rating,
    language,
    showtimes,
    director,
    cast,
    category
  } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Movie title is required' });
  }

  if (!isMongoConnected()) {
    const movie = inMemoryStore.createMovie(req.body);
    return res.status(201).json(movie);
  }

  try {
    const movie = await Movie.create({
      title,
      description,
      genre: Array.isArray(genre) ? genre : genre ? genre.split(',').map((g) => g.trim()) : ['Action'],
      duration: Number(duration) || 120,
      posterUrl,
      backdropUrl: backdropUrl || '',
      trailerKey: trailerKey || '',
      director: director || '',
      cast: Array.isArray(cast) ? cast : [],
      category: category || 'now_playing',
      releaseDate: releaseDate || Date.now(),
      ticketPrice: Number(ticketPrice) || 250,
      theater: theater || 'iMovies IMAX Laser - Screen 1',
      rating: Number(rating) || 8.5,
      language: language || 'English',
      showtimes:
        Array.isArray(showtimes) && showtimes.length > 0
          ? showtimes
          : ['10:30 AM', '02:00 PM', '06:30 PM', '09:45 PM'],
      countryAvailability: ['US', 'GB', 'IN', 'CA', 'AU', 'DE', 'JP', 'SG', 'AE']
    });

    return res.status(201).json(movie);
  } catch (error) {
    const movie = inMemoryStore.createMovie(req.body);
    return res.status(201).json(movie);
  }
};