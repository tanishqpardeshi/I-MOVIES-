const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const inMemoryStore = require('../config/inMemoryStore');

// Helper to extract user ID from optional Bearer token
const getOptionalUserId = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded.id || null;
    } catch {
      return null;
    }
  }
  return null;
};

// @desc    Get all reviews and stats for a movie
// @route   GET /api/movies/:id/reviews
exports.getMovieReviews = async (req, res) => {
  try {
    const movieId = req.params.id;
    const currentUserId = getOptionalUserId(req);

    let reviews = [];
    let usingFallback = false;

    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(movieId)) {
      try {
        reviews = await Review.find({ movie: movieId })
          .populate('user', 'username email')
          .sort({ createdAt: -1 })
          .lean();
      } catch (err) {
        usingFallback = true;
      }
    } else {
      usingFallback = true;
    }

    if (usingFallback || reviews.length === 0) {
      // Use in-memory store
      const storeData = inMemoryStore.getMovieReviews(movieId, currentUserId);
      return res.status(200).json(storeData);
    }

    // Calculate stats from Mongo records
    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
    const averageRating = total > 0 ? parseFloat((sum / total).toFixed(1)) : 0;

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = Math.round(Number(r.rating));
      if (distribution[star] !== undefined) {
        distribution[star] += 1;
      }
    });

    let hasBooked = false;
    let userReview = null;

    if (currentUserId) {
      const uStr = String(currentUserId);
      userReview = reviews.find(
        (r) => (r.user && (r.user._id === currentUserId || String(r.user._id) === uStr)) || String(r.user) === uStr
      ) || null;

      // Check booking in Mongo
      try {
        const booking = await Booking.findOne({
          user: currentUserId,
          movie: movieId,
          status: { $ne: 'cancelled' }
        });
        hasBooked = !!booking;
      } catch {
        hasBooked = false;
      }

      // Check fallback store if not found
      if (!hasBooked) {
        hasBooked = inMemoryStore.hasUserBookedMovie(currentUserId, movieId);
      }
    }

    return res.status(200).json({
      reviews,
      stats: {
        totalReviews: total,
        averageRating,
        ratingDistribution: distribution
      },
      hasBooked,
      userReview,
      canReview: hasBooked
    });
  } catch (error) {
    console.error('Error fetching movie reviews:', error);
    return res.status(500).json({ message: 'Failed to retrieve reviews', error: error.message });
  }
};

// @desc    Submit or update 1-5 star review for previously booked movie
// @route   POST /api/movies/:id/reviews
exports.submitReview = async (req, res) => {
  try {
    const movieId = req.params.id;
    const userId = req.user.id;
    const username = req.user.username || 'Verified Viewer';
    const { rating, comment } = req.body;

    const numRating = Number(rating);
    if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ message: 'Rating must be an integer between 1 and 5 stars' });
    }

    if (!comment || typeof comment !== 'string' || comment.trim().length < 3) {
      return res.status(400).json({ message: 'Please share a comment of at least 3 characters' });
    }

    if (comment.trim().length > 1000) {
      return res.status(400).json({ message: 'Review comment cannot exceed 1000 characters' });
    }

    // 1. Enforce verified booking requirement
    let hasBooked = false;

    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(movieId) && mongoose.isValidObjectId(userId)) {
      try {
        const existingBooking = await Booking.findOne({
          user: userId,
          movie: movieId,
          status: { $ne: 'cancelled' }
        });
        if (existingBooking) {
          hasBooked = true;
        }
      } catch (err) {
        // Fall back to inMemoryStore check
      }
    }

    if (!hasBooked) {
      hasBooked = inMemoryStore.hasUserBookedMovie(userId, movieId);
    }

    if (!hasBooked) {
      return res.status(403).json({
        message: 'You can only review movies you have previously booked. Please book a ticket first to share your rating.'
      });
    }

    // 2. Persist in inMemoryStore
    let savedReview;
    try {
      savedReview = inMemoryStore.addOrUpdateReview({
        userId,
        movieId,
        rating: numRating,
        comment: comment.trim(),
        username
      });
    } catch (storeErr) {
      return res.status(400).json({ message: storeErr.message });
    }

    // 3. Persist in MongoDB if available
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(movieId) && mongoose.isValidObjectId(userId)) {
      try {
        await Review.findOneAndUpdate(
          { movie: movieId, user: userId },
          {
            rating: numRating,
            comment: comment.trim(),
            username,
            isVerifiedBooking: true
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      } catch (mongoErr) {
        console.warn('Mongo review upsert skipped/failed:', mongoErr.message);
      }
    }

    const updatedData = inMemoryStore.getMovieReviews(movieId, userId);

    return res.status(200).json({
      message: 'Your review has been successfully submitted!',
      review: savedReview,
      stats: updatedData.stats
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    return res.status(500).json({ message: 'Failed to submit review', error: error.message });
  }
};

// @desc    Delete user's review for a movie
// @route   DELETE /api/movies/:id/reviews
exports.deleteReview = async (req, res) => {
  try {
    const movieId = req.params.id;
    const userId = req.user.id;

    inMemoryStore.deleteReview(userId, movieId);

    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(movieId) && mongoose.isValidObjectId(userId)) {
      try {
        await Review.findOneAndDelete({ movie: movieId, user: userId });
      } catch {
        // Silent fallback
      }
    }

    return res.status(200).json({ message: 'Review removed successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete review', error: error.message });
  }
};

// @desc    Like a review (upvote helpfulness)
// @route   POST /api/movies/:id/reviews/:reviewId/like
exports.likeReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const likes = inMemoryStore.likeReview(reviewId);

    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(reviewId)) {
      try {
        await Review.findByIdAndUpdate(reviewId, { $inc: { likes: 1 } });
      } catch {
        // Silent fallback
      }
    }

    return res.status(200).json({ likes });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to like review', error: error.message });
  }
};
