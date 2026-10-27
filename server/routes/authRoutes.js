const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  googleAuth,
  updateLocation,
  getProfile,
  updateProfile,
  toggleFavorite
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/google', googleAuth);
router.put('/location', protect, updateLocation);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/favorites/:movieId', protect, toggleFavorite);

module.exports = router;