import type { RequestHandler } from "express";
import { AppError } from "../errors/AppError.js";
import { AUTH_COOKIE_NAME, verifyToken } from "../modules/auth/auth.token.js";

// Identity comes only from the verified token, never from the request body.
export const requireAuth: RequestHandler = (req, _res, next) => {
  const token: string | undefined = req.cookies?.[AUTH_COOKIE_NAME];
  const userId = token ? verifyToken(token) : null;

  if (!userId) {
    next(new AppError("Not authenticated", 401));
    return;
  }

  req.user = { id: userId };
  next();
};
