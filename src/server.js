const express = require("express");
const app = express();
const db = require("./config/db");
require("dotenv").config();
const logger = require("./utils/logger");

var bodyParser = require("body-parser");
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

const userRoutes = require("./routes/userRoutes");
const candidateRoutes = require("./routes/candidateRoutes");

app.use("/user", userRoutes);
app.use("/candidate", candidateRoutes);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
