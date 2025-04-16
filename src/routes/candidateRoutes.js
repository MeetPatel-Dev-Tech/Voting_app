import express from "express";
const router = express.Router();

import {
  createCandidate,
  getAllCandidates,
  updateCandidate,
  deleteCandidate,
  voteForCandidate,
  getVoteCounts,
} from "../controllers/candidateControllers.js";

import { jwtAuthMiddleware } from "../middlewares/auth/jwt.js";
import yupValidator from "../middlewares/yupValidator.js";
import { upload } from "../middlewares/upload.js";

import {
  createCandidateSchema,
  updateCandidateSchema,
  candidateIdParamSchema,
  voteParamsSchema,
} from "../validators/candidateSchemas.js";
import verifyAdminAccess from "../middlewares/verifyAdminAccess.js";

// Create a new candidate (Admin only)
router.post(
  "/",
  jwtAuthMiddleware,
  upload.single("image"), // field name must match Postman
  yupValidator(createCandidateSchema, "body"),
  verifyAdminAccess,
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
  verifyAdminAccess,
  updateCandidate
);

// Delete candidate by ID (Admin only)
router.delete(
  "/:candidateId",
  jwtAuthMiddleware,
  yupValidator(candidateIdParamSchema, "params"),
  verifyAdminAccess,
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

export default router;
