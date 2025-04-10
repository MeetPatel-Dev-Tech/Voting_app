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
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
