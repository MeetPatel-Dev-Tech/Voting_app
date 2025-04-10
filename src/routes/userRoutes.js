const express = require("express");
const router = express.Router();
const { jwtAuthMiddleware } = require("../middlewares/jwt");
const {
  signup,
  login,
  getProfile,
  updateProfile,
  updatePassword,
  deleteProfile,
} = require("../controllers/userController");

// User registration
router.post("/signup", signup);

// User login
router.post("/login", login);

// Get authenticated user's profile
router.get("/profile", jwtAuthMiddleware, getProfile);

// Update authenticated user's profile
router.put("/profile", jwtAuthMiddleware, updateProfile);

// Update password for authenticated user
router.put("/profile/password", jwtAuthMiddleware, updatePassword);

// Delete authenticated user's profile
router.delete("/profile", jwtAuthMiddleware, deleteProfile);

module.exports = router;
