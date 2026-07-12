import { Router } from "express";
import { getHistory, getHistoryDetail, removeHistoryItem } from "../controllers/history.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, getHistory);
router.get("/:id", requireAuth, getHistoryDetail);
router.delete("/:id", requireAuth, removeHistoryItem);

export default router;
