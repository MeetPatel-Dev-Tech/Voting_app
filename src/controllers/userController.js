import { generateToken } from "../middlewares/auth/jwt.js";
import * as userService from "../services/userService.js";
import logger from "../utils/logger.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";
import otpService from "../services/otpService.js";
import { createLog } from "../utils/dbLogger.js";

export const verifyOTPAndSignup = async (req, res) => {
  try {
    const { mobile, role, aadharCardNumber, otp, ...data } = req.body;

    if (!mobile || !otp)
      return errorResponse(res, "Mobile & OTP required", 400);

    if (role === "admin") {
      const existingAdmin = await userService.findExistingAdmin();
      if (existingAdmin) {
        return errorResponse(res, "Admin already exists", 400, {
          aadharCardNumber: existingAdmin.aadharCardNumber,
          role: existingAdmin.role,
        });
      }
    }

    const existingUser = await userService.findExistingUser(aadharCardNumber);
    if (existingUser) {
      return errorResponse(res, "User already registered, kindly login.", 400);
    }

    // Step 1: Verify OTP
    await otpService.verifyOTP(mobile, otp);

    const savedUser = await userService.createUser({
      role,
      aadharCardNumber,
      mobile,
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
    if (err.status) {
      return errorResponse(res, err.message, err.status, err);
    }
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
    if (!User) {
      return errorResponse(res, "User Not Found", 404);
    }

    let votedTo = null;

    if (User.isVoted) {
      const candidate = await userService.findCandidateVotedByUser(userId);

      if (candidate) {
        votedTo = {
          id: candidate.id,
          name: candidate.name,
        };
      }
    }

    const userProfile = {
      User,
      votedTo: votedTo,
    };
    return successResponse(res, { user: userProfile }, "User profile fetched");
  } catch (error) {
    logger.error("Error in getProfile:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

// Get all users along with their voting status and the candidate they voted for
export const getAllUsersWithVoteDetails = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    const candidates = await userService.getAllCandidatesWithVotes();

    // Create a map of userId to candidate
    const userVoteMap = {};

    candidates.forEach((candidate) => {
      candidate.votes.forEach((vote) => {
        userVoteMap[vote.user.toString()] = {
          id: candidate._id,
          name: candidate.name,
        };
      });
    });

    // Append userVoted and votedTo info
    const enrichedUsers = users.map((user) => {
      const votedTo = userVoteMap[user._id.toString()];
      return {
        ...user,
        votedTo: user.isVoted && votedTo ? votedTo : null,
      };
    });
    return successResponse(
      res,
      { users: enrichedUsers },
      "Users profile fetched"
    );
  } catch (error) {
    logger.error("Error in getAllUsersWithVotes:", error);
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
    const user = await userService.findUserById(userId);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    // Prevent deleting an admin
    if (user.role === "admin") {
      return errorResponse(res, "Cannot delete an admin user", 403);
    }
    const deleted = await userService.deleteUserById(userId);
    return successResponse(res, { user: deleted }, "User deleted successfully");
  } catch (error) {
    logger.error("Error in deleteProfile:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

export const deleteUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userService.findUserById(id);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    // Prevent deleting an admin
    if (user.role === "admin") {
      return errorResponse(res, "Cannot delete an admin user", 403);
    }

    const deleted = await userService.deleteUserById(id);

    await createLog({
      adminId: req.user.id,
      action: "DELETE_USER",
      target: id,
      description: `Admin deleted user ${id}`,
    });

    return successResponse(res, { user: deleted }, "User deleted successfully");
  } catch (error) {
    logger.error("Error in deleteProfile:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

export const requestOTP = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) return errorResponse(res, "Mobile number is required", 400);

    // Call otpService to send OTP
    const result = await otpService.sendOTP(mobile); // Assuming Indian numbers
    if (result.success) {
      return successResponse(res, {}, "OTP sent successfully");
    }

    // If OTP sending failed
    return errorResponse(res, "Failed to send OTP", 500);
  } catch (err) {
    logger.error("Error in requestOTP:", err);
    return errorResponse(
      res,
      err.message || "Internal server error",
      err.status || 500
    );
  }
};
