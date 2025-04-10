import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { registerUser } from "../api/registerAPI";

// Validation patterns
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const NAME_REGEX = /^[A-Za-z\u0590-\u05FF\s]{2,30}$/; // Hebrew and English names with spaces

/**
 * RegisterPage provides the user registration form.
 * It includes form validation for name, email, password, and confirm password fields.
 * Upon successful registration, the user is logged in and redirected to the home page.
 *
 * @returns {JSX.Element} RegisterPage component with form fields, validation, and error handling.
 */
const RegisterPage = () => {
  const { login } = useUser(); // Access login function from UserContext
  const navigate = useNavigate(); // Hook for navigation after successful registration

  const nameRef = useRef(); // Ref for focusing on the name input field
  const errRef = useRef(); // Ref for displaying error messages

  // Form state for storing user input
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Validation states for name, email, password, and password match
  const [validName, setValidName] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [validMatch, setValidMatch] = useState(false);

  // Focus states to show error messages on focus
  const [nameFocus, setNameFocus] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  // Error and success states
  const [error, setError] = useState(""); // Stores error messages
  const [success, setSuccess] = useState(false); // Indicates successful registration
  const [loading, setLoading] = useState(false); // Manages loading state during registration

  // Set focus on name input field on component mount
  useEffect(() => {
    nameRef.current.focus();
  }, []);

  // Validate name input
  useEffect(() => {
    setValidName(NAME_REGEX.test(form.name));
  }, [form.name]);

  // Validate email input
  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(form.email));
  }, [form.email]);

  // Validate password and confirm password
  useEffect(() => {
    setValidPassword(PWD_REGEX.test(form.password));
    setValidMatch(form.password === form.confirmPassword);
  }, [form.password, form.confirmPassword]);

  // Clear error when form changes
  useEffect(() => {
    setError("");
  }, [form]);

  /**
   * Handle form input changes and update state
   *
   * @param {Event} e - The event object triggered by input changes
   */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Handle form submission for registration.
   * It validates the form inputs and calls the API to register the user.
   * On success, the user is logged in and redirected to the home page.
   *
   * @param {Event} e - The event object triggered by form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Double-check validation before submitting
    if (!validName || !validEmail || !validPassword || !validMatch) {
      setError("נתונים לא תקינים");
      setLoading(false);
      return;
    }

    try {
      // Call the register API function
      const userData = await registerUser(form.name, form.email, form.password);

      setSuccess(true);

      // Log user in with data from response
      login({
        email: form.email,
        name: userData.user.name,
        id: userData.user.id,
        token: userData.token,
      });

      // Clear form
      setForm({ name: "", email: "", password: "", confirmPassword: "" });

      // Redirect to the homepage after short delay
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      if (!err?.response) {
        setError("שרת לא מגיב");
      } else if (err.response?.status === 409) {
        setError("האימייל כבר קיים במערכת");
      } else {
        setError(
          "הרשמה נכשלה: " + (err.response?.data?.message || "שגיאה לא ידועה")
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
        {success ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-3">
              הרשמה הצליחה! 🎉
            </h2>
            <p className="text-gray-600 mb-4">מיד תועבר לדף הבית</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-blue-800 mb-3">הרשמה 📝</h2>
            <p
              ref={errRef}
              className={error ? "text-red-500 text-sm mb-2" : "sr-only"}
              aria-live="assertive"
            >
              {error}
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Name input */}
              <div>
                <input
                  name="name"
                  ref={nameRef}
                  onChange={handleChange}
                  value={form.name}
                  type="text"
                  placeholder="שם מלא"
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    !validName && form.name ? "border-red-500" : ""
                  }`}
                  required
                  aria-invalid={validName ? "false" : "true"}
                  aria-describedby="namenote"
                  onFocus={() => setNameFocus(true)}
                  onBlur={() => setNameFocus(false)}
                />
                <p
                  id="namenote"
                  className={
                    nameFocus && form.name && !validName
                      ? "text-xs text-red-500 mt-1"
                      : "sr-only"
                  }
                >
                  שם צריך להיות לפחות 2 תווים ולהכיל רק אותיות בעברית או אנגלית
                </p>
              </div>

              {/* Email input */}
              <div>
                <input
                  name="email"
                  onChange={handleChange}
                  value={form.email}
                  type="email"
                  placeholder="אימייל"
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    !validEmail && form.email ? "border-red-500" : ""
                  }`}
                  required
                  aria-invalid={validEmail ? "false" : "true"}
                  aria-describedby="emailnote"
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                />
                <p
                  id="emailnote"
                  className={
                    emailFocus && form.email && !validEmail
                      ? "text-xs text-red-500 mt-1"
                      : "sr-only"
                  }
                >
                  כתובת אימייל לא תקינה
                </p>
              </div>

              {/* Password input */}
              <div>
                <input
                  name="password"
                  onChange={handleChange}
                  value={form.password}
                  type="password"
                  placeholder="סיסמה"
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    !validPassword && form.password ? "border-red-500" : ""
                  }`}
                  required
                  aria-invalid={validPassword ? "false" : "true"}
                  aria-describedby="pwdnote"
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={() => setPasswordFocus(false)}
                />
                <p
                  id="pwdnote"
                  className={
                    passwordFocus && !validPassword
                      ? "text-xs text-red-500 mt-1"
                      : "sr-only"
                  }
                >
                  הסיסמה צריכה להיות 8-24 תווים, להכיל אות גדולה, אות קטנה, מספר
                  ותו מיוחד (!@#$%)
                </p>
              </div>

              {/* Confirm password input */}
              <div>
                <input
                  name="confirmPassword"
                  onChange={handleChange}
                  value={form.confirmPassword}
                  type="password"
                  placeholder="אימות סיסמה"
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    !validMatch && form.confirmPassword ? "border-red-500" : ""
                  }`}
                  required
                  aria-invalid={validMatch ? "false" : "true"}
                  aria-describedby="confirmnote"
                  onFocus={() => setMatchFocus(true)}
                  onBlur={() => setMatchFocus(false)}
                />
                <p
                  id="confirmnote"
                  className={
                    matchFocus && !validMatch
                      ? "text-xs text-red-500 mt-1"
                      : "sr-only"
                  }
                >
                  הסיסמאות אינן תואמות
                </p>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md font-semibold transition"
                disabled={
                  !validName ||
                  !validEmail ||
                  !validPassword ||
                  !validMatch ||
                  loading
                }
              >
                {loading ? "נרשם..." : "הירשם"}
              </button>
            </form>

            <div className="text-sm text-gray-600 mt-3">
              כבר יש לך חשבון?
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-800 font-semibold mr-1"
              >
                התחבר כאן
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
