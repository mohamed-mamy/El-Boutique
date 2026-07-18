const Settings = require('../../models/Settings.model');
const { sendSuccess } = require('../../utils/apiResponse');

/**
 * @desc    Get store settings
 * @route   GET /api/settings
 * @access  Public
 */
const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Return defaults if none exist
      settings = await Settings.create({});
    }
    sendSuccess(res, settings, 'Settings retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update store settings
 * @route   PUT /api/settings
 * @access  Private
 */
const updateSettings = async (req, res, next) => {
  try {
    // Upsert ensures we only have one document
    const settings = await Settings.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true, runValidators: true }
    );
    sendSuccess(res, settings, 'Settings updated successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
