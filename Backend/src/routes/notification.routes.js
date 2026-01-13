import { Router } from "express";
import { createNotification } from "../controllers/notification.controller.js";
import { verifyAuthentication } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/send-notification").post(verifyAuthentication, createNotification);


export { router as notificationRoutes };