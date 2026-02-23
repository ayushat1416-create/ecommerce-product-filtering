const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

/**
 * INDEXES (important for "optimized queries")
 * - price for range filter + sort
 * - category for category filter
 * - compound for category + price queries
 */
productSchema.index({ price: 1 });
productSchema.index({ category: 1 });
productSchema.index({ category: 1, price: 1 });

module.exports = mongoose.model("Product", productSchema);
