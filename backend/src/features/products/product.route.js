const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  incrementViewCount,
} = require('./product.controller');
const { protect } = require('../../middleware/auth.middleware');

const optionalAuth = (req, res, next) => {
  const jwt = require('jsonwebtoken');
  const Admin = require('../../models/Admin.model');
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      Admin.findById(decoded.id).then(admin => {
        req.admin = admin;
        next();
      }).catch(() => next());
    } catch {
      next();
    }
  } else {
    next();
  }
};

router.route('/')
  .get(optionalAuth, getProducts)
  .post(protect, createProduct);

router.route('/:id')
  .get(optionalAuth, getProductById)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

router.route('/:id/view')
  .patch(incrementViewCount);

module.exports = router;
