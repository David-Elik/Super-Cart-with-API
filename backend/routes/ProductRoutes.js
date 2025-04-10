/**
 * Product Routes - Express Router
 *
 * This module handles all the product-related API routes including fetching all products,
 * getting product details by ID, filtering products by category, searching products,
 * and managing the top-rated and most popular products.
 * It also includes routes that are protected and require admin privileges for creating, updating, and deleting products.
 *
 * @module ProductRoutes
 */

const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");
const jwt = require("jsonwebtoken");

/**
 * Auth Middleware for Protected Routes
 *
 * This middleware verifies that the request contains a valid JWT token in the `x-auth-token` header.
 * If the token is invalid or missing, it returns a `401 Unauthorized` error.
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
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "yourSecretKey"
    );
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "טוקן לא תקין" });
  }
};

/**
 * Admin Middleware for Admin Routes
 *
 * This middleware checks if the current user is an admin.
 * If the user does not have admin privileges, it returns a `403 Forbidden` error.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
const adminMiddleware = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "אין הרשאת מנהל" });
  }
  next();
};

// Public Product Routes

/**
 * GET /api/products
 *
 * Get all products in the system, sorted alphabetically by name.
 *
 * @returns {Array} List of all product objects.
 * @throws {500} If there is an error fetching products.
 */
router.get("/", productController.getAllProducts);

/**
 * GET /api/products/categories
 *
 * Get all unique product categories in the system.
 *
 * @returns {Array} List of unique product categories.
 * @throws {500} If there is an error fetching categories.
 */
router.get("/categories", productController.getAllCategories);

/**
 * GET /api/products/category/:category
 *
 * Get products belonging to a specific category.
 *
 * @param {string} req.params.category - The product category.
 * @returns {Array} List of products in the specified category.
 * @throws {500} If there is an error fetching products by category.
 */
router.get("/category/:category", productController.getProductsByCategory);

/**
 * GET /api/products/search
 *
 * Search for products based on a query string. It can search by product name or category.
 *
 * @param {string} req.query.q - The search query.
 * @returns {Array} List of products matching the search criteria.
 * @throws {400} If no search term is provided.
 * @throws {500} If there is an error executing the search.
 */
router.get("/search", productController.searchProducts);

/**
 * GET /api/products/top
 *
 * Get the top products based on different criteria (e.g., cheapest, most selected, highest rated).
 *
 * @returns {Array} List of top products based on the criteria.
 * @throws {500} If there is an error fetching top products.
 */
router.get("/top", productController.getTopProducts);

/**
 * GET /api/products/:id
 *
 * Get detailed information about a specific product by its ID.
 *
 * @param {string} req.params.id - The product ID.
 * @returns {object} The product details.
 * @throws {404} If the product with the given ID is not found.
 * @throws {500} If there is an error fetching the product.
 */
router.get("/:id", productController.getProductById);

// Admin-only Product Routes

/**
 * POST /api/products
 *
 * Create a new product. Only accessible to admin users.
 *
 * @param {string} req.body.name - The name of the product.
 * @param {string} req.body.description - The description of the product.
 * @param {string} req.body.category - The category of the product.
 * @param {Object} req.body.prices - Prices of the product in different supermarkets.
 * @param {string} req.body.unit - The unit of the product (e.g., kg, liter).
 * @returns {object} The newly created product.
 * @throws {400} If required fields like name, category, or prices are missing.
 * @throws {500} If there is an error creating the product.
 */
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  productController.createProduct
);

/**
 * PUT /api/products/:id
 *
 * Update an existing product. Only accessible to admin users.
 *
 * @param {string} req.params.id - The product ID.
 * @param {string} req.body.name - The name of the product (optional).
 * @param {string} req.body.description - The description of the product (optional).
 * @param {string} req.body.category - The category of the product (optional).
 * @param {Object} req.body.prices - Prices of the product in different supermarkets (optional).
 * @param {string} req.body.unit - The unit of the product (optional).
 * @param {number} req.body.popularity - The popularity rating of the product (optional).
 * @param {number} req.body.rating - The rating of the product (optional).
 * @returns {object} The updated product.
 * @throws {404} If the product with the given ID is not found.
 * @throws {500} If there is an error updating the product.
 */
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  productController.updateProduct
);

/**
 * DELETE /api/products/:id
 *
 * Delete a specific product by its ID. Only accessible to admin users.
 *
 * @param {string} req.params.id - The product ID.
 * @returns {object} Success message indicating the product has been deleted.
 * @throws {404} If the product with the given ID is not found.
 * @throws {500} If there is an error deleting the product.
 */
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  productController.deleteProduct
);

module.exports = router;
