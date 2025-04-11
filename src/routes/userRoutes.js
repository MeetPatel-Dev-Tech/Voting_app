const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getProfile,
  updateProfile,
  updatePassword,
  deleteProfile,
} = require("../controllers/userController");
const { jwtAuthMiddleware } = require("../middlewares/auth/jwt");
const yupValidator = require("../middlewares/yupValidator");
const {
  signupSchema,
  loginSchema,
  updateProfileSchema,
  updatePasswordSchema,
  profileQuerySchema,
} = require("../validators/userSchemas");

// User registration
router.post("/signup", yupValidator(signupSchema, "body"), signup);

// User login
router.post("/login", yupValidator(loginSchema, "body"), login);

// Get authenticated user's profile
router.get(
  "/profile",
  jwtAuthMiddleware,
  yupValidator(profileQuerySchema, "query"),
  getProfile
);

// Update authenticated user's profile
router.put(
  "/profile",
  jwtAuthMiddleware,
  yupValidator(updateProfileSchema, "body"),
  updateProfile
);

// Update password for authenticated user
router.put(
  "/profile/password",
  jwtAuthMiddleware,
  yupValidator(updatePasswordSchema, "body"),
  updatePassword
);

// Delete authenticated user's profile
router.delete("/profile", jwtAuthMiddleware, deleteProfile);

module.exports = router;
