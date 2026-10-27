const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const inMemoryStore = require('../config/inMemoryStore');

const getJwtSecret = () => process.env.JWT_SECRET || 'imovies_super_secret_jwt_key_that_is_at_least_32_characters_long';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, username: user.username, email: user.email },
    getJwtSecret(),
    { expiresIn: '7d' }
  );
};

// Rate limiting in-memory store for login attempts (IP / Email)
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 2 * 60 * 1000; // 2 minutes

const checkRateLimit = (key) => {
  const record = loginAttempts.get(key);
  if (!record) return null;
  if (record.lockUntil && record.lockUntil > Date.now()) {
    const remainingSec = Math.ceil((record.lockUntil - Date.now()) / 1000);
    return `Too many failed login attempts. Account temporarily locked for ${remainingSec} seconds.`;
  }
  if (record.lockUntil && record.lockUntil <= Date.now()) {
    loginAttempts.delete(key);
  }
  return null;
};

const recordFailedAttempt = (key) => {
  const record = loginAttempts.get(key) || { count: 0, lockUntil: 0 };
  record.count += 1;
  if (record.count >= MAX_ATTEMPTS) {
    record.lockUntil = Date.now() + LOCKOUT_MS;
  }
  loginAttempts.set(key, record);
};

const clearRateLimit = (key) => {
  loginAttempts.delete(key);
};

// Email validation helper
const isValidEmail = (email) => {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

// @desc    Register a new user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, preferredCountry, preferredCity } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide username, email, and password' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    let userExists = null;
    let usingFallback = false;

    try {
      userExists = await User.findOne({ email: email.toLowerCase().trim() });
    } catch (err) {
      usingFallback = true;
      userExists = inMemoryStore.findUserByEmail(email.trim());
    }

    if (userExists) {
      return res.status(400).json({ message: 'An account with this email already exists. Please sign in.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user;
    if (!usingFallback) {
      try {
        user = await User.create({
          username: username.trim(),
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          role: 'user',
          preferredCountry: preferredCountry || 'US',
          preferredCity: preferredCity || 'New York'
        });
      } catch (err) {
        user = inMemoryStore.createUser({
          username: username.trim(),
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          role: 'user',
          preferredCountry: preferredCountry || 'US',
          preferredCity: preferredCity || 'New York'
        });
      }
    } else {
      user = inMemoryStore.createUser({
        username: username.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: 'user',
        preferredCountry: preferredCountry || 'US',
        preferredCity: preferredCity || 'New York'
      });
    }

    return res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      preferredCountry: user.preferredCountry || 'US',
      preferredCity: user.preferredCity || 'New York',
      token: generateToken(user)
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const trimmedEmail = email.toLowerCase().trim();
    const rateLimitKey = `${req.ip || 'ip'}_${trimmedEmail}`;

    const lockMessage = checkRateLimit(rateLimitKey);
    if (lockMessage) {
      return res.status(429).json({ message: lockMessage });
    }

    let user = null;
    try {
      user = await User.findOne({ email: trimmedEmail });
    } catch (err) {
      user = inMemoryStore.findUserByEmail(trimmedEmail);
    }

    // Also check in-memory store if not found in db
    if (!user) {
      user = inMemoryStore.findUserByEmail(trimmedEmail);
    }

    if (!user) {
      recordFailedAttempt(rateLimitKey);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      recordFailedAttempt(rateLimitKey);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    clearRateLimit(rateLimitKey);

    return res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      preferredCountry: user.preferredCountry || 'US',
      preferredCity: user.preferredCity || 'New York',
      token: generateToken(user)
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// @desc    Initiate password reset (generates token & simulated link)
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: 'Please provide a valid registered email address' });
    }

    const trimmedEmail = email.toLowerCase().trim();
    let user = null;
    try {
      user = await User.findOne({ email: trimmedEmail });
    } catch (e) {
      user = inMemoryStore.findUserByEmail(trimmedEmail);
    }
    if (!user) {
      user = inMemoryStore.findUserByEmail(trimmedEmail);
    }

    // For privacy, if user not found, respond with generic success message
    if (!user) {
      return res.status(200).json({
        message: 'If an account with that email exists, password reset instructions have been generated.',
        simulated: true
      });
    }

    const resetToken = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    try {
      if (user.save) {
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = expiresAt;
        await user.save();
      } else {
        inMemoryStore.setResetToken(trimmedEmail, resetToken, expiresAt);
      }
    } catch {
      inMemoryStore.setResetToken(trimmedEmail, resetToken, expiresAt);
    }

    return res.status(200).json({
      message: 'Password reset link generated successfully.',
      resetToken,
      expiresIn: '1 hour',
      simulatedNotice: 'In this preview environment, use the reset token directly to set your new password.'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to process password reset request', error: error.message });
  }
};

// @desc    Reset password using valid reset token
// @route   POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken) {
      return res.status(400).json({ message: 'Reset token is required' });
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    let user = null;
    const now = new Date();

    try {
      user = await User.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpires: { $gt: now }
      });
    } catch (e) {
      user = inMemoryStore.findUserByResetToken(resetToken);
    }

    if (!user) {
      user = inMemoryStore.findUserByResetToken(resetToken);
    }

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    if (user.save) {
      user.password = hashedPassword;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();
    } else {
      inMemoryStore.resetPasswordWithToken(resetToken, hashedPassword);
    }

    return res.status(200).json({ message: 'Password has been updated successfully. You can now sign in.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to reset password', error: error.message });
  }
};

// @desc    One-Click Google Authentication
// @route   POST /api/auth/google
exports.googleAuth = async (req, res) => {
  try {
    const { email, name, googleId } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Google account email is required' });
    }

    const trimmedEmail = email.toLowerCase().trim();
    const displayName = name ? name.trim() : trimmedEmail.split('@')[0];

    let user = null;
    try {
      user = await User.findOne({ email: trimmedEmail });
    } catch (e) {
      user = inMemoryStore.findUserByEmail(trimmedEmail);
    }
    if (!user) {
      user = inMemoryStore.findUserByEmail(trimmedEmail);
    }

    if (!user) {
      // Create user with a generated secure password
      const randomPassword = crypto.randomBytes(16).toString('hex');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      try {
        user = await User.create({
          username: displayName,
          email: trimmedEmail,
          password: hashedPassword,
          role: 'user',
          preferredCountry: 'US',
          preferredCity: 'New York'
        });
      } catch (err) {
        user = inMemoryStore.createUser({
          username: displayName,
          email: trimmedEmail,
          password: hashedPassword,
          role: 'user',
          preferredCountry: 'US',
          preferredCity: 'New York'
        });
      }
    }

    return res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      preferredCountry: user.preferredCountry || 'US',
      preferredCity: user.preferredCity || 'New York',
      token: generateToken(user)
    });
  } catch (error) {
    return res.status(500).json({ message: 'Google authentication failed', error: error.message });
  }
};

// @desc    Update user location preference
// @route   PUT /api/auth/location
exports.updateLocation = async (req, res) => {
  try {
    const { country, city } = req.body;
    if (!country || !city) {
      return res.status(400).json({ message: 'Country and city are required' });
    }

    let user = null;
    try {
      user = await User.findById(req.user.id);
      if (user) {
        user.preferredCountry = country;
        user.preferredCity = city;
        await user.save();
      }
    } catch (e) {
      // fallback
    }

    const memUser = inMemoryStore.updateUser(req.user.id, {
      preferredCountry: country,
      preferredCity: city
    });

    return res.status(200).json({
      preferredCountry: country,
      preferredCity: city,
      message: 'Location preference saved'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update location preference', error: error.message });
  }
};

// @desc    Get user profile & booking stats
// @route   GET /api/auth/profile
exports.getProfile = async (req, res) => {
  try {
    let user = null;
    try {
      user = await User.findById(req.user.id).select('-password');
    } catch (e) {
      // Ignored
    }
    if (!user) {
      user = inMemoryStore.findUserById(req.user.id);
    }
    if (!user && req.user.email) {
      user = inMemoryStore.findUserByEmail(req.user.email);
    }
    if (!user && req.user.id) {
      user = {
        _id: req.user.id,
        username: req.user.username || (req.user.email ? req.user.email.split('@')[0] : 'Member'),
        email: req.user.email || 'user@imovies.com',
        role: req.user.role || 'user',
        preferredCountry: 'US',
        preferredCity: 'New York',
        preferredCinema: '',
        favorites: []
      };
      inMemoryStore.users.push(user);
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const bookings = inMemoryStore.getUserBookings(req.user.id);
    return res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      preferredCountry: user.preferredCountry || 'US',
      preferredCity: user.preferredCity || 'New York',
      preferredCinema: user.preferredCinema || '',
      totalBookings: bookings.length,
      favorites: user.favorites || []
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to retrieve profile', error: error.message });
  }
};

// @desc    Update user profile & account settings
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, email, phone, preferredCountry, preferredCity, preferredCinema, currentPassword, newPassword } = req.body;

    let user = null;
    let isMongo = false;
    try {
      user = await User.findById(req.user.id);
      if (user) isMongo = true;
    } catch (e) {
      // fallback
    }
    if (!user) {
      user = inMemoryStore.findUserById(req.user.id);
    }
    if (!user && req.user.email) {
      user = inMemoryStore.findUserByEmail(req.user.email);
    }
    if (!user && req.user.id) {
      user = {
        _id: req.user.id,
        username: req.user.username || (req.user.email ? req.user.email.split('@')[0] : 'Member'),
        email: req.user.email || 'user@imovies.com',
        role: req.user.role || 'user',
        preferredCountry: 'US',
        preferredCity: 'New York',
        preferredCinema: '',
        favorites: []
      };
      inMemoryStore.users.push(user);
    }
    if (!user) {
      return res.status(404).json({ message: 'User account not found' });
    }

    if (email && email.toLowerCase().trim() !== user.email.toLowerCase()) {
      if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Please provide a valid email address' });
      }
      let existingWithEmail = null;
      try {
        existingWithEmail = await User.findOne({ email: email.toLowerCase().trim() });
      } catch (e) {
        existingWithEmail = inMemoryStore.findUserByEmail(email.trim());
      }
      if (existingWithEmail && String(existingWithEmail._id) !== String(user._id)) {
        return res.status(400).json({ message: 'An account with this email address already exists' });
      }
      user.email = email.toLowerCase().trim();
    }

    if (username && username.trim()) {
      user.username = username.trim();
    }

    if (phone !== undefined) {
      user.phone = String(phone).trim();
    }

    if (preferredCountry) {
      user.preferredCountry = preferredCountry;
    }

    if (preferredCity) {
      user.preferredCity = preferredCity;
    }

    if (preferredCinema) {
      user.preferredCinema = preferredCinema;
    }

    if (newPassword) {
      if (typeof newPassword !== 'string' || newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters long' });
      }
      if (!currentPassword) {
        return res.status(400).json({ message: 'Please provide your current password to update password' });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password does not match' });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (isMongo) {
      await user.save();
    }

    inMemoryStore.updateUser(req.user.id, {
      username: user.username,
      email: user.email,
      phone: user.phone,
      preferredCountry: user.preferredCountry,
      preferredCity: user.preferredCity,
      preferredCinema: user.preferredCinema,
      password: user.password
    });

    const updatedUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      preferredCountry: user.preferredCountry || 'US',
      preferredCity: user.preferredCity || 'New York',
      preferredCinema: user.preferredCinema || ''
    };

    const token = generateToken(updatedUser);

    return res.status(200).json({
      message: 'Account details successfully updated',
      user: updatedUser,
      token
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update account details', error: error.message });
  }
};

// @desc    Toggle movie in user's favorites
// @route   POST /api/auth/favorites/:movieId
exports.toggleFavorite = async (req, res) => {
  try {
    const { movieId } = req.params;
    const favorites = inMemoryStore.toggleFavorite(req.user.id, movieId);
    return res.status(200).json({ favorites });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to toggle favorite', error: error.message });
  }
};