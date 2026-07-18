const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin.model');
const AppError = require('../utils/apiError');

/**
 * Protect routes — verifies JWT from Authorization header.
 * Attaches the admin document to req.admin.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Extract token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Not authorized — no token provided', 401));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find admin (include name and email, exclude password)
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return next(new AppError('Not authorized — admin not found', 401));
    }

    req.admin = admin;
    next();
  } catch (error) {
    return next(new AppError('Not authorized — invalid token', 401));
  }
};

module.exports = { protect };
