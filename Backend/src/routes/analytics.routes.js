import { Router } from "express";
import {
  getCacheGlobalStats,
  getCacheProjectStats,
  getChartData,
  getGlobalStats,
  getProjectStats,
} from "../controllers/analytics.controller.js";
import { generalLimiter } from "../utils/rateLimiter.js";

const router = Router();

router.route("/stats").get(generalLimiter, getGlobalStats);
router.route("/project-stats/:projectId").get(generalLimiter, getProjectStats);
router.route("/chart-data/:projectId").get(generalLimiter, getChartData);
router.route("/project-cache/:projectId").get(generalLimiter, getCacheProjectStats);
router.route("/cache-globalStats").get(generalLimiter, getCacheGlobalStats);

export { router as analyticsRouter };
