const express = require("express");
const user = require("../models/user");
const candidate = require("../models/candidate");
const logger = require("../utils/logger");

const checkAdminRole = async (userId) => {
  try {
    const User = await user.findById(userId);
    return User.role === "admin";
  } catch (error) {
    logger.error("Error in admin-check:", error);
    return false;
  }
};

exports.createCandidate = async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "user dose not have admin role" });
    }
    const data = req.body; //assuming the body contains person data
    const newCadidate = new candidate(data);
    const response = await newCadidate.save();

    res.status(200).json({ response: response });
  } catch (error) {
    logger.error("Error in createCandidate:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllCandidates = async (req, res) => {
  try {
    const candidateList = await candidate.find();
    res.status(200).json({ response: candidateList });
  } catch (error) {
    logger.error("Error in getAllCandidates:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateCandidate = async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "user dose not have admin role" });
    }
    const canddidateId = req.params.candidateId;
    const updateCandidateData = req.body;

    const response = await candidate.findByIdAndUpdate(
      canddidateId,
      updateCandidateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!response) {
      return res.status(404).json({ error: "Candidate Not Found" });
    }
    res.status(200).json(response);
  } catch (error) {
    logger.error("Error in updateCandidate:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteCandidate = async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "user dose not have admin role" });
    }
    const canddidateId = req.params.candidateId;

    const response = await candidate.findByIdAndDelete(canddidateId);

    if (!response) {
      return res.status(404).json({ error: "Candidate Not Found" });
    }
    res.status(200).json(response);
  } catch (error) {
    logger.error("Error in deleteCandidate:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.voteForCandidate = async (req, res) => {
  const candidateID = req.params.candidateId;
  const userId = req.user.id;

  try {
    const Candidate = await candidate.findById(candidateID);

    if (!Candidate) {
      return res.status(404).json({ error: "Candidate Not Found" });
    }

    const User = await user.findById(userId);

    if (!User) {
      return res.status(404).json({ error: "User Not Found" });
    }
    if (User.isVoted) {
      return res.status(400).json({ error: "You have already voted" });
    }
    if (User.role === "admin") {
      return res.status(404).json({ error: "admin is not allowed" });
    }

    // update candidate documents
    Candidate.votes.push({ user: userId });
    Candidate.voteCount++;
    await Candidate.save();

    // update the user documents
    User.isVoted = true;
    await User.save();

    res.status(200).json({ message: "vote recorded succesfully" });
  } catch (error) {
    logger.error("Error in voteForCandidate:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// vote count

exports.getVoteCounts = async (req, res) => {
  try {
    const Candidate = await candidate.find().sort({ voteCount: "desc" });

    const voteRecord = Candidate.map((data) => {
      return {
        party: data.party,
        count: data.voteCount,
      };
    });

    return res.status(200).json(voteRecord);
  } catch (error) {
    logger.error("Error in getVoteCounts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
