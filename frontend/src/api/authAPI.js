import axios from "axios";

/**
 * API URL for authentication endpoints
 * @type {string}
 */
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Set the authentication token for all future API requests
 *
 * @param {string} token - The authentication token
 */
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["x-auth-token"] = token;
  }
};

/**
 * Remove the authentication token from API request headers
 */
export const removeAuthToken = () => {
  delete axios.defaults.headers.common["x-auth-token"];
};

/**
 * Authenticate a user with email and password
 *
 * @param {string} email - The user's email address
 * @param {string} password - The user's password
 * @returns {Promise<Object>} The user data and authentication token
 * @throws {Error} If authentication fails
 */
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    console.log("Login successful:", response.data);

    if (!response.data.token) {
      throw new Error("No token received from server");
    }

    // Set the token in local storage and axios headers
    localStorage.setItem("token", response.data.token);
    setAuthToken(response.data.token);

    return response.data;
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
};

/**
 * Register a new user with the provided information
 *
 * @param {string} name - The user's full name
 * @param {string} email - The user's email address
 * @param {string} password - The user's password
 * @returns {Promise<Object>} The user data and authentication token
 * @throws {Error} If registration fails
 */
export const registerUser = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      name,
      email,
      password,
    });

    console.log("Registration successful:", response.data);

    // If registration returns a token, set it
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      setAuthToken(response.data.token);
    }

    return response.data;
  } catch (err) {
    console.error("Registration error:", err);
    throw err;
  }
};

/**
 * Log out the current user by removing authentication data
 */
export const logoutUser = () => {
  localStorage.removeItem("token");
  removeAuthToken();
};

/**
 * Request a password reset for the given email address
 *
 * @param {string} email - The email address to reset password for
 * @returns {Promise<Object>} Response data
 * @throws {Error} If the password reset request fails
 */
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, {
      email,
    });
    return response.data;
  } catch (err) {
    console.error("Password reset request error:", err);
    throw err;
  }
};

/**
 * Reset a password using the provided token
 *
 * @param {string} token - The password reset token
 * @param {string} newPassword - The new password
 * @returns {Promise<Object>} Response data
 * @throws {Error} If the password reset fails
 */
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/auth/reset-password`, {
      token,
      password: newPassword,
    });
    return response.data;
  } catch (err) {
    console.error("Password reset error:", err);
    throw err;
  }
};

/**
 * Refresh the authentication token
 *
 * @returns {Promise<string>} The new authentication token
 * @throws {Error} If token refresh fails
 */
export const refreshToken = async () => {
  try {
    const response = await axios.post(`${API_URL}/auth/refresh-token`);

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      setAuthToken(response.data.token);
    }

    return response.data.token;
  } catch (err) {
    console.error("Token refresh error:", err);
    throw err;
  }
};

/**
 * Check if a user email already exists in the system
 *
 * @param {string} email - The email to check
 * @returns {Promise<boolean>} True if email exists, false otherwise
 */
export const checkEmailExists = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/auth/check-email`, { email });
    return response.data.exists;
  } catch (err) {
    console.error("Email check error:", err);
    return false;
  }
};
