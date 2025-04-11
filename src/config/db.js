import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "../utils/logger.js";

// Load environment variables from .env file
dotenv.config();

// MongoDB URL from environment variables
// const mongoURL = process.env.DB_URL;
const mongoURL = process.env.DB_URL_LOCAL;

// Connect to MongoDB using Mongoose
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Default connection
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

export default db;
