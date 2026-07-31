const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
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

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
