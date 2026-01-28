import { Server } from "socket.io";

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: { origin: process.env.FRONTEND_URL },
  });

  const uiNamespace = io.of("/ui");

  uiNamespace.on("connection", (socket) => {
    console.log("UI client connected:", socket.id);

   socket.on("join", (userId) => {
      const room = String(userId);
      socket.join(room);
      console.log(`User ${userId} joined room. Current rooms:`, socket.rooms);
    });

    socket.on("disconnect", () => {
      console.log("UI client disconnected");
    });
  });
}

export function emitUser(userId, event, payload) {
  io.of("/ui").to(userId).emit(event, payload);
}
