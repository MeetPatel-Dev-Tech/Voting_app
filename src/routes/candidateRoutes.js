const express = require("express");
const router = express.Router();
const { jwtAuthMiddleware } = require("../middlewares/jwt");
const {
  createCandidate,
  getAllCandidates,
  updateCandidate,
  deleteCandidate,
  voteForCandidate,
  getVoteCounts,
} = require("../controllers/candidateControllers");

// Create a new candidate (Admin only)
router.post("/", jwtAuthMiddleware, createCandidate);

// Get list of all candidates (Public)
router.get("/", getAllCandidates);

// Update candidate details by ID (Admin only)
router.put("/:candidateId", jwtAuthMiddleware, updateCandidate);

// Delete candidate by ID (Admin only)
router.delete("/:candidateId", jwtAuthMiddleware, deleteCandidate);

// Vote for a candidate (Voter only)
router.post("/:vote/:candidateId", jwtAuthMiddleware, voteForCandidate);

// Get total vote counts per candidate
router.get("/vote/count", getVoteCounts);

module.exports = router;
