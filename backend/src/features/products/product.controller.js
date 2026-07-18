const Product = require('../../models/Product.model');
const AppError = require('../../utils/apiError');
const { sendSuccess, sendCreated } = require('../../utils/apiResponse');
const { deleteImage } = require('../../utils/cloudinary');

/**
 * @desc    Create a product
 * @route   POST /api/products
 * @access  Private
 */
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    sendCreated(res, product, 'Product created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all products (with filtering, sorting, pagination)
 * @route   GET /api/products
 * @access  Public / Private
 */
const getProducts = async (req, res, next) => {
  try {
    const { 
      category, 
      brand, 
      color, 
      priceMin, 
      priceMax, 
      search, 
      featured, 
      page = 1, 
      limit = 10,
      sort = '-createdAt'
    } = req.query;

    const filter = {};

    // If not authenticated, hide inactive and out of stock
    if (!req.admin) {
      filter.isActive = true;
      filter.quantity = { $gt: 0 };
    }

    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (color) filter.color = { $regex: new RegExp(`^${color}$`, 'i') };
    if (featured === 'true') filter.isFeatured = true;

    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = Number(priceMin);
      if (priceMax) filter.price.$lte = Number(priceMax);
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const query = Product.find(filter)
      .populate('category', 'nameAr nameFr isActive')
      .populate('brand', 'nameAr nameFr isActive')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const [products, totalItems] = await Promise.all([
      query.exec(),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      message: 'Products retrieved',
      data: {
        products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(totalItems / Number(limit)),
          totalItems,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'nameAr nameFr isActive')
      .populate('brand', 'nameAr nameFr isActive');

    if (!product) return next(new AppError('Product not found', 404));

    if (!req.admin && (!product.isActive || product.quantity <= 0)) {
      return next(new AppError('Product not found', 404));
    }

    // Fetch similar products in the same category
    const similarProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      isActive: true,
      quantity: { $gt: 0 },
    })
    .limit(4)
    .populate('category', 'nameAr nameFr')
    .populate('brand', 'nameAr nameFr');

    res.status(200).json({
      success: true,
      message: 'Product retrieved',
      data: {
        product,
        similarProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private
 */
const updateProduct = async (req, res, next) => {
  try {
    // Check quantity to auto-toggle isActive
    const updateData = { ...req.body };
    if (updateData.quantity !== undefined && updateData.quantity <= 0) {
      updateData.isActive = false;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) return next(new AppError('Product not found', 404));
    sendSuccess(res, product, 'Product updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private
 */
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new AppError('Product not found', 404));

    // Delete all images from cloudinary
    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map((img) => deleteImage(img.publicId));
      await Promise.allSettled(deletePromises);
    }

    await product.deleteOne();
    sendSuccess(res, null, 'Product deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Increment view count
 * @route   PATCH /api/products/:id/view
 * @access  Public
 */
const incrementViewCount = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true }
    );
    if (!product) return next(new AppError('Product not found', 404));
    sendSuccess(res, { viewCount: product.viewCount }, 'View count incremented');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  incrementViewCount,
};
