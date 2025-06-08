import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import env from "./config/env";
import connectDB from "./db";
import fileRoutes from "./routes/file.route";
import userRoutes from "./routes/user.route";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/user", userRoutes);
app.use("/api/file", fileRoutes);

app.get("/", (_req, res) => {
  res.send("EnigmaNotepad API running!");
});

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});
