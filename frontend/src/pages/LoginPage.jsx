import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { loginUser } from "../api/loginAPI";

/**
 * LoginPage provides the login form for users to authenticate.
 * It includes fields for email and password, validation, and error handling.
 * On successful login, the user's data is stored in the context, and the user is redirected to the home page.
 *
 * @returns {JSX.Element} LoginPage component with login form, error handling, and redirection on success.
 */
const LoginPage = () => {
  const { login } = useUser(); // Access login function from UserContext
  const navigate = useNavigate(); // Hook for navigation after login

  const emailRef = useRef(); // Ref for focusing on the email input field
  const errRef = useRef(); // Ref for displaying error messages

  const [form, setForm] = useState({ email: "", password: "" }); // Form state for email and password
  const [error, setError] = useState(""); // State for error messages
  const [loading, setLoading] = useState(false); // State for managing loading state during login

  // Set focus on email input on component mount
  useEffect(() => {
    emailRef.current.focus();
  }, []);

  // Clear error message when form changes
  useEffect(() => {
    setError("");
  }, [form]);

  /**
   * Handle form field changes (email and password)
   *
   * @param {Event} e - The event object triggered by input changes
   */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Handles the form submission for login.
   * It calls the login API, handles errors, and stores the user data in context on success.
   *
   * @param {Event} e - The event object triggered by form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call the login API function
      const userData = await loginUser(form.email, form.password);

      // On successful login, store user data in context
      login({
        email: form.email,
        name: userData.user.name,
        id: userData.user.id,
        token: userData.token,
      });

      // Clear form and redirect to the homepage
      setForm({ email: "", password: "" });
      navigate("/"); // Redirect to the home page after login
    } catch (err) {
      if (!err?.response) {
        setError("שרת לא מגיב");
      } else if (err.response?.status === 401) {
        setError("אימייל או סיסמה לא נכונים");
      } else {
        setError(
          "התחברות נכשלה: " + (err.response?.data?.message || "שגיאה לא ידועה")
        );
      }
      errRef.current?.focus(); // Focus on the error message
    } finally {
      setLoading(false); // Stop loading state after request completion
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-blue-800 mb-3">התחברות 🔐</h2>
        <p
          ref={errRef}
          className={error ? "text-red-500 text-sm mb-2" : "sr-only"}
          aria-live="assertive"
        >
          {error}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              name="email"
              ref={emailRef}
              onChange={handleChange}
              value={form.email}
              type="email"
              placeholder="אימייל"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <input
              name="password"
              onChange={handleChange}
              value={form.password}
              type="password"
              placeholder="סיסמה"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md font-semibold transition"
            disabled={loading}
          >
            {loading ? "מתחבר..." : "התחבר"}
          </button>
        </form>

        <div className="text-sm text-gray-600 mt-3">
          אין לך חשבון עדיין?
          <Link
            to="/register"
            className="text-blue-600 hover:text-blue-800 font-semibold mr-1"
          >
            הירשם כאן
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
