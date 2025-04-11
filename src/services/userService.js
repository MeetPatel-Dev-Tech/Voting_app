import User from "../models/user.js";

// Create user
export const createUser = async (data) => {
  const newUser = new User(data);
  return await newUser.save();
};

// Find user by Aadhar number
export const findByAadhar = async (aadharCardNumber) => {
  return await User.findOne({ aadharCardNumber });
};

// Find user by ID
export const findUserById = async (id) => {
  return await User.findById(id);
};

// Find one admin user
export const findExistingAdmin = async () => {
  return await User.findOne({ role: "admin" });
};

// Find one admin user
export const findExistingUser = async (aadharCardNumber) => {
  return await User.findOne({ aadharCardNumber: aadharCardNumber });
};

// Update and save user
export const updateUser = async (userDoc, newData) => {
  Object.assign(userDoc, newData);
  return await userDoc.save();
};

// Delete user
export const deleteUserById = async (id) => {
  return await User.findByIdAndDelete(id);
};
