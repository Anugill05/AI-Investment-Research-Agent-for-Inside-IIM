import { Router } from "express";
import authRoutes from "./auth.routes.js";
import researchRoutes from "./research.routes.js";
import historyRoutes from "./history.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/research", researchRoutes);
router.use("/history", historyRoutes);

router.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "AI Investment Research Agent API is running." });
});

export default router;
