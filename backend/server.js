const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");
const cartRoutes = require("./routes/CartRoutes");
const productRoutes = require("./routes/ProductRoutes"); // Add product routes
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json()); // Parses incoming requests with JSON payloads
app.use(cors()); // Enables Cross-Origin Resource Sharing (CORS)

// Routes
app.use("/api/cart", cartRoutes); // Cart routes
app.use("/api/products", productRoutes); // Product routes

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/auth-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Auth middleware for protected routes
/**
 * Auth middleware for verifying JWT token in protected routes.
 * Verifies the token and attaches user data to the request.
 *
 * @param {Request} req - The incoming request object
 * @param {Response} res - The outgoing response object
 * @param {Function} next - The next middleware function
 * @returns {void}
 */
const authMiddleware = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).json({ message: "אין הרשאה, נדרש טוקן" });

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "yourSecretKey"
    );
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "טוקן לא תקין" });
  }
};

// User Schema
/**
 * User schema definition for MongoDB using Mongoose.
 * Represents the user model with required fields for registration and login.
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: { type: String, required: true, minlength: 8 },
  isAdmin: { type: Boolean, default: false }, // Add admin flag
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// Register route
/**
 * Registers a new user in the system by hashing their password and creating a new user document.
 * Generates a JWT token upon successful registration.
 *
 * @param {Object} req.body - The request body containing the user's registration information
 * @param {String} req.body.name - The user's name
 * @param {String} req.body.email - The user's email
 * @param {String} req.body.password - The user's password
 * @returns {Object} - A success response with the token and user details
 */
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "האימייל כבר קיים במערכת" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "yourSecretKey",
      { expiresIn: "7d" }
    );
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "שגיאת שרת" });
  }
});

// Login route
/**
 * Authenticates a user by comparing the provided credentials with stored data.
 * If valid, it generates a JWT token for the user and returns it.
 *
 * @param {Object} req.body - The request body containing the user's login credentials
 * @param {String} req.body.email - The user's email
 * @param {String} req.body.password - The user's password
 * @returns {Object} - A success response with the token and user details
 */
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "אימייל או סיסמה לא נכונים" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "אימייל או סיסמה לא נכונים" });

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || "yourSecretKey",
      { expiresIn: "7d" }
    );
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "שגיאת שרת" });
  }
});

// Get User Profile
/**
 * Retrieves the profile of the authenticated user.
 * Requires a valid JWT token in the request header.
 *
 * @param {Object} req - The request object containing the JWT token
 * @param {Object} res - The response object to return the user profile
 * @returns {Object} - The user's profile excluding the password
 */
app.get("/api/user/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "המשתמש לא נמצא" });
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "שגיאת שרת" });
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("API is running. Use the React frontend to interact with this API.");
});

// Production settings
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
