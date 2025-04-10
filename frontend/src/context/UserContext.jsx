import React, { createContext, useState, useContext, useEffect } from "react";
import { getUserProfile } from "../api/userAPI";
import { setAuthToken, removeAuthToken } from "../api/authAPI";

/**
 * Context for user authentication and profile information
 * @type {React.Context}
 */
const UserContext = createContext();

/**
 * Provider component for user authentication and profile management
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Provider component
 */
export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (on app load)
  useEffect(() => {
    /**
     * Verify token and load user data if a token exists in localStorage
     */
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          // Set auth token in API helper
          setAuthToken(token);

          // Verify token is still valid by getting user profile
          const userData = await getUserProfile();

          if (userData) {
            setCurrentUser({
              id: userData._id,
              name: userData.name,
              email: userData.email,
              token,
            });
          }
        }
      } catch (err) {
        console.error(
          "Error during authentication check:",
          err.response?.data?.message || err.message
        );
        localStorage.removeItem("token");
        removeAuthToken();
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  /**
   * Log in a user and store their data in context
   *
   * @param {Object} userData - User data with authentication token
   * @param {string} userData.token - Authentication token
   */
  const login = (userData) => {
    localStorage.setItem("token", userData.token);
    setAuthToken(userData.token);
    setCurrentUser(userData);
  };

  /**
   * Log out the current user and clear authentication data
   */
  const logout = () => {
    localStorage.removeItem("token");
    removeAuthToken();
    setCurrentUser(null);
  };

  return (
    <UserContext.Provider value={{ currentUser, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * Custom hook for accessing the user context
 *
 * @returns {Object} The user context value
 * @throws {Error} If used outside of UserProvider
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
