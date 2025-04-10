/**
 * API base URL for product endpoints
 * @type {string}
 */
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Helper function to get authentication token from local storage
 *
 * @returns {string|null} The authentication token or null if not found
 */
const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * Retrieve all products from the API
 *
 * @returns {Promise<Array>} Array of product objects
 * @throws {Error} If the fetch operation fails
 */
export const getAllProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch products");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    throw error;
  }
};

/**
 * Retrieve a specific product by its ID
 *
 * @param {string} productId - The ID of the product to fetch
 * @returns {Promise<Object>} The product data
 * @throws {Error} If the product cannot be found or fetch fails
 */
export const getProductById = async (productId) => {
  try {
    const response = await fetch(`${API_URL}/products/${productId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Failed to fetch product with ID: ${productId}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getProductById:", error);
    throw error;
  }
};

/**
 * Retrieve products filtered by category
 *
 * @param {string} category - The category to filter products by
 * @returns {Promise<Array>} Array of products in the specified category
 * @throws {Error} If the fetch operation fails
 */
export const getProductsByCategory = async (category) => {
  try {
    const response = await fetch(`${API_URL}/products/category/${category}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          `Failed to fetch products for category: ${category}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getProductsByCategory:", error);
    throw error;
  }
};

/**
 * Retrieve all available product categories
 *
 * @returns {Promise<Array>} Array of category names
 * @throws {Error} If the fetch operation fails
 */
export const getAllCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/products/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch categories");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getAllCategories:", error);
    throw error;
  }
};

/**
 * Search for products matching a query string
 *
 * @param {string} query - The search query
 * @returns {Promise<Array>} Array of products matching the search criteria
 * @throws {Error} If the search operation fails
 */
export const searchProducts = async (query) => {
  try {
    const response = await fetch(
      `${API_URL}/products/search?q=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to search products");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in searchProducts:", error);
    throw error;
  }
};

/**
 * Retrieve top products based on specified criteria and limit
 *
 * @param {string} criteria - The sorting criteria (e.g., 'rating', 'sales')
 * @param {number} limit - Maximum number of products to return
 * @returns {Promise<Array>} Array of top products
 * @throws {Error} If the fetch operation fails
 */
export const getTopProducts = async (criteria, limit) => {
  try {
    const response = await fetch(
      `${API_URL}/products/top?criteria=${criteria}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch top products");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getTopProducts:", error);
    throw error;
  }
};
