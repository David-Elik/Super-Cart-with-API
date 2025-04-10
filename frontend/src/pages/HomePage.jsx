import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

/**
 * HomePage displays the main landing page for the application.
 * It shows a welcome message for logged-in users and a general introduction to the product
 * for users who are not logged in. The page includes options to navigate to the products page, cart,
 * and login/register pages based on the user's authentication status.
 *
 * @returns {JSX.Element} HomePage component with a welcome message, navigation buttons, and a call to action.
 */
const HomePage = () => {
  const { currentUser } = useUser(); // Access current user state from UserContext

  return (
    <div className="flex items-center justify-center flex-grow">
      <div className="text-center w-full">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-blue-900 mb-6 leading-tight">
            {currentUser
              ? `ברוך/ה הבא/ה, ${currentUser.name}! 👋`
              : "השוואה חכמה בין מחירים בסופרמרקטים"}
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            {currentUser
              ? "את/ה יכול/ה להשוות מחירים, לבנות עגלות ולשמור אותן לחשבון שלך"
              : "השוו מחירים בין סופרמרקטים שונים, בנו את העגלה שלכם וחסכו כסף עם עוזר הקניות החכם שלנו"}
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/products"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              עיון במוצרים ←
            </Link>

            <Link
              to="/cart"
              className="bg-blue-100 text-blue-800 px-8 py-3 rounded-lg hover:bg-blue-200 transition-all transform hover:-translate-y-1 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              צפייה בעגלה 🛒
            </Link>

            {!currentUser && (
              <>
                <Link
                  to="/login"
                  className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  התחברות 🔐
                </Link>

                <Link
                  to="/register"
                  className="bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-all transform hover:-translate-y-1 shadow-sm hover:shadow-md flex items-center gap-2"
                >
                  הרשמה 📝
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
