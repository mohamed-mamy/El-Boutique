const Brand = require('../../models/Brand.model');
const Product = require('../../models/Product.model');
const AppError = require('../../utils/apiError');
const { sendSuccess, sendCreated } = require('../../utils/apiResponse');
const { deleteImage } = require('../../utils/cloudinary');

/**
 * @desc    Create a brand
 * @route   POST /api/brands
 * @access  Private
 */
const createBrand = async (req, res, next) => {
  try {
    const brand = await Brand.create(req.body);
    sendCreated(res, brand, 'Brand created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all active brands (public) or all brands (admin)
 * @route   GET /api/brands
 * @access  Public / Private
 */
const getBrands = async (req, res, next) => {
  try {
    const filter = req.admin ? {} : { isActive: true };
    const brands = await Brand.find(filter).sort('-createdAt');
    sendSuccess(res, brands, 'Brands retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single brand
 * @route   GET /api/brands/:id
 * @access  Public
 */
const getBrandById = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return next(new AppError('Brand not found', 404));
    
    if (!req.admin && !brand.isActive) {
      return next(new AppError('Brand not found', 404));
    }
    
    sendSuccess(res, brand, 'Brand retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update brand
 * @route   PUT /api/brands/:id
 * @access  Private
 */
const updateBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!brand) return next(new AppError('Brand not found', 404));
    sendSuccess(res, brand, 'Brand updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete brand
 * @route   DELETE /api/brands/:id
 * @access  Private
 */
const deleteBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return next(new AppError('Brand not found', 404));

    // Check if brand has products
    const linkedProducts = await Product.countDocuments({ brand: brand._id });
    if (linkedProducts > 0) {
      return next(new AppError(`Cannot delete brand. ${linkedProducts} products are linked to it.`, 400));
    }



    await brand.deleteOne();
    sendSuccess(res, null, 'Brand deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
};
