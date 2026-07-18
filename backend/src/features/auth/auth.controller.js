const jwt = require('jsonwebtoken');
const Admin = require('../../models/Admin.model');
const AppError = require('../../utils/apiError');
const { sendSuccess } = require('../../utils/apiResponse');

/**
 * Generate JWT token for an admin.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * @desc    Login admin
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    // Find admin with password (select: false by default)
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Check password
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Generate token
    const token = generateToken(admin._id);

    sendSuccess(res, {
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current admin profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    sendSuccess(res, {
      admin: {
        id: req.admin._id,
        name: req.admin.name,
        email: req.admin.email,
      },
    }, 'Admin profile retrieved');
  } catch (error) {
    next(error);
  }
};

module.exports = { login, getMe };
