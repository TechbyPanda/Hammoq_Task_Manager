import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Express } from "express";
import { errorHandler } from "./middleware/errorHandler.js";
import healthRouter from "./routes/health.js";
import v1Router from "./routes/v1.js";

export function createApp(): Express {
  const app = express();

  // credentials: true lets the browser send the auth cookie cross-origin (web :3000 → api :4000).
  app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.use("/health", healthRouter);

  app.use("/api/v1", v1Router)

  app.use(errorHandler);

  return app;
}
