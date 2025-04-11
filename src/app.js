const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const rateLimiter = require("./middlewares/rateLimiter");
const corsOptions = require("./middlewares/corsOptions");

const userRoutes = require("./routes/userRoutes");
const candidateRoutes = require("./routes/candidateRoutes");

const app = express();

app.use(cors(corsOptions));
app.use(rateLimiter);
app.use(bodyParser.json());

app.use("/user", userRoutes);
app.use("/candidate", candidateRoutes);

module.exports = app;
