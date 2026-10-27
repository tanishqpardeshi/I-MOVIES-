const express = require('express');
const router = express.Router();
const { getCinemas, getCinemaById, getCinemaShowtimes, detectLocation } = require('../controllers/cinemaController');

router.get('/', getCinemas);
router.get('/location/detect', detectLocation);
router.get('/:id', getCinemaById);
router.get('/:id/showtimes', getCinemaShowtimes);

module.exports = router;
