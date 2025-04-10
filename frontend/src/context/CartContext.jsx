import React, { createContext, useState, useContext, useEffect } from "react";
import { useUser } from "../context/UserContext";
import {
  saveCartToDB,
  getSavedCarts,
  getSavedCartById,
  deleteSavedCart,
} from "../api/cartAPI";

/**
 * Context for cart management and saved carts functionality
 * @type {React.Context}
 */
const CartContext = createContext();

/**
 * Provider component for managing the user's cart and saved carts
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Provider component
 */
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); // Holds the current user's cart items
  const [savedCarts, setSavedCarts] = useState([]); // Holds saved carts from the database
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [error, setError] = useState(null); // Error state for API calls
  const { currentUser } = useUser(); // Accessing current user from UserContext

  // Fetch saved carts when component mounts or when currentUser changes
  useEffect(() => {
    if (currentUser) {
      fetchSavedCarts(); // Fetch saved carts if the user is logged in
    }
  }, [currentUser]);

  /**
   * Fetch all saved carts from the backend
   */
  const fetchSavedCarts = async () => {
    try {
      if (!currentUser) {
        console.warn("User not logged in. Skipping saved carts fetch.");
        return;
      }
      setLoading(true);
      const carts = await getSavedCarts();
      setSavedCarts(carts);
      setError(null);
    } catch (err) {
      setError("Error fetching saved carts: " + err.message);
      console.error("Error fetching saved carts:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add a product to the cart
   *
   * @param {Object} product - Product object to add
   * @param {number} quantity - Quantity to add (defaults to 1)
   */
  const addToCart = (product, _, quantity = 1) => {
    const existingItemIndex = cart.findIndex((item) => item.id === product.id);

    if (existingItemIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
  };

  /**
   * Remove a product from the cart
   *
   * @param {string} productId - Product ID to remove
   */
  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  /**
   * Update the quantity of a product in the cart
   *
   * @param {string} productId - Product ID to update
   * @param {number} newQuantity - New quantity for the product
   */
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
  };

  /**
   * Clear all items from the cart
   */
  const clearCart = () => {
    setCart([]);
  };

  /**
   * Load a cart's items from an array of items
   *
   * @param {Array} items - Array of items to populate the cart
   */
  const loadCart = (items) => {
    setCart([...items]);
  };

  /**
   * Load a saved cart from the database by cart ID
   *
   * @param {string} cartId - Saved cart ID to load
   * @returns {boolean} - Success status of the operation
   */
  const loadSavedCart = async (cartId) => {
    try {
      setLoading(true);
      const savedCart = await getSavedCartById(cartId);
      if (savedCart && savedCart.items) {
        setCart(savedCart.items);
        setError(null);
        return true;
      }
      return false;
    } catch (err) {
      setError("Error loading saved cart: " + err.message);
      console.error("Error loading saved cart:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Save the current cart to the database
   *
   * @param {string} name - Name of the saved cart
   * @returns {Object|null} - Saved cart data or null if error occurred
   */
  const saveCart = async (name) => {
    try {
      setLoading(true);
      if (cart.length === 0) {
        setError("Cannot save an empty cart");
        return null;
      }
      const cartData = {
        name: name || `עגלה ${Date.now()}`,
        items: cart,
      };
      const savedCart = await saveCartToDB(cartData);
      await fetchSavedCarts(); // Refresh the list of saved carts
      setError(null);
      return savedCart;
    } catch (err) {
      setError("Error saving cart: " + err.message);
      console.error("Error saving cart:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a saved cart from the database by cart ID
   *
   * @param {string} cartId - Saved cart ID to delete
   * @returns {boolean} - Success status of the operation
   */
  const deleteSavedCartById = async (cartId) => {
    try {
      setLoading(true);
      await deleteSavedCart(cartId);
      await fetchSavedCarts(); // Refresh the list of saved carts
      setError(null);
      return true;
    } catch (err) {
      setError("Error deleting saved cart: " + err.message);
      console.error("Error deleting saved cart:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get the total price for each supermarket based on cart items
   * @returns {Object} - Total prices for each supermarket
   */
  const getSupermarketTotals = () => {
    const totals = {};
    cart.forEach((item) => {
      Object.entries(item.prices).forEach(([market, price]) => {
        if (!totals[market]) totals[market] = 0;
        totals[market] += price * item.quantity;
      });
    });
    return totals;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        savedCarts,
        loading,
        error,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loadCart,
        loadSavedCart,
        saveCart,
        deleteSavedCartById,
        getSupermarketTotals,
        fetchSavedCarts,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/**
 * Custom hook for accessing the cart context
 *
 * @returns {Object} The cart context value
 * @throws {Error} If used outside of CartProvider
 */
export const useCart = () => useContext(CartContext);
