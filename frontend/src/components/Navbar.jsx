import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { FiShoppingCart, FiUser } from "react-icons/fi";

/**
 * Navbar component that provides the main navigation for the application.
 * It includes the brand logo, navigation links, a shopping cart icon with item count,
 * and an account menu with login/logout options.
 *
 * @returns {JSX.Element} Navbar component with navigation links, user account menu, and shopping cart
 */
const Navbar = () => {
  const { cart } = useCart(); // Access cart state from CartContext
  const { currentUser, logout } = useUser(); // Access user state from UserContext
  const [showAccountMenu, setShowAccountMenu] = useState(false); // State for toggling the account menu
  const location = useLocation(); // Hook for current location (path)

  /**
   * Determines if the current path matches the given path for active link styling
   *
   * @param {string} path - The path to compare against the current location
   * @returns {boolean} - True if the current path matches the given path
   */
  const isActive = (path) => location.pathname === path;

  /**
   * Generates dynamic classes for navigation links based on the active state
   *
   * @param {string} path - The path to compare for active styling
   * @returns {string} - The appropriate classes for the navigation link
   */
  const linkClasses = (path) =>
    `px-3 py-2 rounded-lg transition-colors ${
      isActive(path)
        ? "bg-white text-blue-700 font-bold shadow-sm"
        : "text-white hover:text-blue-100 hover:bg-blue-700"
    }`;

  return (
    <nav className="bg-blue-600 shadow-lg sticky top-0 z-50">
      <div
        dir="rtl"
        className="container mx-auto px-4 py-3 flex justify-between items-center relative text-right"
      >
        {/* Right Side: Account & Brand */}
        <div className="flex items-center gap-15">
          <button
            onClick={() => setShowAccountMenu(true)}
            className="flex items-center gap-1 text-white hover:text-blue-100 font-medium"
          >
            <FiUser className="text-lg" />
            {currentUser ? currentUser.name : "התחברות"}
          </button>

          <Link
            to="/"
            className="flex items-center gap-2 text-3xl font-bold text-white transition-transform hover:scale-105 hover:text-blue-100"
          >
            <img src="/logo.png" alt="Smart Cart Logo" className="w-8 h-8" />
            Smart Cart
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="md:flex hidden items-center space-x-6 text-sm">
          <Link to="/" className={linkClasses("/")}>
            דף הבית
          </Link>
          <Link to="/products" className={linkClasses("/products")}>
            כלל המוצרים
          </Link>
          {currentUser && (
            <>
              <Link to="/top-products" className={linkClasses("/top-products")}>
                המוצרים המובילים
              </Link>
              <Link to="/saved-carts" className={linkClasses("/saved-carts")}>
                עגלות שמורות
              </Link>
            </>
          )}
          <Link
            to="/cart"
            className={`${linkClasses("/cart")} flex items-center`}
          >
            <FiShoppingCart className="mr-1" />
            עגלה
            {cart.length > 0 && (
              <span className="bg-red-600 text-white rounded-full px-2 ml-2 text-xs font-semibold">
                {cart.length}
              </span>
            )}
          </Link>
        </div>

        {/* Account Modal */}
        {showAccountMenu && (
          <div className="fixed inset-0 bg-black/30 z-50 flex items-start justify-center pt-24">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-[90%] max-w-sm relative text-center flex flex-col items-center">
              <button
                onClick={() => setShowAccountMenu(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>

              {/* Logo + App Name */}
              <div className="mb-6 flex items-center gap-2">
                <img src="/logo.png" alt="Logo" className="w-10 h-10" />
                <h2 className="text-2xl font-extrabold text-blue-700">
                  Smart Cart
                </h2>
              </div>

              {/* Greeting */}
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {currentUser ? `שלום, ${currentUser.name}` : "ברוכים הבאים!"}
              </h3>

              {/* Action Buttons */}
              <div className="w-full space-y-4 mb-8">
                {!currentUser ? (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setShowAccountMenu(false)}
                      className="block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
                    >
                      התחברות 🔐
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setShowAccountMenu(false)}
                      className="block bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition"
                    >
                      הרשמה 📝
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      logout();
                      setShowAccountMenu(false);
                    }}
                    className="block w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition"
                  >
                    התנתק
                  </button>
                )}
              </div>

              {/* Bottom Links */}
              <div className="text-sm text-gray-500 space-y-2 border-t pt-4 w-full">
                <Link
                  to="/terms"
                  onClick={() => setShowAccountMenu(false)}
                  className="block hover:text-blue-600"
                >
                  תנאי שימוש
                </Link>
                <Link
                  to="/privacy"
                  onClick={() => setShowAccountMenu(false)}
                  className="block hover:text-blue-600"
                >
                  מדיניות פרטיות
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
