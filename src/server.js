const express = require("express");
const app = express();
const db = require("./config/db");
require("dotenv").config();
const logger = require("./utils/logger");

// Middleware to parse JSON bodies
var bodyParser = require("body-parser");
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

// Import route handlers
const userRoutes = require("./routes/userRoutes");
const candidateRoutes = require("./routes/candidateRoutes");

// Mount route handlers
app.use("/user", userRoutes);
app.use("/candidate", candidateRoutes);

// Start the Express server
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Graceful shutdown logic
const gracefulShutdown = (signal) => {
  logger.info(`\n🚦 Received ${signal}. Closing server and DB connection...`);

  server.close(async () => {
    logger.info("HTTP server closed");

    try {
      const mongoose = require("mongoose");
      await mongoose.connection.close(false); // no callback here
      logger.info("MongoDB connection closed");
      process.exit(0);
    } catch (err) {
      logger.error("Error during MongoDB shutdown:", err);
      process.exit(1);
    }
  });
};

// Listen for termination signals
process.on("SIGINT", () => gracefulShutdown("SIGINT")); // Ctrl+C
process.on("SIGTERM", () => gracefulShutdown("SIGTERM")); // kill
