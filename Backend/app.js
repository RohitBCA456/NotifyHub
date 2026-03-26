import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { userRoutes } from "./src/routes/user.routes.js";
import { notificationRoutes } from "./src/routes/notification.routes.js";
import cookieParser from "cookie-parser";
import http from "http";
import { initSocket } from "./src/config/socket.js";
import { analyticsRouter } from "./src/routes/analytics.routes.js";
import { connect } from "./src/config/rabbitmq.js";
import { client } from "./src/config/redis.js";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

dotenv.config({ path: "./.env" });

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: {
    status: 429,
    message: "too many request, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
  // validate: { trustProxy: true },
});

const app = express();

// app.set("trust proxy", 1);

const server = http.createServer(app);

initSocket(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(morgan("dev"));

connect();
client.connect();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(limiter);

app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/analytics", analyticsRouter);

app.get("/", (_, res) => {
  res.status(200).json({ message: "the server is up!" });
});

export { app, server };
