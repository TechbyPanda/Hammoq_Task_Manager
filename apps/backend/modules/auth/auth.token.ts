import type { CookieOptions } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) throw new Error("JWT_SECRET is not set in .env");

const TOKEN_TTL_SECONDS = 60 * 60 * 24; // 1 day

export const AUTH_COOKIE_NAME = "access_token";

export const AUTH_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: TOKEN_TTL_SECONDS * 1000,
};

export const signToken = (userId: string) =>
  jwt.sign({}, JWT_SECRET, { subject: userId, expiresIn: TOKEN_TTL_SECONDS });

export const verifyToken = (token: string): string | null => {
  try {
    return jwt.verify(token, JWT_SECRET).sub as string;
  } catch {
    return null;
  }
};
