import User from "../models/user.js";
import Candidate from "../models/candidate.js";

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

// Find the candidate that a specific user has voted for
export const findCandidateVotedByUser = async (id) => {
  return await Candidate.findOne({ "votes.user": id }, "name _id");
};

// Fetch all users from the database
export const getAllUsers = async (id) => {
  return await User.find().lean();
};

// Fetch all candidates with their vote records
export const getAllCandidatesWithVotes = async (id) => {
  return await Candidate.find({}, "name votes").lean();
};
