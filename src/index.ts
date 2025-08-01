import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { version } from "../package.json";
import env from "./config/env";
import connectDB from "./db";
import fileRoutes from "./routes/file.route";
import userRoutes from "./routes/user.route";

dotenv.config();

const app = express();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://enigmanotepad.vercel.app"
        : "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

connectDB();

app.use("/api/user", userRoutes);
app.use("/api/file", fileRoutes);

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "EnigmaNotepad API is running",
    version,
  });
});

app.get("/", (_req, res) => {
  res.send("EnigmaNotepad API running!");
});

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});
