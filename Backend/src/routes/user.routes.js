import { Router } from "express";
import {
  getCacheProfile,
  deleteProject,
  fetchProjects,
  logoutUser,
  saveCredentials,
} from "../controllers/user.controller.js";
import { verifyAuthentication } from "../middleware/auth.middleware.js";
import { createApp } from "../controllers/user.controller.js";
import { generalLimiter, strictLimiter } from "../utils/rateLimiter.js";

const router = Router();

router.route("/save-credentials").post(strictLimiter, saveCredentials);
router.route("/logout").get(verifyAuthentication, logoutUser);
router
  .route("/create-app")
  .post(verifyAuthentication, generalLimiter, createApp);
router
  .route("/fetch-projects")
  .get(verifyAuthentication, generalLimiter, fetchProjects);
router.route("/delete-project").delete(verifyAuthentication, deleteProject);
router
  .route("/cache-profile")
  .post(verifyAuthentication, generalLimiter, getCacheProfile);

export { router as userRoutes };
