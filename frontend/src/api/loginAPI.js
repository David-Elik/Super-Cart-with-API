import axios from "axios";

/**
 * Authenticates a user with email and password
 *
 * @param {string} email - The user's email address
 * @param {string} password - The user's password
 * @returns {Promise<Object>} - The user data and authentication token
 * @throws {Error} - If authentication fails
 */
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post("/api/auth/login", {
      email,
      password,
    });

    console.log("Login successful:", response.data);

    if (!response.data.token) {
      throw new Error("No token received from server");
    }

    return response.data;
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
};

/**
 * Requests a password reset for the given email
 *
 * @param {string} email - The email address to reset password for
 * @returns {Promise<Object>} - Response data
 */
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post("/api/auth/forgot-password", { email });
    return response.data;
  } catch (err) {
    console.error("Password reset request error:", err);
    throw err;
  }
};

/**
 * Resets a password with the provided token
 *
 * @param {string} token - The reset token
 * @param {string} newPassword - The new password
 * @returns {Promise<Object>} - Response data
 */
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post("/api/auth/reset-password", {
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
 * Refreshes the authentication token
 *
 * @returns {Promise<string>} - The new token
 */
export const refreshToken = async () => {
  try {
    const response = await axios.post("/api/auth/refresh-token");
    return response.data.token;
  } catch (err) {
    console.error("Token refresh error:", err);
    throw err;
  }
};
