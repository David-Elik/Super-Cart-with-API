import React, { createContext, useState, useContext, useEffect } from "react";
import {
  getAllProducts,
  getAllCategories,
  getProductsByCategory as fetchProductsByCategory,
  getTopProducts as fetchTopProducts,
  searchProducts as fetchSearchProducts,
} from "../api/productAPI";

/**
 * Context for managing product data, categories, and search functionality
 * @type {React.Context}
 */
const ProductContext = createContext();

/**
 * Provider component for managing products, categories, and search functionality
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Provider component
 */
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]); // All available products
  const [categories, setCategories] = useState([]); // All available product categories
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [error, setError] = useState(null); // Error state for API calls

  // Fetch all products and categories when component mounts
  useEffect(() => {
    fetchInitialData();
  }, []);

  /**
   * Fetch initial product data (products and categories)
   */
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      // Fetch products and categories in parallel
      const [productsData, categoriesData] = await Promise.all([
        getAllProducts(),
        getAllCategories(),
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
      setError(null);
    } catch (err) {
      setError("Error fetching products data: " + err.message);
      console.error("Error fetching products data:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get products by category from local state or API
   *
   * @param {string} category - Category to filter products by
   * @returns {Array} - List of products in the specified category
   */
  const getProductsByCategory = async (category) => {
    try {
      setLoading(true);
      if (products.length > 0) {
        const filteredProducts = products.filter(
          (product) => product.category === category
        );
        if (filteredProducts.length > 0) {
          return filteredProducts;
        }
      }
      const categoryProducts = await fetchProductsByCategory(category);
      setError(null);
      return categoryProducts;
    } catch (err) {
      setError(
        `Error fetching products by category ${category}: ${err.message}`
      );
      console.error("Error fetching products by category:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get top products based on a given sorting criterion
   *
   * @param {string} sortBy - Sorting criterion (e.g., "cheapest")
   * @param {number} amount - Number of top products to fetch
   * @returns {Array} - List of top products based on the criteria
   */
  const getTopProducts = async (sortBy = "cheapest", amount = 10) => {
    try {
      setLoading(true);
      if (
        products.length > 0 &&
        (sortBy === "cheapest" || sortBy === "highest different")
      ) {
        const sortFunctions = {
          cheapest: (a, b) =>
            Math.min(...Object.values(a.prices)) -
            Math.min(...Object.values(b.prices)),
          "highest different": (a, b) => {
            const diffA =
              Math.max(...Object.values(a.prices)) -
              Math.min(...Object.values(a.prices));
            const diffB =
              Math.max(...Object.values(b.prices)) -
              Math.min(...Object.values(b.prices));
            return diffB - diffA;
          },
        };
        const sorted = [...products].sort(sortFunctions[sortBy]);
        return sorted.slice(0, amount);
      }
      const topProducts = await fetchTopProducts(sortBy, amount);
      setError(null);
      return topProducts;
    } catch (err) {
      setError(`Error fetching top products: ${err.message}`);
      console.error("Error fetching top products:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Search products based on a query string
   *
   * @param {string} query - Search query
   * @returns {Array} - List of products that match the search query
   */
  const searchProducts = async (query) => {
    try {
      setLoading(true);
      const results = await fetchSearchProducts(query);
      setError(null);
      return results;
    } catch (err) {
      setError(`Error searching products: ${err.message}`);
      console.error("Error searching products:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh product data by re-fetching all products and categories
   */
  const refreshProducts = async () => {
    await fetchInitialData();
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        loading,
        error,
        getProductsByCategory,
        getTopProducts,
        searchProducts,
        refreshProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

/**
 * Custom hook for accessing the product context
 *
 * @returns {Object} The product context value
 * @throws {Error} If used outside of ProductProvider
 */
export const useProducts = () => useContext(ProductContext);
