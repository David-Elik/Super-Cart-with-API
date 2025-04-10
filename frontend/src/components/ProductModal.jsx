import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FiX } from "react-icons/fi";

/**
 * ProductModal component displays detailed information about a product, including its name,
 * category, rating, description, price range, and the ability to adjust the quantity and add the product to the cart.
 * It is presented as a modal and is typically triggered when a user clicks on a product to view more details.
 *
 * @param {Object} props - Component props
 * @param {Object} props.product - The product object to be displayed
 * @param {string} props.product.id - The unique identifier for the product
 * @param {string} props.product.name - The name of the product
 * @param {string} props.product.category - The category of the product
 * @param {string} props.product.description - A description of the product
 * @param {Object} props.product.prices - An object of prices for the product in different supermarkets
 * @param {number} props.product.rating - The product's rating (out of 5)
 * @returns {JSX.Element} ProductModal component displaying product details, price range, and options to add the product to the cart
 */
const ProductModal = ({ product }) => {
  const { cart, addToCart } = useCart(); // Access cart state and addToCart function from CartContext
  const navigate = useNavigate(); // Hook for navigating to the previous page
  const [isAdding, setIsAdding] = useState(false); // State for managing the "adding to cart" state

  // Get the existing quantity of the product in the cart
  const existingItem = cart.find((item) => item.id === product.id);
  const [quantity, setQuantity] = useState(existingItem?.quantity || 1); // Set initial quantity

  // Reset quantity if product changes
  useEffect(() => {
    setQuantity(existingItem?.quantity || 1);
  }, [existingItem, product]);

  /**
   * Closes the product modal and navigates to the previous route (either /products or /cart)
   */
  const closeModal = () => {
    navigate(-1);
  };

  /**
   * Increases the quantity of the product by 1 (up to a maximum of 99)
   */
  const increaseQty = () => setQuantity((q) => Math.min(q + 1, 99));

  /**
   * Decreases the quantity of the product by 1 (down to a minimum of 1)
   */
  const decreaseQty = () => setQuantity((q) => Math.max(q - 1, 1));

  /**
   * Handles adding the product to the cart with the selected quantity and closes the modal
   */
  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(product, null, quantity);
      closeModal();
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  // If product or product prices are not available, show an error message
  if (!product || !product.prices) {
    return (
      <div
        dir="rtl"
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 text-right"
      >
        <div className="bg-white w-full max-w-xl rounded-2xl shadow-lg p-6 relative animate-fade-in">
          <button
            onClick={closeModal}
            className="absolute top-4 left-4 text-gray-500 hover:text-red-500 text-xl"
          >
            <FiX />
          </button>
          <h2 className="text-2xl font-bold text-red-500 mb-4">שגיאה</h2>
          <p className="text-gray-700">מידע על המוצר אינו זמין</p>
          <button
            onClick={closeModal}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition"
          >
            סגור
          </button>
        </div>
      </div>
    );
  }

  // Calculate the price range (minimum and maximum price) across supermarkets
  const priceValues = Object.values(product.prices);
  const minPrice = Math.min(...priceValues);
  const maxPrice = Math.max(...priceValues);

  /**
   * Renders star ratings based on the product's rating
   *
   * @returns {JSX.Element} Star rating display
   */
  const renderStars = () => {
    const fullStars = Math.floor(product.rating);
    const emptyStars = 5 - fullStars;
    return (
      <div className="flex items-center gap-1 text-yellow-500">
        {Array.from({ length: fullStars }).map((_, idx) => (
          <span key={`full-star-${idx}`} className="text-xl">
            ★
          </span>
        ))}
        {Array.from({ length: emptyStars }).map((_, idx) => (
          <span key={`empty-star-${idx}`} className="text-xl">
            ☆
          </span>
        ))}
      </div>
    );
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 text-right"
    >
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-lg p-6 relative animate-fade-in">
        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute top-4 left-4 text-gray-500 hover:text-red-500 text-xl"
        >
          <FiX />
        </button>

        {/* Product info */}
        <h2 className="text-3xl font-bold text-blue-700 mb-1">
          {product.name}
        </h2>
        <p className="text-sm text-gray-500 mb-4">{product.category}</p>

        {/* Product Rating */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">דירוג:</h3>
          {renderStars()}
          <p className="text-sm text-gray-600">
            דירוג: {product.rating.toFixed(1)} / 5
          </p>
        </div>

        {/* Product Description */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">תיאור המוצר:</h3>
          <p className="text-sm text-gray-700">{product.description}</p>
        </div>

        {/* Price range */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">טווח מחירים:</h3>
          <div className="space-y-2">
            <div className="flex justify-between px-4 py-2 bg-gray-50 border border-gray-200 rounded-md">
              <span className="text-gray-600">המחיר הנמוך ביותר:</span>
              <span className="text-gray-800 font-semibold">
                ₪{minPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between px-4 py-2 bg-gray-50 border border-gray-200 rounded-md">
              <span className="text-gray-600">המחיר הגבוה ביותר:</span>
              <span className="text-gray-800 font-semibold">
                ₪{maxPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Quantity and add to cart */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={decreaseQty}
              disabled={quantity <= 1 || isAdding}
              className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-300 disabled:opacity-50"
            >
              –
            </button>
            <input
              type="number"
              value={quantity}
              disabled={isAdding}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val) && val >= 1 && val <= 99) setQuantity(val);
              }}
              className="w-12 text-center border border-gray-300 rounded-md py-1 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={increaseQty}
              disabled={isAdding}
              className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-300 disabled:opacity-50"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`${
              isAdding ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white font-semibold px-6 py-2 rounded-lg shadow-md transition`}
          >
            {isAdding ? "מוסיף..." : "הוסף לעגלה"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
