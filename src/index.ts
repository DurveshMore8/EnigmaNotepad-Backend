import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./db";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process || 5000;

connectDB();

app.get("/", (_req, res) => {
  res.send("EnigmaNotepad API running!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
