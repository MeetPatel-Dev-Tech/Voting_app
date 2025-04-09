const mongoose = require("mongoose");
require("dotenv").config();

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
  console.log("connected to mongoDB server ::");
});

db.on("error", () => {
  console.log("error to mongoDB server ::");
});

db.on("disconnected", () => {
  console.log("disconnected to mongoDB server ::");
});

//export Database connection
module.exports = db;
