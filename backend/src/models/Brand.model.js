const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
  {
    nameAr: {
      type: String,
      required: [true, 'Arabic name is required'],
      unique: true,
      trim: true,
    },
    nameFr: {
      type: String,
      required: [true, 'French name is required'],
      unique: true,
      trim: true,
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
