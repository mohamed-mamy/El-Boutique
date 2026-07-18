const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('./settings.controller');
const { protect } = require('../../middleware/auth.middleware');

router.route('/')
  .get(getSettings)
  .put(protect, updateSettings);

module.exports = router;
