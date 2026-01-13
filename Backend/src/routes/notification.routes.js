import { Router } from "express";
import {
  createNotification,
  updateNotificationPreference,
  getNotificationPreference,
} from "../controllers/notification.controller.js";
import { verifyAuthentication } from "../middleware/auth.middleware.js";

const router = Router();

router
  .route("/send-notification")
  .post(verifyAuthentication, createNotification);
router.route("/update-preferences").post(updateNotificationPreference);
router.route("/get-preferences/:appId").get(getNotificationPreference);

export { router as notificationRoutes };
