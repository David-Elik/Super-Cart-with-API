/**
 * Cart Schema for MongoDB using Mongoose
 *
 * This schema defines the structure for a shopping cart in the database.
 * It includes fields for cart name, items, user ID, and timestamps for creation and last update.
 * The items are stored as an array of objects, each containing information about individual products.
 *
 * @type {mongoose.Schema}
 */
const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  items: [
    {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      prices: {
        type: Map,
        of: Number,
      },
      // Add any other product fields you need
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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

module.exports = mongoose.model("Cart", CartSchema);
