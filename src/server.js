import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";
import logger from "./utils/logger.js";
import db from "./config/db.js";

dotenv.config(); // Load environment variables from .env file

const PORT = process.env.PORT || 3000;

// Start the HTTP server
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Graceful shutdown handler
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Closing server and DB connection...`);

  server.close(async () => {
    logger.info("HTTP server closed");

    try {
      await mongoose.connection.close(false);
      logger.info("MongoDB connection closed");
      process.exit(0);
    } catch (err) {
      logger.error("Error during MongoDB shutdown:", err);
      process.exit(1);
    }
  });
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
