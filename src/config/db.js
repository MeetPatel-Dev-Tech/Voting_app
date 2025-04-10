const mongoose = require("mongoose");
require("dotenv").config();
const logger = require("../utils/logger");

// MongoDb url

// const mongoURL = process.env.DB_URL;
const mongoURL = process.env.DB_URL_LOCAL;

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Default connecion
const db = mongoose.connection;

// Event listener
db.on("connected", () => {
  logger.info("connected to mongoDB server ::");
});

db.on("error", () => {
  logger.warn("error to mongoDB server ::");
});

db.on("disconnected", () => {
  logger.error("disconnected to mongoDB server ::");
});

//export Database connection
module.exports = db;
