import { API_ENDPOINTS } from "../constants/api";
import { apiClient } from "../lib/apiClient";
import type { Task, TaskFormValues, TaskListResponse } from "../types/task";

const taskUrl = (id: string) => `${API_ENDPOINTS.TASKS}/${encodeURIComponent(id)}`;

export const getTasks = async (signal?: AbortSignal) => {
  const { data } = await apiClient.get<TaskListResponse>(API_ENDPOINTS.TASKS, { signal });
  return data;
};

export const getTask = async (id: string, signal?: AbortSignal) => {
  const { data } = await apiClient.get<Task>(taskUrl(id), { signal });
  return data;
};

export const createTask = async (values: TaskFormValues) => {
  const { data } = await apiClient.post<Task>(API_ENDPOINTS.TASKS, values);
  return data;
};

export const updateTask = async (id: string, values: TaskFormValues) => {
  const { data } = await apiClient.patch<Task>(taskUrl(id), values);
  return data;
};

export const deleteTask = async (id: string) => {
  await apiClient.delete(taskUrl(id));
};
