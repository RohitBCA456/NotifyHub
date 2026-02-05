import { Router } from "express";
import { getChartData, getGlobalStats, getProjectStats } from "../controllers/analytics.controller.js";
import { generalLimiter } from "../utils/rateLimiter.js";

const router = Router();

router.route("/stats").get(generalLimiter, getGlobalStats);
router.route("/project-stats/:projectId").get(generalLimiter, getProjectStats);
router.route("/chart-data/:projectId").get(generalLimiter, getChartData);

export { router as analyticsRouter};