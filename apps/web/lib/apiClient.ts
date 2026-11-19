import axios from "axios";
import { API_BASE_URL, API_TIMEOUT_MS, FALLBACK_ERROR_MESSAGE } from "../constants/api";

export class ApiError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
  }
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) return Promise.reject(error);

    const message = error.response?.data?.message ?? FALLBACK_ERROR_MESSAGE;
    return Promise.reject(new ApiError(message, error.response?.status));
  },
);
