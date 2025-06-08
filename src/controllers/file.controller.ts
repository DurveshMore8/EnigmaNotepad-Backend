import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import FileModel from "../models/file.model";
import { decryptText, encryptText } from "../utils/encryption";

export const createFile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required." });
    }

    const encrypted = encryptText(content);

    const newFile = await FileModel.create({
      user: req.user?.userId,
      title,
      content: encrypted,
    });

    return res.status(201).json({ message: "File created.", file: newFile });
  } catch (error) {
    console.error("Create File error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getFileList = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const files = await FileModel.find({ user: userId }).select(
      "title createdAt updatedAt"
    );

    return res.status(200).json({ files });
  } catch (error) {
    console.error("Get File List error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getFile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.userId;
    const fileId = req.params.id;

    const file = await FileModel.findOne({ user: userId, _id: fileId });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const decryptedContent = decryptText(file.content);

    return res.status(200).json({
      title: file.title,
      content: decryptedContent,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    });
  } catch (error) {
    console.error("Get File error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
