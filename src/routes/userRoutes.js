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

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", jwtAuthMiddleware, getProfile);
router.put("/profile", jwtAuthMiddleware, updateProfile);
router.put("/profile/password", jwtAuthMiddleware, updatePassword);
router.delete("/profile", jwtAuthMiddleware, deleteProfile);

module.exports = router;
