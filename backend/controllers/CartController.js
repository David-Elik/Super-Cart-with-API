const Cart = require("../models/Cart"); // If using MongoDB with Mongoose

/**
 * Get all saved carts
 * Retrieves all carts from the database, sorted by the most recent.
 * Optionally, can be filtered by the user ID if authentication is implemented.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @returns {JSON} - A list of all saved carts, sorted by creation date.
 */
exports.getAllCarts = async (req, res) => {
  try {
    // Optionally, add user authentication and filter carts by user ID
    // const userId = req.user.id;
    // const carts = await Cart.find({ userId });

    const carts = await Cart.find().sort({ createdAt: -1 }); // Get carts sorted by creation date
    res.json(carts);
  } catch (error) {
    console.error("Error in getAllCarts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get a specific cart by ID
 * Fetches a specific cart from the database using the cart ID provided in the URL.
 * Optionally, checks if the cart belongs to the authenticated user.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @returns {JSON} - The cart object if found, or a 404 error if not found.
 */
exports.getCartById = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Optionally, check if the cart belongs to the current user
    // if (cart.userId.toString() !== req.user.id) {
    //   return res.status(403).json({ message: 'Not authorized' });
    // }

    res.json(cart);
  } catch (error) {
    console.error("Error in getCartById:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Create a new cart
 * Creates a new cart in the database with the provided name and items.
 * Optionally, includes the user ID for associating the cart with a specific user.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @returns {JSON} - The newly created cart.
 */
exports.createCart = async (req, res) => {
  try {
    const { name, items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart items are required" });
    }

    const newCart = new Cart({
      name: name || `Cart ${Date.now()}`,
      items,
      // Optionally add userId if authentication is implemented
      // userId: req.user.id
    });

    const savedCart = await newCart.save();
    res.status(201).json(savedCart);
  } catch (error) {
    console.error("Error in createCart:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update an existing cart
 * Updates the name and items of an existing cart in the database.
 * Optionally, checks if the cart belongs to the authenticated user before allowing updates.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @returns {JSON} - The updated cart.
 */
exports.updateCart = async (req, res) => {
  try {
    const { name, items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: "Valid cart items are required" });
    }

    const cart = await Cart.findById(req.params.id);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Optionally, check if the cart belongs to the current user
    // if (cart.userId.toString() !== req.user.id) {
    //   return res.status(403).json({ message: 'Not authorized' });
    // }

    cart.name = name || cart.name; // Update name if provided, otherwise retain existing
    cart.items = items; // Update cart items
    cart.updatedAt = Date.now(); // Update the timestamp

    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    console.error("Error in updateCart:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete a cart
 * Deletes an existing cart from the database using the cart ID provided in the URL.
 * Optionally, checks if the cart belongs to the authenticated user before deletion.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @returns {JSON} - A success message if the cart is deleted, or an error message if not.
 */
exports.deleteCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Optionally, check if the cart belongs to the current user
    // if (cart.userId.toString() !== req.user.id) {
    //   return res.status(403).json({ message: 'Not authorized' });
    // }

    await cart.remove();
    res.json({ message: "Cart deleted successfully" });
  } catch (error) {
    console.error("Error in deleteCart:", error);
    res.status(500).json({ message: "Server error" });
  }
};
