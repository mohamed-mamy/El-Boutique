const express = require('express');
const router = express.Router();
const { login, getMe } = require('./auth.controller');
const { protect } = require('../../middleware/auth.middleware');

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/me (protected)
router.get('/me', protect, getMe);

module.exports = router;
