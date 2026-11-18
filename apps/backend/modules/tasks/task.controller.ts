import type { Request, Response } from "express";
import * as taskService from "./task.service.js";
import type { CreateTaskInput, ListTasksQuery, UpdateTaskInput } from "./task.validator.js";

type IdParams = { id: string };

export const createTask = async (req: Request, res: Response) => {
  const task = await taskService.createTask(req.body as CreateTaskInput);
  res.status(201).json(task);
};

export const listTasks = async (req: Request, res: Response) => {
  const result = await taskService.listTasks(req.query as unknown as ListTasksQuery);
  res.status(200).json(result);
};

export const getTask = async (req: Request<IdParams>, res: Response) => {
  const task = await taskService.getTask(req.params.id);
  res.status(200).json(task);
};

export const updateTask = async (req: Request<IdParams>, res: Response) => {
  const task = await taskService.updateTask(req.params.id, req.body as UpdateTaskInput);
  res.status(200).json(task);
};

export const deleteTask = async (req: Request<IdParams>, res: Response) => {
  await taskService.deleteTask(req.params.id);
  res.status(204).end();
};
