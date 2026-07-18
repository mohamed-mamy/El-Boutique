const Product = require('../../models/Product.model');
const Category = require('../../models/Category.model');
const Brand = require('../../models/Brand.model');
const Order = require('../../models/Order.model');
const { sendSuccess } = require('../../utils/apiResponse');

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
const getStats = async (req, res, next) => {
  try {
    const [
      totalProducts,
      totalCategories,
      totalBrands,
      totalOrders,
      ordersByStatus,
      topViewedProducts,
    ] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Brand.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),
      Product.find()
        .sort('-viewCount')
        .limit(5)
        .select('nameAr nameFr images viewCount price'),
    ]);

    // Format ordersByStatus into a simpler object
    const formattedOrderStatus = {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };
    ordersByStatus.forEach((stat) => {
      formattedOrderStatus[stat._id] = stat.count;
    });

    sendSuccess(res, {
      totalProducts,
      totalCategories,
      totalBrands,
      totalOrders,
      ordersByStatus: formattedOrderStatus,
      topViewedProducts,
    }, 'Dashboard stats retrieved');
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats };
