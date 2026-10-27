const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getOccupiedSeats,
  holdSeats,
  releaseSeats,
  cancelBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.get('/occupied', getOccupiedSeats);
router.post('/hold', protect, holdSeats);
router.post('/release', protect, releaseSeats);
router.post('/:id/cancel', protect, cancelBooking);
router.post('/', protect, createBooking);
router.get('/', protect, getUserBookings);
router.get('/user', protect, getUserBookings);

module.exports = router;