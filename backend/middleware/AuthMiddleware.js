/**
 * Auth Middleware for Protected Routes
 *
 * This middleware checks if the request contains a valid JWT token in the header.
 * If the token is missing or invalid, the middleware responds with an authorization error.
 * If the token is valid, it decodes the token and attaches the decoded user data to the request object.
 * The next middleware or route handler is then called.
 *
 * @param {Object} req - The incoming request object.
 * @param {Object} res - The outgoing response object.
 * @param {Function} next - The next middleware function to call.
 * @returns {void}
 */
const authMiddleware = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ message: "אין הרשאה, נדרש טוקן" }); // Unauthorized if token is missing
  }

  try {
    // Verify the token using the JWT secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user data to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: "טוקן לא תקין" }); // Unauthorized if token is invalid
  }
};

module.exports = authMiddleware;
