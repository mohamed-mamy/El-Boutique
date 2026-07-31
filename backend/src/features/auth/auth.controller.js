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
    const { phone, password } = req.body;

    // Validate input
    if (!phone || !password) {
      return next(new AppError('Please provide phone and password', 400));
    }

    // Find admin with password (select: false by default)
    const admin = await Admin.findOne({ phone }).select('+password');

    if (!admin) {
      return next(new AppError('Invalid phone or password', 401));
    }

    // Check password
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return next(new AppError('Invalid phone or password', 401));
    }

    // Generate token
    const token = generateToken(admin._id);

    sendSuccess(res, {
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        phone: admin.phone,
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
        phone: req.admin.phone,
      },
    }, 'Admin profile retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update admin credentials (phone & password)
 * @route   PUT /api/auth/credentials
 * @access  Private
 */
const updateCredentials = async (req, res, next) => {
  try {
    const { currentPassword, phone, newPassword } = req.body;

    if (!currentPassword) {
      return next(new AppError('Current password is required', 400));
    }

    const admin = await Admin.findById(req.admin._id).select('+password');
    const isMatch = await admin.comparePassword(currentPassword);

    if (!isMatch) {
      return next(new AppError('Current password is incorrect', 400));
    }

    if (phone) admin.phone = phone;
    if (newPassword) admin.password = newPassword;

    await admin.save();

    sendSuccess(res, {
      admin: {
        id: admin._id,
        name: admin.name,
        phone: admin.phone,
      },
    }, 'Credentials updated successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { login, getMe, updateCredentials };
