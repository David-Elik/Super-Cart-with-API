import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

/**
 * ProductCard component displays information about a product including its name, category,
 * price comparison across supermarkets, quantity selector, and the option to add the product to the cart.
 * It allows users to view product details and interact with the cart by adjusting the quantity and adding items.
 *
 * @param {Object} props - Component props
 * @param {Object} props.product - The product object to be displayed
 * @param {string} props.product.id - The unique identifier for the product
 * @param {string} props.product.name - The name of the product
 * @param {string} props.product.category - The category of the product
 * @param {Object} props.product.prices - An object of prices for the product in different supermarkets
 * @returns {JSX.Element} ProductCard component displaying product information, quantity selector, and add to cart button
 */
const ProductCard = ({ product }) => {
  const { addToCart } = useCart(); // Access addToCart from CartContext
  const [quantity, setQuantity] = useState(1); // State to store the quantity of the product
  const [isAdding, setIsAdding] = useState(false); // State to manage the "adding to cart" state
  const navigate = useNavigate(); // Hook for navigating to the product modal

  /**
   * Increases the quantity of the product by 1 (up to a maximum of 99)
   */
  const increaseQty = () => setQuantity((q) => Math.min(q + 1, 99));

  /**
   * Decreases the quantity of the product by 1 (down to a minimum of 1)
   */
  const decreaseQty = () => setQuantity((q) => Math.max(q - 1, 1));

  /**
   * Opens the product modal when the product name is clicked
   */
  const openModal = () => {
    navigate(`/products?id=${product.id}`, { replace: false });
  };

  /**
   * Handles adding the product to the cart with the specified quantity
   */
  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(product, null, quantity);
      setQuantity(1); // Reset quantity after adding to cart
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  // If product or product prices are not available, show a message
  if (!product || !product.prices) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 text-right">
        <p className="text-gray-500">מידע על המוצר אינו זמין</p>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="bg-white rounded-2xl shadow-md hover:shadow-lg p-6 transition-all duration-300 border border-gray-100 text-right"
    >
      {/* Clickable product name */}
      <h2
        onClick={openModal}
        className="text-2xl font-bold text-blue-700 mb-1 cursor-pointer hover:underline"
      >
        {product.name}
      </h2>
      <p className="text-sm text-gray-500 mb-4">{product.category}</p>

      {/* Price comparison table */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-800 mb-2">
          מחירים בסופרמרקטים:
        </h3>
        <div className="space-y-1">
          {Object.entries(product.prices).map(([market, price]) => (
            <div
              key={market}
              className="flex justify-between text-gray-700 text-sm bg-gray-50 px-3 py-1 rounded-md border"
            >
              <span className="text-right">{market}</span>
              <span className="font-medium text-left">₪{price.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quantity selector and Add to cart */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`${
            isAdding ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          } text-white font-semibold px-4 py-2 rounded-lg shadow-md transition`}
        >
          {isAdding ? "מוסיף..." : "הוסף לעגלה"}
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={decreaseQty}
            disabled={quantity <= 1 || isAdding}
            className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-full disabled:opacity-50 transition"
          >
            –
          </button>
          <input
            type="number"
            value={quantity}
            min="1"
            max="99"
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
            className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-full transition disabled:opacity-50"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
