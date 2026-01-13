import { App } from "../models/app.model.js";

export function initInAppSocket(io) {
  const inApp = io.of("/inapp");

  inApp.use(async (socket, next) => {
    try {
      const { apiKey, userId } = socket.handshake.auth;

      if (!apiKey || !userId) {
        return next(new Error("Authentication credentials are missing."));
      }

      const appId = await App.findOne({ apiKey }).select("_id");
      socket.userId = userId;
      socket.appId = appId._id.toString();

      next();
    } catch (error) {
      next(new Error("Authentication failed."));
    }
  });

  inApp.on("connection", (socket) => {
    const room = `${socket.appId}:${socket.userId}`;
    socket.join(room);

    console.log(
      `User connected to in-app namespace: ${socket.userId} (Socket ID: ${socket.id})`
    );

    socket.on("disconnect", () => {
      console.log(
        `User disconnected from in-app namespace: ${socket.userId} (Socket ID: ${socket.id})`
      );
    });
  });
}
