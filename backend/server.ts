import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./routes/apiRoutes.js";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(cors({
    origin: 'https://barber-app.vercel.app', // رابط Vercel الخاص بك
    credentials: true
  }));

  // Create HTTP Server for both Express and Socket.io
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: "*" }
  });

  // Make io accessible to routers/controllers
  app.set('io', io);

  io.on("connection", (socket) => {
    console.log("Client connected via WebSockets");
  });

  // API Routes
  app.use("/api", apiRoutes);

  // Use HTTPServer listen to bind Socket.IO correctly (app.listen breaks websockets)
  httpServer.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
