import { Response, Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller";
import {
  AuthenticatedRequest,
  authenticateJWT,
} from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get(
  "/me",
  authenticateJWT,
  (req: AuthenticatedRequest, res: Response) => {
    res.json({ message: "You are authenticated!", user: req.user });
  }
);

export default router;
