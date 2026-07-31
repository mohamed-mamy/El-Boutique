const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
  {
    nameAr: {
      type: String,
      trim: true,
      default: '',
    },
    nameFr: {
      type: String,
      trim: true,
      default: '',
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Brand = mongoose.model('Brand', brandSchema);
module.exports = Brand;
