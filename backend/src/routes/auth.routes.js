import { Router } from "express";
import { register, login, logout, getProfile } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { registerSchema, loginSchema } from "../utils/validators.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/profile", requireAuth, getProfile);

export default router;
