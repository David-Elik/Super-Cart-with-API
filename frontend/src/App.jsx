import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import SavedCartsPage from "./pages/SavedCartsPage";
import ProductsPage from "./pages/ProductsPage";
import TopProductsPage from "./pages/TopProductsPage";
import CartPage from "./pages/CartPage";

/**
 * ProtectedRoute is a wrapper component for protecting routes that require authentication.
 * If the user is not logged in, it redirects them to the login page.
 * If the user is logged in, it renders the requested page.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The child components to be rendered if the user is authenticated.
 * @returns {JSX.Element} The wrapped protected route or a redirection to the login page.
 */
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useUser();

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">טוען...</div>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // If authenticated, show the requested page
  return children;
};

/**
 * AppRoutes defines all routes for the app.
 * It includes both public and protected routes, with conditional rendering based on authentication.
 * Protected routes require the user to be logged in, and will show the login page if the user is not authenticated.
 *
 * @returns {JSX.Element} The routes configuration for the app.
 */
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          path="/saved-carts"
          element={
            <ProtectedRoute>
              <SavedCartsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/top-products" element={<TopProductsPage />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback route for 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

/**
 * The App component is the root of the application.
 * It wraps the entire app in the UserProvider context and renders the AppRoutes component to manage routing.
 *
 * @returns {JSX.Element} The root application component with context and routes.
 */
function App() {
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  );
}

export default App;
