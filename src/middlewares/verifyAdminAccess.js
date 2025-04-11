import * as candidateService from "../services/candidateService.js";
import logger from "../utils/logger.js";
import { errorResponse } from "../utils/responseHandler.js";

const verifyAdminAccess = async (req, res, next) => {
  try {
    const isAdmin = await candidateService.checkAdminRole(req.user.id);

    if (!isAdmin) {
      return errorResponse(res, "User does not have admin access", 403);
    }

    next(); // User is admin, proceed
  } catch (error) {
    logger.error("Error in checkAdminRole middleware:", error);
    return errorResponse(res, "Internal Server Error");
  }
};

export default verifyAdminAccess;
