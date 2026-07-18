const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth.middleware');
const { uploadSingle, uploadMultiple } = require('../../middleware/upload.middleware');
const {
  handleUploadSingle,
  handleUploadMultiple,
  handleDeleteImage,
} = require('./upload.controller');

// All upload routes require authentication
router.use(protect);

// POST /api/upload/single
router.post('/single', uploadSingle, handleUploadSingle);

// POST /api/upload/multiple
router.post('/multiple', uploadMultiple, handleUploadMultiple);

// DELETE /api/upload?publicId=xxx
router.delete('/', handleDeleteImage);

module.exports = router;
