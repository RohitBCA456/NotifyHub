import { Router } from "express";
import { logoutUser, saveCredentials } from "../controllers/user.controller.js";
import { verifyAuthentication } from "../../middleware/auth.middleware.js";
import { createApp } from "../controllers/user.controller.js";

const router = Router();

router.route("/save-credentials").post(saveCredentials);
router.route("/logout").get(verifyAuthentication, logoutUser);
router.route("/create-app").post(verifyAuthentication, createApp);   

export { router as userRoutes }