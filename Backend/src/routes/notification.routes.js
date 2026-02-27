import { Router } from "express";
import {
  createNotification,
  updateNotificationPreference,
  getNotificationPreference,
  getCacheNotificationPreference,
} from "../controllers/notification.controller.js";
import { verifyAuthentication } from "../middleware/auth.middleware.js";
import { generalLimiter, strictLimiter } from "../utils/rateLimiter.js";

const router = Router();

router
  .route("/send-notification")
  .post(verifyAuthentication, generalLimiter, createNotification);
router
  .route("/update-preferences")
  .post(verifyAuthentication, strictLimiter, updateNotificationPreference);
router.route("/get-preferences/:appId").get(getNotificationPreference);
router
  .route("/cache-preferences")
  .post(verifyAuthentication, generalLimiter, getCacheNotificationPreference);

export { router as notificationRoutes };
