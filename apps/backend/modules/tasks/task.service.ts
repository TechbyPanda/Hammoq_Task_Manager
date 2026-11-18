import * as taskRepository from "./task.repository.js";
import type { CreateTaskInput, ListTasksQuery, UpdateTaskInput } from "./task.validator.js";

// errorHandler reads `status` to pick the response code.
const taskNotFound = () => Object.assign(new Error("Task not found"), { status: 404 });

export const createTask = (input: CreateTaskInput) => taskRepository.insertTask(input);

export const listTasks = async ({ page, limit }: ListTasksQuery) => {
  const { items, total } = await taskRepository.findTasks((page - 1) * limit, limit);
  return { items, page, limit, total };
};

export const getTask = async (id: string) => {
  const task = await taskRepository.findTaskById(id);
  if (!task) throw taskNotFound();
  return task;
};

export const updateTask = async (id: string, input: UpdateTaskInput) => {
  const task = await taskRepository.updateTaskById(id, input);
  if (!task) throw taskNotFound();
  return task;
};

export const deleteTask = async (id: string) => {
  const task = await taskRepository.deleteTaskById(id);
  if (!task) throw taskNotFound();
};
