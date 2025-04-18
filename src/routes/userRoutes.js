import express from "express";
const router = express.Router();

import {
  verifyOTPAndSignup,
  login,
  getProfile,
  updateProfile,
  updatePassword,
  deleteProfile,
  getAllUsersWithVoteDetails,
  requestOTP,
  deleteUserByAdmin,
} from "../controllers/userController.js";

import { jwtAuthMiddleware } from "../middlewares/auth/jwt.js";
import yupValidator from "../middlewares/yupValidator.js";

import {
  signupSchema,
  loginSchema,
  updateProfileSchema,
  updatePasswordSchema,
  profileQuerySchema,
} from "../validators/userSchemas.js";
import verifyAdminAccess from "../middlewares/verifyAdminAccess.js";

router.post("/request-otp", requestOTP);

// User registration
router.post("/signup", yupValidator(signupSchema, "body"), verifyOTPAndSignup);

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

// Admin delete any user by ID
router.delete(
  "/admin/users/:id",
  jwtAuthMiddleware,
  verifyAdminAccess,
  deleteUserByAdmin
);

// Route to fetch all users with voting details (admin access)
router.get(
  "/vote-details",
  jwtAuthMiddleware,
  verifyAdminAccess,
  getAllUsersWithVoteDetails
);

export default router;
