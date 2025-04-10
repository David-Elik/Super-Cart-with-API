import React from "react";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

/**
 * CartItem component displays an individual item in the user's shopping cart
 * and provides functionalities to update quantity and remove the item.
 *
 * @param {Object} props - Component props
 * @param {Object} props.item - Item object to be displayed in the cart
 * @param {string} props.item.id - Unique identifier for the cart item
 * @param {string} props.item.name - Name of the cart item
 * @param {string} props.item.category - Category of the cart item
 * @param {Object} props.item.prices - Prices of the item in various supermarkets
 * @param {number} props.item.quantity - Quantity of the item in the cart
 * @returns {JSX.Element} CartItem component displaying item details, price, and actions
 */
const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart(); // Access cart context functions for removing and updating quantity
  const navigate = useNavigate(); // Hook for navigation

  /**
   * Opens the product modal for the current cart item
   */
  const openModal = () => {
    navigate(`/cart?id=${item.id}`, { replace: false });
  };

  return (
    <div
      dir="rtl"
      className="bg-white p-6 rounded-2xl shadow-md border border-blue-100 hover:shadow-lg transition-all text-right"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2
            onClick={openModal}
            className="text-xl font-semibold text-blue-700 cursor-pointer hover:underline"
          >
            {item.name} {/* Displays item name */}
          </h2>
          <p className="text-sm text-gray-500 mt-1">קטגוריה: {item.category}</p>{" "}
          {/* Displays item category */}
          {/* Prices across supermarkets */}
          <div className="mt-4">
            <h4 className="font-medium text-gray-700 mb-1">מחירים:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(item.prices).map(([market, price]) => (
                <div
                  key={market}
                  className="flex justify-between bg-gray-50 px-3 py-2 rounded-md border border-gray-200"
                >
                  <span className="text-gray-600">{market}</span>{" "}
                  {/* Market name */}
                  <span className="text-gray-800 font-semibold">
                    ₪{price.toFixed(2)} {/* Display price */}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quantity and Actions */}
        <div className="flex flex-col items-center gap-2 md:items-end">
          <div className="flex items-center gap-3">
            {/* Decrease quantity */}
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-200 disabled:opacity-50"
            >
              <FiMinus />
            </button>
            <span className="text-lg font-semibold text-gray-800">
              {item.quantity} {/* Displays item quantity */}
            </span>
            {/* Increase quantity */}
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-600 transition"
            >
              <FiPlus />
            </button>
          </div>
          {/* Remove item button */}
          <button
            onClick={() => removeFromCart(item.id)}
            className="mt-2 bg-red-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-red-600 transition-all"
            title="Remove"
          >
            <FiTrash2 className="text-sm" />
            <span className="text-sm">הסר</span> {/* Text for removing item */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
