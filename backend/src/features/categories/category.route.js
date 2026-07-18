const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('./category.controller');
const { protect } = require('../../middleware/auth.middleware');

// Public routes (We attach protect conditionally inside controller for GET, or we can use a soft-auth middleware. 
// For now, let's just make GET public and pass req.admin if token exists).
// A better way: check token if it exists without rejecting.
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
  .get(optionalAuth, getCategories)
  .post(protect, createCategory);

router.route('/:id')
  .get(optionalAuth, getCategoryById)
  .put(protect, updateCategory)
  .delete(protect, deleteCategory);

module.exports = router;
