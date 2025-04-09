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

// Routes
router.post("/", jwtAuthMiddleware, createCandidate);
router.get("/", getAllCandidates);
router.put("/:candidateId", jwtAuthMiddleware, updateCandidate);
router.delete("/:candidateId", jwtAuthMiddleware, deleteCandidate);
router.post("/:vote/:candidateId", jwtAuthMiddleware, voteForCandidate);
router.get("/vote/count", getVoteCounts);

module.exports = router;
