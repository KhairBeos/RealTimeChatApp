import { clerkMiddleware } from "@clerk/express";
import express from "express";
import path from "path";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/authRoutes";
import chatRoutes from "./routes/chatRoutes";
import messageRoutes from "./routes/messageRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();

const allowedOrigins = [
  "http://localhost:8081", // Expo Dev Client
  "http://localhost:5173", // Vite Dev Server
  process.env.FRONTEND_URL!, // Production Frontend URL
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Allow cookies and authentication headers
  })
);

app.use(express.json()); // Parse JSON request bodies

app.use(clerkMiddleware()); // Clerk middleware for authentication

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/messages", messageRoutes);

app.use("/api/chats", chatRoutes);

app.use(errorHandler);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../web/dist")));

  app.get("/{*any}", (_, res) => {
    res.sendFile(path.join(__dirname, "../../web/dist", "index.html"));
  });
}

export default app;
