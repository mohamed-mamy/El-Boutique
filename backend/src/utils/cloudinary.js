const cloudinary = require('../config/cloudinary');

/**
 * Upload an image buffer to Cloudinary.
 * @param {Buffer} buffer — The file buffer
 * @param {string} folder — Cloudinary folder path (e.g., 'el-boutique/products')
 * @returns {Promise<{ url: string, publicId: string }>}
 */
const uploadImage = (buffer, folder = 'el-boutique') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    // Pipe the buffer into the upload stream
    const { Readable } = require('stream');
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

/**
 * Delete an image from Cloudinary by its public ID.
 * @param {string} publicId
 * @returns {Promise<object>}
 */
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error.message);
    throw error;
  }
};

module.exports = { uploadImage, deleteImage };
