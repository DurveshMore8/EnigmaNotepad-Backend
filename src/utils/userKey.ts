import crypto from "crypto";
import env from "../config/env";

const IV_LENGTH = 16;
const MASTER_KEY = crypto
  .createHash("sha256")
  .update(env.encryptionSecret)
  .digest();

/**
 * Generate a secure random key for each user at registration.
 */
export const generateUserEncryptionKey = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Encrypt user's key using master key (AES).
 */
export const encryptUserKey = (userKey: string): string => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", MASTER_KEY, iv);
  const encrypted = Buffer.concat([
    cipher.update(userKey, "utf-8"),
    cipher.final(),
  ]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

/**
 * Decrypt user's key using master key (AES).
 */
export const decryptUserKey = (encryptedKey: string): string => {
  const [ivHex, encryptedHex] = encryptedKey.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", MASTER_KEY, iv);
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  return decrypted.toString("utf-8");
};
