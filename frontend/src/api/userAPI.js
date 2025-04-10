import axios from "axios";

/**
 * API URL for user endpoints
 * @type {string}
 */
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Helper function to get authentication token
 *
 * @returns {string|null} The authentication token or null if not found
 */
const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * Get the current user's profile information
 *
 * @returns {Promise<Object>} The user profile data
 * @throws {Error} If fetching the profile fails
 */
export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/user/profile`, {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": getToken(),
      },
    });

    if (!response.data) {
      throw new Error("No user data received");
    }

    return response.data;
  } catch (err) {
    console.error("Error fetching user profile:", err);
    throw err;
  }
};

/**
 * Update the current user's profile information
 *
 * @param {Object} userData - The user data to update
 * @param {string} [userData.name] - User's name
 * @param {string} [userData.email] - User's email
 * @param {Object} [userData.preferences] - User preferences
 * @returns {Promise<Object>} The updated user data
 * @throws {Error} If the update fails
 */
export const updateUserProfile = async (userData) => {
  try {
    const response = await axios.put(`${API_URL}/user/profile`, userData, {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": getToken(),
      },
    });

    if (!response.data) {
      throw new Error("No user data received after update");
    }

    return response.data;
  } catch (err) {
    console.error("Error updating user profile:", err);
    throw err;
  }
};

/**
 * Change the current user's password
 *
 * @param {string} currentPassword - The current password
 * @param {string} newPassword - The new password
 * @returns {Promise<Object>} Response data
 * @throws {Error} If the password change fails
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await axios.put(
      `${API_URL}/user/change-password`,
      {
        currentPassword,
        newPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": getToken(),
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("Error changing password:", err);
    throw err;
  }
};

/**
 * Delete the current user's account
 *
 * @returns {Promise<Object>} Response data
 * @throws {Error} If the account deletion fails
 */
export const deleteAccount = async () => {
  try {
    const response = await axios.delete(`${API_URL}/user/account`, {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": getToken(),
      },
    });

    return response.data;
  } catch (err) {
    console.error("Error deleting account:", err);
    throw err;
  }
};

/**
 * Get the activities/history for the current user
 *
 * @param {Object} options - Query options
 * @param {number} [options.page=1] - Page number for pagination
 * @param {number} [options.limit=10] - Number of items per page
 * @returns {Promise<Object>} User activity data with pagination
 * @throws {Error} If fetching activities fails
 */
export const getUserActivities = async (options = { page: 1, limit: 10 }) => {
  try {
    const { page, limit } = options;
    const response = await axios.get(
      `${API_URL}/user/activities?page=${page}&limit=${limit}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": getToken(),
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("Error fetching user activities:", err);
    throw err;
  }
};

/**
 * Upload a profile picture for the current user
 *
 * @param {FormData} formData - Form data containing the image file
 * @returns {Promise<Object>} Response with the uploaded image URL
 * @throws {Error} If the upload fails
 */
export const uploadProfilePicture = async (formData) => {
  try {
    const response = await axios.post(
      `${API_URL}/user/profile-picture`,
      formData,
      {
        headers: {
          "x-auth-token": getToken(),
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("Error uploading profile picture:", err);
    throw err;
  }
};
