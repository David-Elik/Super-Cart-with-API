import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";
import { UserProvider } from "./context/UserContext";

/**
 * The entry point of the React application.
 * This file sets up the React app by rendering the `App` component inside the root element.
 * It also wraps the app with necessary context providers (UserProvider, ProductProvider, CartProvider) 
 * and the React Router `BrowserRouter` for handling routing within the app.
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>   {/* Provides user authentication state throughout the app */}
        <ProductProvider> {/* Provides product-related data and functions */}
          <CartProvider> {/* Provides cart-related data and functions */}
            <App /> {/* Main application component */}
          </CartProvider>
        </ProductProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
