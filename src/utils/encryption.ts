import crypto from "crypto";

const IV_LENGTH = 16;

/**
 * Encrypt user secret file content using their personal key.
 */
export const encryptText = (text: string, userKey: string): string => {
  const key = crypto.createHash("sha256").update(userKey).digest();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, "utf-8"),
    cipher.final(),
  ]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

/**
 * Decrypt user secret file content using their personal key.
 */
export const decryptText = (encryptedText: string, userKey: string): string => {
  const key = crypto.createHash("sha256").update(userKey).digest();
  const [ivHex, encryptedHex] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  return decrypted.toString("utf-8");
};
