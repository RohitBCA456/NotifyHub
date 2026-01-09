export function emitInApp(appId, userId, payload) {
  io.of("/inapp").to(`${appId}:${userId}`).emit("notification", payload);
}
