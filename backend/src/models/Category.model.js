const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
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

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
