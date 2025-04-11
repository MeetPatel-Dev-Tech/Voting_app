import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import rateLimiter from "./middlewares/rateLimiter.js";
import corsOptions from "./middlewares/corsOptions.js";

import userRoutes from "./routes/userRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";

const app = express();

app.use(cors(corsOptions));
app.use(rateLimiter);
app.use(bodyParser.json());

app.use("/user", userRoutes);
app.use("/candidate", candidateRoutes);

export default app;
