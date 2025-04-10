const Product = require("../models/Product");

/**
 * Get all products
 * Retrieves all products from the database, sorted by their name in ascending order.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @returns {JSON} - A list of all products sorted by name.
 */
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort("name"); // Fetch all products sorted by name
    res.json(products);
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    res.status(500).json({ message: "שגיאת שרת בטעינת המוצרים" });
  }
};

/**
 * Get a specific product by ID
 * Fetches a product based on the product ID provided in the URL.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @returns {JSON} - The product object if found, or a 404 error if not found.
 */
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "המוצר לא נמצא" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error in getProductById:", error);
    res.status(500).json({ message: "שגיאת שרת בטעינת המוצר" });
  }
};

/**
 * Get products by category
 * Fetches products that belong to a specific category.
 * The category is provided in the URL parameter.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @returns {JSON} - A list of products in the specified category.
 */
exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category }).sort(
      "name"
    );
    res.json(products);
  } catch (error) {
    console.error("Error in getProductsByCategory:", error);
    res.status(500).json({ message: "שגיאת שרת בטעינת מוצרים לפי קטגוריה" });
  }
};

/**
 * Get all categories
 * Retrieves all unique categories from the database.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @returns {JSON} - A list of all unique product categories.
 */
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories);
  } catch (error) {
    console.error("Error in getAllCategories:", error);
    res.status(500).json({ message: "שגיאת שרת בטעינת הקטגוריות" });
  }
};

/**
 * Search products
 * Allows users to search for products by name or category using a query string.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @returns {JSON} - A list of products matching the search query.
 */
exports.searchProducts = async (req, res) => {
  try {
    const searchTerm = req.query.q;

    if (!searchTerm) {
      return res.status(400).json({ message: "נדרש ביטוי חיפוש" });
    }

    let query = {};

    // If the search term is a valid number, treat it as an ID search
    if (!isNaN(searchTerm)) {
      query = { id: parseInt(searchTerm, 10) }; // Convert string to number for 'id'
    } else {
      // Otherwise, search by name or category using a case-insensitive regex
      const regex = new RegExp(searchTerm, "i");
      query = {
        $or: [
          { name: regex }, // Search in the 'name' field
          { category: regex }, // Search in the 'category' field
        ],
      };
    }

    const products = await Product.find(query).sort("name");
    res.json(products);
  } catch (error) {
    console.error("Error in searchProducts:", error);
    res.status(500).json({ message: "שגיאת שרת בחיפוש מוצרים" });
  }
};

/**
 * Get top products
 * Retrieves the top products based on a specified criteria (e.g., cheapest, most selected).
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @returns {JSON} - A list of the top products based on the selected criteria.
 */
exports.getTopProducts = async (req, res) => {
  try {
    const criteria = req.query.criteria || "cheapest"; // Default to "cheapest"
    const limit = parseInt(req.query.limit) || 10; // Limit the number of products to fetch

    let products;
    let sortOption = {};

    // Apply sorting based on the specified criteria
    switch (criteria) {
      case "cheapest":
        products = await Product.find();
        products.sort((a, b) => {
          const minPriceA = Math.min(...Object.values(a.prices.toObject()));
          const minPriceB = Math.min(...Object.values(b.prices.toObject()));
          return minPriceA - minPriceB;
        });
        products = products.slice(0, limit);
        break;

      case "highest different":
        products = await Product.find();
        products.sort((a, b) => {
          const pricesA = Object.values(a.prices.toObject());
          const pricesB = Object.values(b.prices.toObject());
          const diffA = Math.max(...pricesA) - Math.min(...pricesA);
          const diffB = Math.max(...pricesB) - Math.min(...pricesB);
          return diffB - diffA;
        });
        products = products.slice(0, limit);
        break;

      case "most selected":
        sortOption = { popularity: -1 };
        products = await Product.find().sort(sortOption).limit(limit);
        break;

      case "highest rated":
        sortOption = { rating: -1 };
        products = await Product.find().sort(sortOption).limit(limit);
        break;

      default:
        products = await Product.find().sort("name").limit(limit);
        break;
    }

    res.json(products);
  } catch (error) {
    console.error("Error in getTopProducts:", error);
    res.status(500).json({ message: "שגיאת שרת בטעינת מוצרים מובילים" });
  }
};

/**
 * Admin-only route: Create product
 * Allows an admin to create a new product in the database.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @returns {JSON} - The newly created product.
 */
exports.createProduct = async (req, res) => {
  try {
    const { name, description, category, prices, unit } = req.body;

    if (!name || !category || !prices) {
      return res.status(400).json({ message: "נדרשים שם, קטגוריה ומחירים" });
    }

    const newProduct = new Product({
      name,
      description,
      category,
      prices,
      unit: unit || "unit",
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error in createProduct:", error);
    res.status(500).json({ message: "שגיאת שרת ביצירת מוצר" });
  }
};

/**
 * Update product
 * Allows an admin to update an existing product's details in the database.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @returns {JSON} - The updated product.
 */
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, category, prices, unit, popularity, rating } =
      req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "המוצר לא נמצא" });
    }

    // Update fields if provided
    if (name) product.name = name;
    if (description !== undefined) product.description = description;
    if (category) product.category = category;
    if (prices) product.prices = prices;
    if (unit) product.unit = unit;
    if (popularity !== undefined) product.popularity = popularity;
    if (rating !== undefined) product.rating = rating;

    product.updatedAt = Date.now();

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error in updateProduct:", error);
    res.status(500).json({ message: "שגיאת שרת בעדכון מוצר" });
  }
};

/**
 * Delete product
 * Allows an admin to delete a product from the database by its ID.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @returns {JSON} - A success message if the product is deleted.
 */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "המוצר לא נמצא" });
    }

    await Product.deleteOne({ _id: req.params.id });
    res.json({ message: "המוצר נמחק בהצלחה" });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    res.status(500).json({ message: "שגיאת שרת במחיקת מוצר" });
  }
};
