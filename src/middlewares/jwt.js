var jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const jwtAuthMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    logger.warn("Token Not Found or Invalid Format");
    return res.status(401).json({ error: "Token Not Found or Invalid Format" });
  }

  const token = authorization.split(" ")[1];
  if (!token) {
    logger.warn("Unauthorized: Token is missing");
    return res.status(401).json({ error: "Unauthorized: Token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error("Error JWT Verification:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};

const generateToken = (userData) => {
  return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: 30000 });
};

module.exports = { jwtAuthMiddleware, generateToken };
