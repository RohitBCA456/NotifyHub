import { Router } from "express";
import { getGlobalStats } from "../controllers/analytics.controller.js";

const router = Router();

router.route("/stats").get(getGlobalStats);

export { router as analyticsRouter};