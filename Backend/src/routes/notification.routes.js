import { Router } from "express";
import {
  createNotification,
  updateNotificationPreference,
  getNotificationPreference,
} from "../controllers/notification.controller.js";
import { verifyAuthentication } from "../middleware/auth.middleware.js";
import { generalLimiter, strictLimiter } from "../utils/rateLimiter.js";

const router = Router();

router
  .route("/send-notification")
  .post(verifyAuthentication, generalLimiter, createNotification);
router.route("/update-preferences").post(strictLimiter, updateNotificationPreference);
router.route("/get-preferences/:appId").get(getNotificationPreference);

export { router as notificationRoutes };
