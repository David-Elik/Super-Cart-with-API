/**
 * API base URL for cart endpoints
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
 * Retrieve all saved carts for the authenticated user
 *
 * @returns {Promise<Array>} Array of saved cart objects
 * @throws {Error} If the user is not logged in or fetch operation fails
 */
export const getSavedCarts = async () => {
  const token = getToken();
  if (!token) throw new Error("Unauthorized: User not logged in");

  try {
    const response = await fetch(`${API_URL}/cart`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch saved carts");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getSavedCarts:", error);
    throw error;
  }
};

/**
 * Retrieve a specific saved cart by its ID
 *
 * @param {string} cartId - The ID of the cart to fetch
 * @returns {Promise<Object>} The cart data
 * @throws {Error} If the user is not logged in, cart cannot be found, or fetch fails
 */
export const getSavedCartById = async (cartId) => {
  const token = getToken();
  if (!token) throw new Error("Unauthorized: User not logged in");

  try {
    const response = await fetch(`${API_URL}/cart/${cartId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch cart");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getSavedCartById:", error);
    throw error;
  }
};

/**
 * Save a cart to the database
 *
 * @param {Object} cartData - The cart data to save
 * @param {Array} cartData.items - Array of cart items
 * @param {string} [cartData.name] - Optional name for the saved cart
 * @returns {Promise<Object>} The saved cart data with ID
 * @throws {Error} If the user is not logged in or save operation fails
 */
export const saveCartToDB = async (cartData) => {
  const token = getToken();
  if (!token) throw new Error("Unauthorized: User not logged in");

  try {
    const response = await fetch(`${API_URL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify(cartData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to save cart");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in saveCartToDB:", error);
    throw error;
  }
};

/**
 * Update an existing saved cart
 *
 * @param {string} cartId - The ID of the cart to update
 * @param {Object} cartData - The updated cart data
 * @param {Array} cartData.items - Array of cart items
 * @param {string} [cartData.name] - Optional name for the saved cart
 * @returns {Promise<Object>} The updated cart data
 * @throws {Error} If the user is not logged in, cart cannot be found, or update fails
 */
export const updateSavedCart = async (cartId, cartData) => {
  const token = getToken();
  if (!token) throw new Error("Unauthorized: User not logged in");

  try {
    const response = await fetch(`${API_URL}/cart/${cartId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify(cartData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update cart");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in updateSavedCart:", error);
    throw error;
  }
};

/**
 * Delete a saved cart
 *
 * @param {string} cartId - The ID of the cart to delete
 * @returns {Promise<Object>} The response data confirming deletion
 * @throws {Error} If the user is not logged in, cart cannot be found, or deletion fails
 */
export const deleteSavedCart = async (cartId) => {
  const token = getToken();
  if (!token) throw new Error("Unauthorized: User not logged in");
  try {
    const response = await fetch(`${API_URL}/cart/${cartId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete cart");
    }
    return await response.json();
  } catch (error) {
    console.error("Error in deleteSavedCart:", error);
    throw error;
  }
};
