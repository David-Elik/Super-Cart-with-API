/**
 * Cart Routes - Express Router
 *
 * This module handles all the cart-related API routes such as getting all carts,
 * retrieving a specific cart by ID, creating, updating, and deleting carts.
 * It includes authentication middleware to ensure that only authenticated users can access or modify their own carts.
 *
 * @module CartRoutes
 */

const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const jwt = require("jsonwebtoken");

/**
 * Auth Middleware for Cart Routes
 *
 * This middleware ensures that all cart-related routes are protected.
 * It verifies the presence and validity of the authentication token provided in the request header.
 * If the token is invalid or missing, it returns a 401 Unauthorized error.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
const authMiddleware = (req, res, next) => {
  const token = req.header("x-auth-token");

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: "אין הרשאה, נדרש טוקן" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "טוקן לא תקין" });
  }
};

// Apply auth middleware to all cart routes
router.use(authMiddleware);

/**
 * GET /api/cart
 * Get all saved carts for the current user.
 * The carts are sorted by the creation date, with the most recent ones appearing first.
 *
 * @returns {object[]} Array of cart objects
 * @throws {500} If server encounters an error while fetching the carts
 */
router.get("/", async (req, res) => {
  try {
    const carts = await Cart.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });
    res.json(carts);
  } catch (error) {
    console.error("Error fetching carts:", error);
    res.status(500).json({ message: "שגיאת שרת בטעינת העגלות" });
  }
});

/**
 * GET /api/cart/:id
 * Get a specific cart by ID.
 * This route checks if the cart belongs to the current authenticated user.
 *
 * @param {string} req.params.id - The cart ID
 * @returns {object} The cart object
 * @throws {404} If the cart is not found
 * @throws {403} If the cart does not belong to the current user
 * @throws {500} If server encounters an error while fetching the cart
 */
router.get("/:id", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);

    if (!cart) {
      return res.status(404).json({ message: "העגלה לא נמצאה" });
    }

    // Check if the cart belongs to the current user
    if (cart.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "אין הרשאה לצפות בעגלה זו" });
    }

    res.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "שגיאת שרת בטעינת העגלה" });
  }
});

/**
 * POST /api/cart
 * Create a new saved cart for the current user.
 * The request body should include the cart items and optional name.
 *
 * @param {string} req.body.name - The name of the cart (optional)
 * @param {Array} req.body.items - List of items in the cart
 * @returns {object} The created cart object
 * @throws {400} If the cart items are empty or not provided
 * @throws {500} If server encounters an error while saving the cart
 */
router.post("/", async (req, res) => {
  try {
    const { name, items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "העגלה ריקה, לא ניתן לשמור" });
    }

    const newCart = new Cart({
      name: name || `עגלה ${Date.now()}`,
      items,
      userId: req.user.userId,
    });

    const savedCart = await newCart.save();
    res.status(201).json(savedCart);
  } catch (error) {
    console.error("Error saving cart:", error);
    res.status(500).json({ message: "שגיאת שרת בשמירת העגלה" });
  }
});

/**
 * PUT /api/cart/:id
 * Update an existing cart for the current user.
 * The request body should include the cart items and optional name.
 *
 * @param {string} req.params.id - The cart ID
 * @param {string} req.body.name - The name of the cart (optional)
 * @param {Array} req.body.items - List of items in the cart
 * @returns {object} The updated cart object
 * @throws {400} If the cart items are empty or not provided
 * @throws {404} If the cart does not exist
 * @throws {403} If the cart does not belong to the current user
 * @throws {500} If server encounters an error while updating the cart
 */
router.put("/:id", async (req, res) => {
  try {
    const { name, items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: "נתוני עגלה לא תקינים" });
    }

    const cart = await Cart.findById(req.params.id);

    if (!cart) {
      return res.status(404).json({ message: "העגלה לא נמצאה" });
    }

    // Check if the cart belongs to the current user
    if (cart.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "אין הרשאה לעדכן עגלה זו" });
    }

    cart.name = name || cart.name;
    cart.items = items;
    cart.updatedAt = Date.now();

    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "שגיאת שרת בעדכון העגלה" });
  }
});

/**
 * DELETE /api/cart/:id
 * Delete a specific cart by ID for the current user.
 *
 * @param {string} req.params.id - The cart ID
 * @returns {object} Success message indicating that the cart has been deleted
 * @throws {404} If the cart does not exist
 * @throws {403} If the cart does not belong to the current user
 * @throws {500} If server encounters an error while deleting the cart
 */
router.delete("/:id", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);

    if (!cart) {
      return res.status(404).json({ message: "העגלה לא נמצאה" });
    }

    // Check if the cart belongs to the current user
    if (cart.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "אין הרשאה למחוק עגלה זו" });
    }

    await Cart.deleteOne({ _id: req.params.id });
    res.json({ message: "העגלה נמחקה בהצלחה" });
  } catch (error) {
    console.error("Error deleting cart:", error);
    res.status(500).json({ message: "שגיאת שרת במחיקת העגלה" });
  }
});

module.exports = router;
