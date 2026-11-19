import { API_ENDPOINTS } from "../constants/api";
import { apiClient } from "../lib/apiClient";
import type { TaskListResponse } from "../types/task";

export const getTasks = async (signal?: AbortSignal) => {
  const { data } = await apiClient.get<TaskListResponse>(API_ENDPOINTS.TASKS, { signal });
  return data;
};
