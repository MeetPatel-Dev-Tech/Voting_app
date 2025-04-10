import { generateToken } from "../middlewares/auth/jwt.js";
import * as userService from "../services/userService.js";
import logger from "../utils/logger.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";

export const signup = async (req, res) => {
  try {
    const { role, aadharCardNumber, ...data } = req.body;

    if (role === "admin") {
      const existingAdmin = await userService.findExistingAdmin();
      if (existingAdmin) {
        return errorResponse(res, "Admin already exists", 400);
      }
    }

    const existingUser = await userService.findExistingUser(aadharCardNumber);
    if (existingUser) {
      return errorResponse(res, "User already registered, kindly login.", 400);
    }

    const savedUser = await userService.createUser({
      role,
      aadharCardNumber,
      ...data,
    });

    const token = generateToken({ id: savedUser.id });

    return successResponse(
      res,
      { user: savedUser, token },
      "Signup successful"
    );
  } catch (err) {
    logger.error("Error in signup:", err);
    return errorResponse(res, "Internal Server Error");
  }
};

export const login = async (req, res) => {
  try {
    const { aadharCardNumber, password } = req.body;

    const User = await userService.findByAadhar(aadharCardNumber);

    if (!User || !(await User.comparePassword(password))) {
      return errorResponse(res, "Invalid username or password", 401);
    }

    const token = generateToken({ id: User.id });
    return successResponse(res, { token }, "Login successful");
  } catch (error) {
    logger.error("Error in login:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const User = await userService.findUserById(userId);
    return successResponse(res, { user: User }, "User profile fetched");
  } catch (error) {
    logger.error("Error in getProfile:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

export const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const User = await userService.findUserById(userId);

    if (!(await User.comparePassword(currentPassword))) {
      return errorResponse(res, "Invalid username or password", 401);
    }

    User.password = newPassword;
    await User.save();

    return successResponse(res, null, "Password updated");
  } catch (error) {
    logger.error("Error in updatePassword:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password, ...otherData } = req.body;

    const User = await userService.findUserById(userId);

    if (!User) {
      return errorResponse(res, "User Not Found", 404);
    }

    if (password) {
      User.password = password;
    }

    const updatedUser = await userService.updateUser(User, otherData);

    return successResponse(
      res,
      { user: updatedUser },
      "Profile updated successfully"
    );
  } catch (error) {
    logger.error("Error in updateProfile:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const deleted = await userService.deleteUserById(userId);
    return successResponse(res, { user: deleted }, "User deleted successfully");
  } catch (error) {
    logger.error("Error in deleteProfile:", error);
    return errorResponse(res, "Internal Server Error");
  }
};
