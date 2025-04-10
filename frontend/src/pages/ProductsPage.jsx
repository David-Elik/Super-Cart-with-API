import React, { useState, useEffect } from "react";
import { useProducts } from "../context/ProductContext";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import { FiSearch } from "react-icons/fi";

/**
 * ProductsPage component displays a list of products with filtering and searching options.
 * It allows users to:
 * - Search for products by name or barcode.
 * - Filter products by category.
 * - View detailed product information in a modal when a product is selected.
 * - Load more products as the user scrolls down (infinite scroll).
 *
 * @returns {JSX.Element} The ProductsPage component displaying products, filters, search input, and modals.
 */
const ProductsPage = () => {
  const { products, categories, searchProducts, getProductsByCategory } =
    useProducts(); // Access product data and functions from ProductContext
  const [selectedCategory, setSelectedCategory] = useState(null); // State for selected product category filter
  const [searchQuery, setSearchQuery] = useState(""); // State for the search input
  const [filteredProducts, setFilteredProducts] = useState([]); // State for filtered products based on search or category
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery); // State for debounced search query

  const [searching, setSearching] = useState(false); // State for managing the loading state during search
  const [visibleProducts, setVisibleProducts] = useState(30); // State to track the number of visible products

  const [searchParams] = useSearchParams(); // Hook for accessing search parameters in the URL
  const productId = searchParams.get("id"); // Extract product ID from URL
  const selectedProduct = productId
    ? products.find((p) => String(p.id) === productId) // Find the selected product based on the product ID
    : null;

  // Debounced search query state update
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 700); // Apply debounce of 700ms

    return () => {
      clearTimeout(timeoutId); // Cleanup previous timeout on every change to search query
    };
  }, [searchQuery]);

  // Effect to apply filters (search query or category)
  useEffect(() => {
    const applyFilters = async () => {
      setSearching(true); // Set loading state during search
      try {
        let results = [];

        // Apply search query filter if present
        if (debouncedSearchQuery.trim()) {
          results = await searchProducts(debouncedSearchQuery);
        }
        // Apply category filter if selected
        else if (selectedCategory) {
          results = await getProductsByCategory(selectedCategory);
        }
        // If no filter is applied, show all products
        else {
          results = products;
        }

        setFilteredProducts(results); // Update the filtered products state
      } catch (error) {
        console.error("Error applying filters:", error);
        setFilteredProducts([]); // Handle error by clearing the filtered products list
      } finally {
        setSearching(false); // Stop loading state after applying filters
      }
    };

    applyFilters();
  }, [
    debouncedSearchQuery,
    selectedCategory,
    products,
    searchProducts,
    getProductsByCategory,
  ]);

  // Handle loading more products on scroll
  const loadMoreProducts = () => {
    if (visibleProducts < filteredProducts.length) {
      setVisibleProducts((prev) => prev + 30); // Load 30 more products
    }
  };

  // Effect to handle infinite scroll logic
  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight;
      if (bottom) {
        loadMoreProducts(); // Load more products when scrolled to the bottom
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up event listener on unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, [filteredProducts, visibleProducts]);

  /**
   * Handles changes to the search input.
   *
   * @param {Event} e - The event object triggered by the user input.
   */
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value); // Update search query state
  };

  return (
    <div dir="rtl" className="px-[5%] text-right">
      <h1 className="text-3xl font-bold mb-6">מוצרים</h1>
      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        {/* Category Filter */}
        <div>
          <label className="mr-2 font-medium">קטגוריה: </label>
          <select
            onChange={(e) => {
              setSelectedCategory(e.target.value || null);
              setSearchQuery(""); // Clear search query when changing category
            }}
            className="p-2 border rounded-md"
          >
            <option value="">הכל</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 w-full max-w-md">
          <FiSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="חיפוש לפי שם מוצר או ברקוד"
            value={searchQuery}
            onChange={handleSearchChange} // Update search query on input change
            className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-400"
          />
        </div>
      </div>
      {/* Products */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredProducts.slice(0, visibleProducts).map((product) => (
            <ProductCard
              key={product.id || `product-${Math.random()}`}
              product={product} // Display each product using the ProductCard component
            />
          ))}
        </div>
      ) : (
        !searching && (
          <p className="text-gray-500 italic text-center py-10">
            לא נמצאו מוצרים שתואמים את החיפוש
          </p>
        ) // Display message if no products match the search or category
      )}
      {/* Modal (if ID is in URL) */}
      {selectedProduct && <ProductModal product={selectedProduct} />}{" "}
      {/* Show product modal if selected */}
    </div>
  );
};

export default ProductsPage;
