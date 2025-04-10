const User = require("../models/user");

// Create user
const createUser = async (data) => {
  const newUser = new User(data);
  return await newUser.save();
};

// Find user by Aadhar number
const findByAadhar = async (aadharCardNumber) => {
  return await User.findOne({ aadharCardNumber });
};

// Find user by ID
const findUserById = async (id) => {
  return await User.findById(id);
};

// Find one admin user
const findExistingAdmin = async () => {
  return await User.findOne({ role: "admin" });
};

// Update and save user
const updateUser = async (userDoc, newData) => {
  Object.assign(userDoc, newData);
  return await userDoc.save();
};

// Delete user
const deleteUserById = async (id) => {
  return await User.findByIdAndDelete(id);
};

module.exports = {
  createUser,
  findByAadhar,
  findUserById,
  findExistingAdmin,
  updateUser,
  deleteUserById,
};
