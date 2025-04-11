require("dotenv").config(); // Load environment variables from .env file
const mongoose = require("mongoose");
const app = require("./app");
const logger = require("./utils/logger");
const db = require("./config/db");

const PORT = process.env.PORT || 3000;

// Start the HTTP server
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Graceful shutdown handler
const gracefulShutdown = (signal) => {
  logger.info(`\n🚦 Received ${signal}. Closing server and DB connection...`);

  // Close HTTP server first
  server.close(async () => {
    logger.info("HTTP server closed");

    try {
      // Close MongoDB connection
      await mongoose.connection.close(false);
      logger.info("MongoDB connection closed");
      process.exit(0); // Exit process cleanly
    } catch (err) {
      logger.error("Error during MongoDB shutdown:", err);
      process.exit(1); // Exit with failure
    }
  });
};

// Handle process termination signals (e.g., Ctrl+C or kill)
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
