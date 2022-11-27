import { Server } from "socket.io";
import http from "http";

let io: Server;

export default {
  init: (httpServer: http.Server) => {
    io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
    return io;
  },
  getIo: () => {
    if (!io) {
      throw new Error("socket.io is not initialized");
    }
    return io;
  },
};
