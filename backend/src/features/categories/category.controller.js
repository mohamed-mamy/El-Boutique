const Category = require('../../models/Category.model');
const Product = require('../../models/Product.model');
const AppError = require('../../utils/apiError');
const { sendSuccess, sendCreated } = require('../../utils/apiResponse');
const { deleteImage } = require('../../utils/cloudinary');

/**
 * @desc    Create a category
 * @route   POST /api/categories
 * @access  Private
 */
const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    sendCreated(res, category, 'Category created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all active categories (public) or all categories (admin)
 * @route   GET /api/categories
 * @access  Public / Private
 */
const getCategories = async (req, res, next) => {
  try {
    // If not authenticated, only show active categories
    const filter = req.admin ? {} : { isActive: true };
    const categories = await Category.find(filter).sort('-createdAt');
    sendSuccess(res, categories, 'Categories retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single category
 * @route   GET /api/categories/:id
 * @access  Public
 */
const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return next(new AppError('Category not found', 404));
    
    // Hide inactive category for public
    if (!req.admin && !category.isActive) {
      return next(new AppError('Category not found', 404));
    }
    
    sendSuccess(res, category, 'Category retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private
 */
const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) return next(new AppError('Category not found', 404));
    sendSuccess(res, category, 'Category updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private
 */
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return next(new AppError('Category not found', 404));

    // Check if category has products
    const linkedProducts = await Product.countDocuments({ category: category._id });
    if (linkedProducts > 0) {
      return next(new AppError(`Cannot delete category. ${linkedProducts} products are linked to it.`, 400));
    }



    await category.deleteOne();
    sendSuccess(res, null, 'Category deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
