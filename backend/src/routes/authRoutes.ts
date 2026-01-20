import { Router } from "express";
import { protectRoute } from "../middleware/auth";
import { authCallBack, getMe } from "../controllers/authController";

const router = Router();

router.get("/me", protectRoute, getMe);
router.post("/callback", authCallBack);

export default router;