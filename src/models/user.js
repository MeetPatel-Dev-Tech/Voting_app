const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const logger = require("../utils/logger");

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
    require: true,
    default: false,
  },
});

// Hash password before saving the user
userSchema.pre("save", async function (next) {
  const user = this;
  if (!this.isModified("password")) {
    logger.info("Password not modified, skipping hashing");
    return next();
  }

  logger.info("Hashing password...");
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    user.password = hashedPassword;
    next();
  } catch (error) {
    logger.error("Error while hashing password: " + error.message);
    return next(error);
  }
});

// Compare plain password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    logger.error("Password comparison failed: " + error.message);
    throw error;
  }
};

const user = mongoose.model("User", userSchema);
module.exports = user;
