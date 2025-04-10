const Candidate = require("../models/candidate");
const User = require("../models/user");
const logger = require("../utils/logger");

// Utility function to check if user is an admin
exports.checkAdminRole = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user && user.role === "admin";
  } catch (error) {
    logger.error("Error in admin-check:", error);
    return false;
  }
};

// Create a new candidate
exports.createCandidate = async (data) => {
  const newCandidate = new Candidate(data);
  return await newCandidate.save();
};

// Fetch all candidates
exports.getAllCandidates = async () => {
  return await Candidate.find();
};

// Update candidate details
exports.updateCandidate = async (candidateId, updateData) => {
  return await Candidate.findByIdAndUpdate(candidateId, updateData, {
    new: true, // return updated document
    runValidators: true, // run schema validations
  });
};

// Delete a candidate by ID
exports.deleteCandidate = async (candidateId) => {
  return await Candidate.findByIdAndDelete(candidateId);
};

// Vote for a candidate
exports.voteForCandidate = async (candidateId, userId) => {
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
exports.getVoteCounts = async () => {
  const candidates = await Candidate.find().sort({ voteCount: -1 }); // descending
  return candidates.map((c) => ({
    party: c.party,
    count: c.voteCount,
  }));
};
