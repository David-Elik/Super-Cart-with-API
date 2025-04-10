import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

/**
 * Layout component for the page structure, including a navigation bar, dynamic content, and footer.
 * This component acts as a wrapper for all pages and ensures consistent layout and structure across the application.
 *
 * @returns {JSX.Element} Layout component containing Navbar, dynamic content (via Outlet), and Footer
 */
const Layout = () => {
  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 flex flex-col text-right">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <Outlet />
      </main>
      <footer className="bg-blue-900 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm">
          <span className="font-semibold">השוואת מחירים בין סופרמרקטים. </span>
          כל הזכויות שמורות, 2025&copy;
        </div>
      </footer>
    </div>
  );
};

export default Layout;
