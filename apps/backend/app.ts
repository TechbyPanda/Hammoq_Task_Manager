import cors from "cors";
import express, { type Express } from "express";
import { errorHandler } from "./middleware/errorHandler.js";
import healthRouter from "./routes/health.js";
import v1Router from "./routes/v1.js";

export function createApp(): Express {
  const app = express();

  app.use(cors({ origin: process.env.CORS_ORIGIN }));
  app.use(express.json());

  app.use("/health", healthRouter);

  app.use("/api/v1", v1Router)

  app.use(errorHandler);

  return app;
}
