import React, { useState } from "react";
import { useCart } from "../context/CartContext";

/**
 * SavedCarts component allows users to save their current shopping cart, load previously saved carts,
 * and delete saved carts. It provides a user interface for managing saved carts, including form inputs
 * for saving a cart and buttons to load or delete saved carts.
 *
 * @returns {JSX.Element} SavedCarts component displaying saved carts, options to load or delete them,
 * and a form to save the current cart.
 */
const SavedCarts = () => {
  const {
    cart,
    savedCarts,
    loadSavedCart,
    saveCart,
    deleteSavedCartById,
    loading,
    error,
  } = useCart(); // Access cart management functions from CartContext

  const [cartName, setCartName] = useState(""); // State for the cart name input field
  const [successMessage, setSuccessMessage] = useState(""); // State for displaying success messages

  /**
   * Saves the current cart with the provided name.
   * If the cart is empty, alerts the user and prevents saving.
   */
  const handleSaveCart = async () => {
    if (cart.length === 0) {
      alert("Cannot save empty cart");
      return;
    }

    const result = await saveCart(cartName); // Save cart using the provided cartName
    if (result) {
      setCartName(""); // Clear the cart name input field after saving
      setSuccessMessage("Cart saved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000); // Reset success message after 3 seconds
    }
  };

  /**
   * Loads a saved cart by its ID.
   * Warns the user if the current cart will be replaced by the saved one.
   * Displays a success message after loading.
   *
   * @param {string} cartId - The ID of the saved cart to load
   */
  const handleLoadCart = async (cartId) => {
    if (cart.length > 0) {
      if (!window.confirm("This will replace your current cart. Continue?")) {
        return; // Prevent loading if the user cancels
      }
    }

    const success = await loadSavedCart(cartId); // Load the saved cart by ID
    if (success) {
      setSuccessMessage("Cart loaded successfully!");
      setTimeout(() => setSuccessMessage(""), 3000); // Reset success message after 3 seconds
    }
  };

  /**
   * Deletes a saved cart by its ID after user confirmation.
   * Displays a success message after deletion.
   *
   * @param {string} cartId - The ID of the saved cart to delete
   */
  const handleDeleteCart = async (cartId) => {
    if (window.confirm("Are you sure you want to delete this saved cart?")) {
      const success = await deleteSavedCartById(cartId); // Delete the saved cart by ID
      if (success) {
        setSuccessMessage("Cart deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000); // Reset success message after 3 seconds
      }
    }
  };

  return (
    <div className="saved-carts-container">
      <h2>Saved Carts</h2>
      {error && <div className="error-message">{error}</div>}{" "}
      {/* Display error message if present */}
      {successMessage && (
        <div className="success-message">{successMessage}</div> // Display success message if any
      )}
      <div className="save-cart-form">
        <input
          type="text"
          value={cartName}
          onChange={(e) => setCartName(e.target.value)} // Update cart name as the user types
          placeholder="Cart name"
        />
        <button
          onClick={handleSaveCart}
          disabled={loading || cart.length === 0} // Disable button if cart is empty or loading
        >
          {loading ? "Saving..." : "Save Current Cart"} // Display loading
          message or default text
        </button>
      </div>
      {loading ? (
        <div>Loading saved carts...</div> // Show loading state if carts are being fetched
      ) : (
        <div className="saved-carts-list">
          {savedCarts.length === 0 ? (
            <p>No saved carts found.</p> // Show message if no saved carts are available
          ) : (
            <ul>
              {savedCarts.map((savedCart) => (
                <li key={savedCart._id} className="saved-cart-item">
                  {" "}
                  {/* Use _id for key */}
                  <div className="cart-info">
                    <h3>{savedCart.name}</h3>
                    <p>{savedCart.items.length} items</p>{" "}
                    {/* Show the number of items in the saved cart */}
                    <p>
                      Created:{" "}
                      {new Date(savedCart.createdAt).toLocaleDateString()}{" "}
                      {/* Show creation date of saved cart */}
                    </p>
                  </div>
                  <div className="cart-actions">
                    <button onClick={() => handleLoadCart(savedCart._id)}>
                      Load {/* Button to load the saved cart */}
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDeleteCart(savedCart._id)
                      } /* Changed from savedCart.id to savedCart._id */
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedCarts;
