import { Router } from "express";
import { createResearch } from "../controllers/research.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { researchSchema } from "../utils/validators.js";

const router = Router();

router.post("/", requireAuth, validate(researchSchema), createResearch);

export default router;
