import { Server } from "socket.io";

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: { origin: process.env.FRONTEND_URL },
  });

  const uiNamespace = io.of("/ui");

  uiNamespace.on("connection", (socket) => {
    console.log("UI client connected:", socket.id);

    socket.on("join", (projectId) => {
      socket.join(projectId.toString());
      console.log(`Socket ${socket.id} joined room: ${projectId}`);
    });

    socket.on("leave", (projectId) => {
      socket.leave(projectId.toString());
      console.log(`Socket ${socket.id} left ${projectId}`);
    });

    socket.on("disconnect", () => {
      console.log("UI client disconnected");
    });
  });
}

export function emitUser(projectId, event, payload) {
  io.of("/ui").to(projectId).emit(event, payload);
}

export function emitStats(projectId, event, payload) {
  io.of("/ui").to(projectId).emit(event, payload);
}
