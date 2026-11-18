import { TaskModel } from "./task.model.js";
import type { CreateTaskInput, UpdateTaskInput } from "./task.validator.js";

export const insertTask = async (data: CreateTaskInput) => {
  const task = await TaskModel.create(data);
  return task.toObject();
};

export const findTasks = async (skip: number, limit: number) => {
  const [items, total] = await Promise.all([
    TaskModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    TaskModel.countDocuments(),
  ]);
  return { items, total };
};

export const findTaskById = (id: string) => TaskModel.findById(id).lean();

export const updateTaskById = (id: string, data: UpdateTaskInput) =>
  TaskModel.findByIdAndUpdate(id, data, {
    returnDocument: "after",
    runValidators: true,
  }).lean();

export const deleteTaskById = (id: string) => TaskModel.findByIdAndDelete(id).lean();
