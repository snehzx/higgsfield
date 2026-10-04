import { Router } from "express";
import { me, signin, signup } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/me", authMiddleware, me);

export default router;
