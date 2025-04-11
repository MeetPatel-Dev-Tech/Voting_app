import { generateToken } from "../middlewares/auth/jwt.js";
import * as userService from "../services/userService.js";
import logger from "../utils/logger.js";

export const signup = async (req, res) => {
  try {
    const { role, ...data } = req.body;

    if (role === "admin") {
      const existingAdmin = await userService.findExistingAdmin();
      if (existingAdmin) {
        return res.status(400).json({ error: "Admin already exists" });
      }
    }

    const savedUser = await userService.createUser(data);
    const token = generateToken({ id: savedUser.id });

    res.status(200).json({ response: savedUser, token });
  } catch (err) {
    logger.error("Error in signup:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { aadharCardNumber, password } = req.body;

    const User = await userService.findByAadhar(aadharCardNumber);

    if (!User || !(await User.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid Username or password" });
    }

    const token = generateToken({ id: User.id });
    res.json({ token });
  } catch (error) {
    logger.error("Error in login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const User = await userService.findUserById(userId);
    res.status(200).json({ User });
  } catch (error) {
    logger.error("Error in getProfile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const User = await userService.findUserById(userId);

    if (!(await User.comparePassword(currentPassword))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    User.password = newPassword;
    await User.save();

    res.status(200).json({ message: "Password updated" });
  } catch (error) {
    logger.error("Error in updatePassword:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password, ...otherData } = req.body;

    const User = await userService.findUserById(userId);

    if (!User) {
      return res.status(404).json({ error: "User Not Found" });
    }

    if (password) {
      User.password = password;
    }

    const updatedUser = await userService.updateUser(User, otherData);

    res
      .status(200)
      .json({ message: "Profile updated successfully", User: updatedUser });
  } catch (error) {
    logger.error("Error in updateProfile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const deleted = await userService.deleteUserById(userId);
    res
      .status(200)
      .json({ message: "User Deleted Successfully", User: deleted });
  } catch (error) {
    logger.error("Error in deleteProfile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
