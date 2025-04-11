const express = require("express");
const router = express.Router();
const {
  createCandidate,
  getAllCandidates,
  updateCandidate,
  deleteCandidate,
  voteForCandidate,
  getVoteCounts,
} = require("../controllers/candidateControllers");
const { jwtAuthMiddleware } = require("../middlewares/auth/jwt");
const yupValidator = require("../middlewares/yupValidator");
const {
  createCandidateSchema,
  updateCandidateSchema,
  candidateIdParamSchema,
  voteParamsSchema,
} = require("../validators/candidateSchemas");

// Create a new candidate (Admin only)
router.post(
  "/",
  jwtAuthMiddleware,
  yupValidator(createCandidateSchema, "body"),
  createCandidate
);

// Get list of all candidates (Public)
router.get("/", getAllCandidates);

// Update candidate details by ID (Admin only)
router.put(
  "/:candidateId",
  jwtAuthMiddleware,
  yupValidator(candidateIdParamSchema, "params"),
  yupValidator(updateCandidateSchema, "body"),
  updateCandidate
);

// Delete candidate by ID (Admin only)
router.delete(
  "/:candidateId",
  jwtAuthMiddleware,
  yupValidator(candidateIdParamSchema, "params"),
  deleteCandidate
);

// Vote for a candidate (Voter only)
router.post(
  "/:vote/:candidateId",
  jwtAuthMiddleware,
  yupValidator(voteParamsSchema, "params"),
  voteForCandidate
);

// Get total vote counts per candidate
router.get("/vote/count", getVoteCounts);

module.exports = router;
