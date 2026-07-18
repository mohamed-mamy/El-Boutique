const express = require('express');
const router = express.Router();
const {
  createBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
} = require('./brand.controller');
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
  .get(optionalAuth, getBrands)
  .post(protect, createBrand);

router.route('/:id')
  .get(optionalAuth, getBrandById)
  .put(protect, updateBrand)
  .delete(protect, deleteBrand);

module.exports = router;
