const Order = require('../../models/Order.model');
const Product = require('../../models/Product.model');
const AppError = require('../../utils/apiError');
const { sendSuccess, sendCreated } = require('../../utils/apiResponse');

// Helper to generate unique order number
const generateOrderNumber = async () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = Math.floor(1000 + Math.random() * 9000);
  let orderNumber = `ORD-${dateStr}-${randomStr}`;
  
  // Ensure uniqueness
  let exists = await Order.findOne({ orderNumber });
  while (exists) {
    const newRandom = Math.floor(1000 + Math.random() * 9000);
    orderNumber = `ORD-${dateStr}-${newRandom}`;
    exists = await Order.findOne({ orderNumber });
  }
  return orderNumber;
};

/**
 * @desc    Submit a new order
 * @route   POST /api/orders
 * @access  Public
 */
const createOrder = async (req, res, next) => {
  try {
    const { customerName, customerPhone, note, items } = req.body;

    if (!items || items.length === 0) {
      return next(new AppError('Order must contain at least one item', 400));
    }

    const orderItems = [];
    let totalPrice = 0;
    let totalItems = 0;

    // Process each item and validate stock/price
    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return next(new AppError(`Product not found: ${item.product}`, 404));
      }

      if (!product.isActive) {
        return next(new AppError(`Product is no longer available: ${product.nameAr}`, 400));
      }

      if (product.quantity < item.quantity) {
        return next(new AppError(`Insufficient stock for ${product.nameAr}. Only ${product.quantity} left.`, 400));
      }

      // Use DB price, not client provided price
      const activePrice = product.discountPrice ? product.discountPrice : product.price;
      const subtotal = activePrice * item.quantity;

      orderItems.push({
        product: product._id,
        productName: product.nameAr,
        productImage: product.images?.[0]?.url || '',
        color: item.color || product.color,
        price: activePrice,
        quantity: item.quantity,
        subtotal,
      });

      totalPrice += subtotal;
      totalItems += item.quantity;
      
      // Decrement stock
      product.quantity -= item.quantity;
      if (product.quantity <= 0) {
        product.isActive = false;
      }
      await product.save();
    }

    const orderNumber = await generateOrderNumber();

    const order = await Order.create({
      orderNumber,
      customerName,
      customerPhone,
      note,
      items: orderItems,
      totalItems,
      totalPrice,
      status: 'pending',
    });

    sendCreated(res, order, 'Order submitted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all orders (admin)
 * @route   GET /api/orders
 * @access  Private
 */
const getOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const query = Order.find(filter)
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    const [orders, totalItems] = await Promise.all([
      query.exec(),
      Order.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      message: 'Orders retrieved',
      data: {
        orders,
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
 * @desc    Get single order
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return next(new AppError('Order not found', 404));
    sendSuccess(res, order, 'Order retrieved');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order status
 * @route   PATCH /api/orders/:id/status
 * @access  Private
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return next(new AppError('Invalid status', 400));
    }

    const order = await Order.findById(req.params.id);
    if (!order) return next(new AppError('Order not found', 404));

    // Optional: Implement stock restoration if cancelled
    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { quantity: item.quantity },
          $set: { isActive: true } // Reactivate if it was out of stock
        });
      }
    }

    order.status = status;
    await order.save();

    sendSuccess(res, order, 'Order status updated');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete order
 * @route   DELETE /api/orders/:id
 * @access  Private
 */
const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return next(new AppError('Order not found', 404));
    sendSuccess(res, null, 'Order deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};
