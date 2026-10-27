const express = require('express');
const router = express.Router();
const { getMovies, getMovieById, addMovie } = require('../controllers/movieController');
const {
  getMovieReviews,
  submitReview,
  deleteReview,
  likeReview
} = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getMovies);
router.get('/:id', getMovieById);
router.post('/', protect, admin, addMovie);

// Reviews & Ratings routes (verified booking required for submission)
router.get('/:id/reviews', getMovieReviews);
router.post('/:id/reviews', protect, submitReview);
router.delete('/:id/reviews', protect, deleteReview);
router.post('/:id/reviews/:reviewId/like', likeReview);

module.exports = router;