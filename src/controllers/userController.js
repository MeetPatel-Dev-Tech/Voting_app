const { generateToken } = require("../middlewares/jwt");
const user = require("../models/user");
const logger = require("../utils/logger");

exports.signup = async (req, res) => {
  try {
    const { role, ...data } = req.body;

    if (role === "admin") {
      const existingAdmin = await user.findOne({ role: "admin" });
      if (existingAdmin) {
        return res.status(400).json({ error: "Admin already exists" });
      }
    }

    const newUser = new user(data);
    const savedUser = await newUser.save();
    const token = generateToken({ id: savedUser.id });

    res.status(200).json({ response: savedUser, token });
  } catch (err) {
    logger.error("Error in signup:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { aadharCardNumber, password } = req.body;

    const User = await user.findOne({ aadharCardNumber: aadharCardNumber });

    if (!User || !(await User.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid Username or password" });
    }

    const payload = {
      id: User.id,
    };
    const token = generateToken(payload);
    res.json({ token });
  } catch (error) {
    logger.error("Error in login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData.id;
    const User = await user.findById(userId);
    res.status(200).json({ User });
  } catch (error) {
    logger.error("Error in getProfile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user; // Extract ID from token
    const { currentPassword, newPassword } = req.body;

    const User = await user.findById(userId);

    if (!(await User.comparePassword(currentPassword))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    User.password = newPassword;
    await User.save();

    res.status(200).json({ message: "Password updated" });
  } catch (error) {
    logger.log("Error in updatePassword:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { password, ...otherData } = req.body;
    const userId = req.user.id;

    // Find the user first
    const User = await user.findById(userId);

    if (!User) {
      return res.status(404).json({ error: "User Not Found" });
    }

    // Update other fields
    Object.assign(User, otherData);

    // If password is present in the request, update it and ensure hashing
    if (password) {
      logger.info("Updating password...");
      User.password = password;
    }

    // Save the document (triggers pre("save") middleware)
    await User.save();

    res.status(200).json({ message: "Profile updated successfully", User });
  } catch (error) {
    logger.error("Error in updateProfile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const User = await user.findByIdAndDelete(userId);
    res.status(200).json({ User });
  } catch (error) {
    logger.error("Error in deleteProfile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
