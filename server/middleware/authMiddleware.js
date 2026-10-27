const jwt = require('jsonwebtoken');

const getJwtSecret = () => process.env.JWT_SECRET || 'imovies_super_secret_jwt_key_that_is_at_least_32_characters_long';

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.toLowerCase().startsWith('bearer')) {
    try {
      const token = authHeader.replace(/^Bearer\s+/i, '').trim();
      const decoded = jwt.verify(token, getJwtSecret());
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Session expired or invalid token. Please sign in again.' });
    }
  } else {
    return res.status(401).json({ message: 'No authorization token provided' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied: Admin privileges required' });
  }
};

module.exports = { protect, admin, getJwtSecret };