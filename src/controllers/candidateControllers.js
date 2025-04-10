const candidateService = require("../services/candidateService");
const logger = require("../utils/logger");

// Create a candidate (admin only)
exports.createCandidate = async (req, res) => {
  try {
    // Check for admin role
    if (!(await candidateService.checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "User does not have admin role" });
    }

    // Create and return new candidate
    const response = await candidateService.createCandidate(req.body);
    res.status(200).json({ response });
  } catch (error) {
    logger.error("Error in createCandidate:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all candidates
exports.getAllCandidates = async (req, res) => {
  try {
    const response = await candidateService.getAllCandidates();
    res.status(200).json({ response });
  } catch (error) {
    logger.error("Error in getAllCandidates:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update candidate by ID (admin only)
exports.updateCandidate = async (req, res) => {
  try {
    if (!(await candidateService.checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "User does not have admin role" });
    }

    const response = await candidateService.updateCandidate(
      req.params.candidateId,
      req.body
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

// Delete candidate by ID (admin only)
exports.deleteCandidate = async (req, res) => {
  try {
    if (!(await candidateService.checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "User does not have admin role" });
    }

    const response = await candidateService.deleteCandidate(
      req.params.candidateId
    );

    if (!response) {
      return res.status(404).json({ error: "Candidate Not Found" });
    }

    res.status(200).json(response);
  } catch (error) {
    logger.error("Error in deleteCandidate:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Vote for candidate (non-admin users only, once per user)
exports.voteForCandidate = async (req, res) => {
  try {
    const response = await candidateService.voteForCandidate(
      req.params.candidateId,
      req.user.id
    );
    res.status(200).json(response);
  } catch (error) {
    logger.error("Error in voteForCandidate:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Get total vote counts sorted by highest votes
exports.getVoteCounts = async (req, res) => {
  try {
    const response = await candidateService.getVoteCounts();
    res.status(200).json(response);
  } catch (error) {
    logger.error("Error in getVoteCounts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
