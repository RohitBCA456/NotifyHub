import { Router } from "express";
import {
  deleteProject,
  fetchProjects,
  logoutUser,
  saveCredentials,
} from "../controllers/user.controller.js";
import { verifyAuthentication } from "../middleware/auth.middleware.js";
import { createApp } from "../controllers/user.controller.js";

const router = Router();

router.route("/save-credentials").post(saveCredentials);
router.route("/logout").get(verifyAuthentication, logoutUser);
router.route("/create-app").post(verifyAuthentication, createApp);
router.route("/fetch-projects").get(verifyAuthentication, fetchProjects);
router.route("/delete-project").post(deleteProject);

export { router as userRoutes };
