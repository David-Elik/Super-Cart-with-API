/**
 * Product Schema for MongoDB using Mongoose
 * 
 * This schema defines the structure for a product in the database.
 * It includes fields such as product ID, name, description, category, prices, and additional metadata such as popularity and ratings.
 * The prices are stored as a map of supermarket names to prices, allowing flexibility for multiple price sources.
 * 
 * @type {mongoose.Schema}
 */
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  imageUrl: {
    type: String,
    default: "/placeholder.jpg",
  },
  prices: {
    // Store prices from different supermarkets
    type: Map,
    of: Number,
    required: true,
  },
  unit: {
    type: String,
    default: "unit", // 'kg', 'gram', 'liter', etc.
  },
  popularity: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  ratingCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add text index for search functionality
ProductSchema.index({ name: "text", description: "text", category: "text" });

module.exports = mongoose.model("Product", ProductSchema);
