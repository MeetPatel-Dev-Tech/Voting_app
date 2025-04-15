import * as candidateService from "../services/candidateService.js";
import { createLog } from "../utils/dbLogger.js";
import logger from "../utils/logger.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";

// Create a candidate (admin only)
export const createCandidate = async (req, res) => {
  try {
    const { name, party, age } = req.body;

    // Create and return new candidate
    const response = await candidateService.createCandidate(req.body);

    await createLog({
      adminId: req.user.id,
      action: "CREATE_CANDIDATE",
      target: {
        candidateId: response._id,
        name: response.name,
        party: response.party,
      },
      description: `Admin (${req.user.id}) created candidate '${name}' from '${party}' aged ${age}`,
    });

    return successResponse(
      res,
      { candidate: response },
      "Candidate created successfully"
    );
  } catch (error) {
    logger.error("Error in createCandidate:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

// Get all candidates
export const getAllCandidates = async (req, res) => {
  try {
    const response = await candidateService.getAllCandidates();
    return successResponse(
      res,
      { allCadidates: response },
      "All candidates fetched successfully"
    );
  } catch (error) {
    logger.error("Error in getAllCandidates:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

// Update candidate by ID (admin only)
export const updateCandidate = async (req, res) => {
  try {
    const response = await candidateService.updateCandidate(
      req.params.candidateId,
      req.body
    );

    if (!response) {
      return errorResponse(res, "Candidate Not Found", 404);
    }

    await createLog({
      adminId: req.user.id,
      action: "UPDATE_CANDIDATE",
      target: {
        candidateId: response._id,
        name: response.name,
        party: response.party,
      },
      description: `Admin (${req.user.id}) updated candidate '${response.name}' from '${response.party}' aged ${response.age}`,
    });

    return successResponse(
      res,
      { candidate: response },
      "Candidate updated successfully"
    );
  } catch (error) {
    logger.error("Error in updateCandidate:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

// Delete candidate by ID (admin only)
export const deleteCandidate = async (req, res) => {
  try {
    const response = await candidateService.deleteCandidate(
      req.params.candidateId
    );

    if (!response) {
      return errorResponse(res, "Candidate Not Found", 404);
    }

    await createLog({
      adminId: req.user.id,
      action: "DELETE_CANDIDATE",
      target: {
        candidateId: response._id,
        name: response.name,
        party: response.party,
      },
      description: `Admin (${req.user.id}) deleted candidate '${response.name}' from '${response.party}' aged ${response.age}`,
    });

    return successResponse(
      res,
      { candidate: response },
      "Candidate deleted successfully"
    );
  } catch (error) {
    logger.error("Error in deleteCandidate:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

// Vote for candidate (non-admin users only, once per user)
export const voteForCandidate = async (req, res) => {
  try {
    const response = await candidateService.voteForCandidate(
      req.params.candidateId,
      req.user.id
    );
    return successResponse(res, { data: response }, "Voted successfully");
  } catch (error) {
    logger.error("Error in voteForCandidate:", error.message);
    return errorResponse(res, error.message, 400);
  }
};

// Get total vote counts sorted by highest votes
export const getVoteCounts = async (req, res) => {
  try {
    const response = await candidateService.getVoteCounts();
    return successResponse(
      res,
      { data: response },
      "Vote counts fetched successfully"
    );
  } catch (error) {
    logger.error("Error in getVoteCounts:", error);
    return errorResponse(res, "Internal Server Error");
  }
};
