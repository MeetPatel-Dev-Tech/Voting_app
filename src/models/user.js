import mongoose from "mongoose";
import bcrypt from "bcrypt";
import logger from "../utils/logger.js";

// Define User schema for voters and admins
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
  },
  mobile: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  aadharCardNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["voter", "admin"],
    default: "voter",
  },
  isVoted: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// Hash password before saving the user
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    logger.info("Password not modified, skipping hashing");
    return next();
  }

  logger.info("Hashing password...");
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    logger.error("Error while hashing password: " + error.message);
    return next(error);
  }
});

// Compare plain password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    logger.error("Password comparison failed: " + error.message);
    throw error;
  }
};

const User = mongoose.model("User", userSchema);
export default User;
