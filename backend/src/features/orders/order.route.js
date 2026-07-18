const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = require('./order.controller');
const { protect } = require('../../middleware/auth.middleware');

router.route('/')
  .post(createOrder) // Public
  .get(protect, getOrders); // Admin only

router.route('/:id')
  .get(protect, getOrderById)
  .delete(protect, deleteOrder);

router.route('/:id/status')
  .patch(protect, updateOrderStatus);

module.exports = router;
