import { Router } from "express";
import { signup, login, getMe } from "../controllers/auth.controller";
import { auth } from "../middlewares/auth";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", auth, getMe);

export default router;
