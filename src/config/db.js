const mongoose = require("mongoose");
require("dotenv").config();
const logger = require("../utils/logger");

// MongoDB URL from environment variables
// const mongoURL = process.env.DB_URL;
const mongoURL = process.env.DB_URL_LOCAL;

// Connect to MongoDB using Mongoose
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Default connecion
const db = mongoose.connection;

// MongoDB connection events
db.on("connected", () => {
  logger.info("connected to mongoDB server ::");
});

db.on("error", () => {
  logger.warn("error to mongoDB server ::");
});

db.on("disconnected", () => {
  logger.error("disconnected to mongoDB server ::");
});

module.exports = db;
