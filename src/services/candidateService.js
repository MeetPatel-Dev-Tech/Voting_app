import Candidate from "../models/candidate.js";
import User from "../models/user.js";
import logger from "../utils/logger.js";

// Utility function to check if user is an admin
export const checkAdminRole = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user && user.role === "admin";
  } catch (error) {
    logger.error("Error in admin-check:", error);
    return false;
  }
};

// Create a new candidate
export const createCandidate = async (data) => {
  const newCandidate = new Candidate(data);
  return await newCandidate.save();
};

// Fetch all candidates
export const getAllCandidates = async () => {
  return await Candidate.find();
};

// Update candidate details
export const updateCandidate = async (candidateId, updateData) => {
  return await Candidate.findByIdAndUpdate(candidateId, updateData, {
    new: true, // return updated document
    runValidators: true, // run schema validations
  });
};

// Delete a candidate by ID
export const deleteCandidate = async (candidateId) => {
  return await Candidate.findByIdAndDelete(candidateId);
};

// Vote for a candidate
export const voteForCandidate = async (candidateId, userId) => {
  const candidate = await Candidate.findById(candidateId);
  if (!candidate) throw new Error("Candidate Not Found");

  const voter = await User.findById(userId);
  if (!voter) throw new Error("User Not Found");

  if (voter.isVoted) throw new Error("You have already voted");
  if (voter.role === "admin") throw new Error("Admin is not allowed to vote");

  // Register vote
  candidate.votes.push({ user: userId });
  candidate.voteCount++;
  await candidate.save();

  // Mark user as voted
  voter.isVoted = true;
  await voter.save();

  return { message: "Vote recorded successfully" };
};

// Return vote counts for all candidates sorted by most votes
export const getVoteCounts = async () => {
  const candidates = await Candidate.find().sort({ voteCount: -1 });
  return candidates.map((c) => ({
    party: c.party,
    count: c.voteCount,
  }));
};
