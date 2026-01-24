import { Router } from "express";
import { getChartData, getGlobalStats, getProjectStats } from "../controllers/analytics.controller.js";

const router = Router();

router.route("/stats").get(getGlobalStats);
router.route("/project-stats/:projectId").get(getProjectStats);
router.route("/chart-data/:projectId").get(getChartData);

export { router as analyticsRouter};