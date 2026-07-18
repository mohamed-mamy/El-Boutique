const { uploadImage, deleteImage } = require('../../utils/cloudinary');
const AppError = require('../../utils/apiError');
const { sendSuccess } = require('../../utils/apiResponse');

/**
 * @desc    Upload a single image
 * @route   POST /api/upload/single
 * @access  Private
 */
const handleUploadSingle = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('No image file provided', 400));
    }

    const folder = req.body.folder || 'el-boutique/general';
    const result = await uploadImage(req.file.buffer, folder);

    sendSuccess(res, result, 'Image uploaded successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload multiple images (up to 5)
 * @route   POST /api/upload/multiple
 * @access  Private
 */
const handleUploadMultiple = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next(new AppError('No image files provided', 400));
    }

    const folder = req.body.folder || 'el-boutique/general';
    const uploadPromises = req.files.map((file) => uploadImage(file.buffer, folder));
    const results = await Promise.all(uploadPromises);

    sendSuccess(res, results, `${results.length} image(s) uploaded successfully`);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an image from Cloudinary
 * @route   DELETE /api/upload
 * @access  Private
 */
const handleDeleteImage = async (req, res, next) => {
  try {
    const publicId = req.query.publicId;

    if (!publicId) {
      return next(new AppError('No publicId provided', 400));
    }

    await deleteImage(publicId);

    sendSuccess(res, null, 'Image deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { handleUploadSingle, handleUploadMultiple, handleDeleteImage };
