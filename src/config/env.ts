import assert from "assert";
import dotenv from "dotenv";

dotenv.config();

const { PORT, MONGO_URI, JWT_SECRET, ENCRYPTION_SECRET, NODE_ENV } =
  process.env;

assert(PORT, "PORT is required");
assert(MONGO_URI, "MONGO_URI is required");
assert(JWT_SECRET, "JWT_SECRET is required");
assert(ENCRYPTION_SECRET, "ENCRYPTION_SECRET is required");

export default {
  port: Number(PORT),
  mongoUri: MONGO_URI,
  jwtSecret: JWT_SECRET,
  encryptionSecret: ENCRYPTION_SECRET,
  env: NODE_ENV || "development",
};
