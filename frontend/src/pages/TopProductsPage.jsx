import React, { useState, useEffect } from "react";
import { useProducts } from "../context/ProductContext";
import { useUser } from "../context/UserContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

/**
 * TopProductsPage displays a list of top products with options to filter and sort them.
 * The page allows users to choose the number of products to display and the sorting criteria.
 * The products are fetched based on the selected filter and sorted accordingly.
 * The page also checks if the user is logged in and redirects to the login page if not.
 *
 * @returns {JSX.Element} TopProductsPage component with filter and sort options, displaying top products.
 */
const TopProductsPage = () => {
  const { getTopProducts } = useProducts(); // Access top products function from ProductContext
  const { currentUser } = useUser(); // Access user data from UserContext
  const navigate = useNavigate(); // Hook for navigation
  const [searchParams, setSearchParams] = useSearchParams(); // Get and set search params from the URL

  const [amount, setAmount] = useState(
    Number(searchParams.get("amount") || 10)
  ); // Default amount is 10
  const [sortBy, setSortBy] = useState(
    searchParams.get("sortBy") || "cheapest"
  ); // Default sort is "cheapest"
  const [topProducts, setTopProducts] = useState([]); // State for storing top products

  // Use effect to handle user session check and redirect if necessary
  useEffect(() => {
    // Check if user exists in localStorage (or sessionStorage)
    const storedUser = localStorage.getItem("currentUser"); // or use sessionStorage.getItem()

    if (!storedUser) {
      navigate("/login"); // Redirect to login if user is not logged in
    }
  }, [navigate]);

  // Fetch top products whenever sort criteria or amount changes
  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const products = await getTopProducts(sortBy, amount);
        setTopProducts(products); // Update the state with the fetched products
      } catch (error) {
        console.error("Failed to fetch top products:", error); // Handle error if fetching fails
      }
    };

    if (currentUser) {
      fetchTopProducts(); // Fetch products if user is logged in
    }
  }, [getTopProducts, sortBy, amount, currentUser]);

  // Update URL parameters when amount or sortBy changes
  useEffect(() => {
    setSearchParams({ amount, sortBy }); // Set search params in the URL
  }, [amount, sortBy, setSearchParams]);

  return (
    <div dir="rtl" className="mx-auto px-[5%] py-12 text-right">
      <h1 className="text-4xl font-extrabold text-blue-700 text-center mb-10">
        מוצרים מובילים 🌟
      </h1>

      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
        <div>
          <label className="font-medium mr-2">הצג: </label>
          <select
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="p-2 border rounded-md"
          >
            {[3, 5, 10, 15, 20, 30, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-medium mr-2">מיין לפי: </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="cheapest">זול ביותר</option>
            <option value="highest different">הפרש מחירים גדול ביותר</option>
            <option value="most selected">הכי נבחרים</option>
            <option value="highest rated">מדורגים הכי גבוה</option>
          </select>
        </div>
      </div>

      {/* Error State - if no products are available */}
      {topProducts.length === 0 && (
        <div className="text-center py-10">
          <p className="text-lg text-red-500">לא נמצאו מוצרים</p>
        </div>
      )}

      {/* Top Products Grid */}
      {topProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topProducts.map((product) => (
            <ProductCard
              key={product.id || `top-product-${Math.random()}`}
              product={product} // Display each product using the ProductCard component
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TopProductsPage;
