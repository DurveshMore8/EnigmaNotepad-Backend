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
const allowedOrigins = [
  "http://localhost:3000",
  "https://enigmanotepad-backend.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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
