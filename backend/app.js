import express from "express";
import cors from "cors";
import playersRouter from "./controllers/players.js";
import adminsRouter from "./controllers/admins.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/players", playersRouter);
app.use("/api/admins", adminsRouter);

export default app;
