import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { userRoutes } from "./src/routes/user.routes.js";
import { notificationRoutes } from "./src/routes/notification.routes.js";
import cookieParser from "cookie-parser";
import http from "http";

dotenv.config({ path: "./.env" });

const app = express();

const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,            
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);

export { app, server };
