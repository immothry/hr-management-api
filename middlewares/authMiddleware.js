
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret_in_production';

// authMiddleware verifies token and attaches req.user (without password).

async function authMiddleware(req, res, next) {
  try {
    const header = req.header('Authorization');
    if (!header) {
      return res.status(401).json({ status: 'error', message: 'Authorization header missing' });
    }

    const parts = header.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ status: 'error', message: 'Authorization header must be: Bearer <token>' });
    }

    const token = parts[1];
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
    }

    const user = await User.findById(payload.id).select('-password');
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'User not found' });
    }
    if (user.isArchived) {
      return res.status(403).json({ status: 'error', message: 'User account is archived' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('authMiddleware error:', err);
    res.status(500).json({ status: 'error', message: 'Authentication failed' });
  }
}

// permitRoles(...roles) returns middleware that only allows users with roles in allowed list.
function permitRoles(...allowedRoles) {
  return (req, res, next) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ status: 'error', message: 'Not authenticated' });
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ status: 'error', message: 'Forbidden: insufficient role' });
      }
      next();
    } catch (err) {
      console.error('permitRoles error:', err);
      res.status(500).json({ status: 'error', message: 'Authorization failed' });
    }
  };
}

module.exports = { authMiddleware, permitRoles };