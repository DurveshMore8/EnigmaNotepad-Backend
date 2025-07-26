import { Router } from "express";
import {
  createFile,
  deleteFile,
  getFile,
  getFileList,
  patchFile,
  updateFile,
} from "../controllers/file.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";

const router = Router();

router.post("/create", authenticateJWT, createFile);
router.get("/", authenticateJWT, getFileList);
router.get("/:id", authenticateJWT, getFile);
router.patch("/:id", authenticateJWT, patchFile);
router.put("/:id", authenticateJWT, updateFile);
router.delete("/:id", authenticateJWT, deleteFile);

export default router;
