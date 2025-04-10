import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useSearchParams } from "react-router-dom";
import { FiShoppingCart, FiSave } from "react-icons/fi";
import CartItem from "../components/CartItem";
import ProductModal from "../components/ProductModal";
import { useProducts } from "../context/ProductContext";
import { useUser } from "../context/UserContext";

/**
 * CartPage displays the current user's shopping cart, including:
 * - A list of items in the cart with the option to remove or edit quantities.
 * - A feature to save the cart under a custom name (if the user is logged in).
 * - A button to clear the entire cart after confirmation.
 * - Price totals for the cart items across different supermarkets.
 * - A modal for saving the cart and for clearing the cart.
 * It also provides functionality for loading product details in a modal if a product is clicked.
 *
 * @returns {JSX.Element} CartPage component displaying cart items, totals, and options to save or clear the cart
 */
const CartPage = () => {
  const { cart, clearCart, saveCart, getSupermarketTotals } = useCart(); // Access cart functions from CartContext
  const { products } = useProducts(); // Access product list from ProductContext
  const { currentUser } = useUser(); // Access current user state from UserContext

  const [searchParams] = useSearchParams(); // Access URL search parameters
  const [showConfirm, setShowConfirm] = useState(false); // State for showing the clear cart confirmation modal
  const [showSaveModal, setShowSaveModal] = useState(false); // State for showing the save cart modal
  const [cartName, setCartName] = useState(""); // State for the cart name when saving

  const productId = searchParams.get("id"); // Get product ID from URL
  const selectedProduct = productId
    ? products.find((p) => String(p.id) === productId) // Find the selected product based on ID from URL
    : null;

  const supermarketTotals = getSupermarketTotals(); // Get price totals across supermarkets

  const [saveMessage, setSaveMessage] = useState(""); // State for displaying success message after saving cart

  /**
   * Handles saving the current cart with the given name.
   * It displays a success message if the cart is saved successfully.
   */
  const handleSaveCart = async () => {
    const savedCart = await saveCart(cartName); // Save the cart with the given name
    if (savedCart) {
      setSaveMessage("העגלה נשמרה בהצלחה! ✅"); // Set success message
      setTimeout(() => setSaveMessage(""), 3000); // Clear success message after 3 seconds
    }
    setCartName(""); // Clear cart name input
    setShowSaveModal(false); // Close the save cart modal
  };

  return (
    <div dir="rtl" className="max-w-6xl mx-auto px-[5%] py-12 text-right">
      <h1 className="text-4xl font-extrabold text-blue-700 text-center mb-10">
        עגלת הקניות שלך 🛒
      </h1>

      {/* Success Message */}
      {saveMessage && (
        <div className="bg-green-100 text-green-700 p-3 rounded-md shadow-md text-center mb-4">
          {saveMessage}
        </div>
      )}

      {/* Empty Cart State */}
      {cart.length === 0 ? (
        <div className="bg-white text-center p-10 rounded-2xl shadow-md text-gray-600">
          <FiShoppingCart className="mx-auto text-5xl mb-4 text-blue-500" />
          <p className="text-lg">
            העגלה שלך ריקה! ניתן להוסיף פריטים לבחירתך 🛍️
          </p>
        </div>
      ) : (
        <>
          {/* Save & Clear Cart Buttons */}
          <div className="flex justify-between mb-6 gap-4 flex-wrap">
            <div className="relative group">
              <button
                onClick={() => setShowSaveModal(true)}
                disabled={!currentUser}
                className={`font-semibold px-4 py-2 rounded-lg shadow flex items-center gap-2
                  ${
                    currentUser
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }
                `}
              >
                <FiSave />
                שמור עגלה
              </button>
              {!currentUser && (
                <div className="absolute bottom-full mb-2 right-0 bg-black text-white text-xs px-3 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  על מנת לשמור עגלות עליך להתחבר
                </div>
              )}
            </div>

            <button
              onClick={() => setShowConfirm(true)}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow"
            >
              נקה עגלה
            </button>
          </div>

          {/* Cart Items */}
          <div className="space-y-6">
            {cart.map((item) => (
              <CartItem key={item.id} item={item} /> // Display each cart item
            ))}
          </div>

          {/* Totals */}
          <div className="mt-12 bg-blue-50 p-6 rounded-2xl shadow-lg border border-blue-100">
            <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-2">
              מחירים בסופרמרקטים 💰
            </h2>
            <div className="space-y-2">
              {Object.entries(supermarketTotals).map(([supermarket, total]) => (
                <div
                  key={supermarket}
                  className="flex justify-between items-center text-lg font-medium border-b border-blue-100 py-2 last:border-b-0"
                >
                  <span className="text-gray-700">{supermarket}</span>
                  <span className="text-gray-900 font-semibold">
                    ₪{total.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Modal if open */}
          {selectedProduct && <ProductModal product={selectedProduct} />}
        </>
      )}

      {/* Confirm Clear Cart Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md text-center space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              האם את/ה בטוח/ה שברצונך לרוקן את כל העגלה?
            </h3>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => {
                  clearCart();
                  setShowConfirm(false);
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
              >
                כן, נקה
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-semibold"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Cart Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md text-center space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">שמור עגלה</h3>
            <input
              type="text"
              value={cartName}
              onChange={(e) => setCartName(e.target.value)}
              placeholder="הקלד שם לעגלה (אופציונלי)"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleSaveCart}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
              >
                שמור
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-semibold"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
