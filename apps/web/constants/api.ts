export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1";

export const API_TIMEOUT_MS = 10_000;

export const API_ENDPOINTS = {
  TASKS: "/task",
} as const;

export const FALLBACK_ERROR_MESSAGE = "Something went wrong. Please try again.";
