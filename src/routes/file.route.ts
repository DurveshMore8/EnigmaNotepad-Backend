import { Router } from "express";
import {
  createFile,
  getFile,
  getFileList,
} from "../controllers/file.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";

const router = Router();

router.post("/create", authenticateJWT, createFile);
router.get("/", authenticateJWT, getFileList);
router.get("/:id", authenticateJWT, getFile);
// router.put("/:id");
// router.delete("/:id");

export default router;
