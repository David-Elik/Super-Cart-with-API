import axios from "axios";

/**
 * Registers a new user with the provided information
 *
 * @param {string} name - The user's full name
 * @param {string} email - The user's email address
 * @param {string} password - The user's password
 * @returns {Promise<Object>} - The user data and authentication token
 * @throws {Error} - If registration fails
 */
export const registerUser = async (name, email, password) => {
  try {
    const response = await axios.post("/api/auth/register", {
      name,
      email,
      password,
    });

    console.log("Registration successful:", response.data);
    return response.data;
  } catch (err) {
    console.error("Registration error:", err);
    throw err;
  }
};

/**
 * Verifies if a user email already exists in the system
 *
 * @param {string} email - The email to check
 * @returns {Promise<boolean>} - True if email exists, false otherwise
 */
export const checkEmailExists = async (email) => {
  try {
    const response = await axios.post("/api/auth/check-email", { email });
    return response.data.exists;
  } catch (err) {
    console.error("Email check error:", err);
    return false;
  }
};
