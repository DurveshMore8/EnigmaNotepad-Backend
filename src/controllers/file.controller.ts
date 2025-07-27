import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import FileModel from "../models/file.model";
import UserModel from "../models/user.model";
import { decryptText, encryptText } from "../utils/encryption";
import { decryptUserKey } from "../utils/userKey";

export const createFile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.userId;
    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required." });
    }

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const userKey = decryptUserKey(user.encryptionKey);

    const encryptedContent = encryptText(content, userKey);

    const newFile = await FileModel.create({
      user: userId,
      title,
      content: encryptedContent,
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

    const searchText = req.query.searchText as string | undefined;

    const query: any = { user: userId };

    if (searchText && searchText.trim() !== "") {
      query.title = { $regex: searchText, $options: "i" };
    }

    const files = await FileModel.find(query).select(
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

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const userKey = decryptUserKey(user.encryptionKey);

    const decryptedContent = decryptText(file.content, userKey);

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

export const patchFile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  const updates = req.body;

  try {
    if (updates.content) {
      const userId = req.user?.userId;
      const user = await UserModel.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const userKey = decryptUserKey(user.encryptionKey);
      updates.content = encryptText(updates.content, userKey);
    }

    const updatedFile = await FileModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedFile) {
      return res.status(404).json({ message: "File not found." });
    }

    res
      .status(200)
      .json({ message: "File updated successfully", file: updatedFile });
  } catch (error) {
    console.error("PATCH Error:", error);
    res.status(500).json({ message: "Failed to update file." });
  }
};

export const updateFile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const userId = req.user?.userId;
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const userKey = decryptUserKey(user.encryptionKey);
    const encryptedContent = encryptText(content, userKey);

    const updatedFile = await FileModel.findByIdAndUpdate(
      id,
      { title, content: encryptedContent },
      { new: true }
    );

    if (!updatedFile) {
      return res.status(404).json({ message: "File not found." });
    }

    res
      .status(200)
      .json({ message: "File updated successfully", file: updatedFile });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Failed to update file." });
  }
};

export const deleteFile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  const { id } = req.params;

  try {
    const deletedFile = await FileModel.findByIdAndDelete(id);

    if (!deletedFile) {
      return res.status(404).json({ message: "File not found." });
    }

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Failed to delete file." });
  }
};
