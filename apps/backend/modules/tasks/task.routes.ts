import express from "express";
import validate from "../../middleware/validate.js";
import { createTask, deleteTask, getTask, listTasks, updateTask } from "./task.controller.js";
import {
  createTaskSchema,
  listTasksSchema,
  taskIdSchema,
  updateTaskSchema,
} from "./task.validator.js";

const router = express.Router();

router.post("/", validate(createTaskSchema), createTask);
router.get("/", validate(listTasksSchema, "query"), listTasks);
router.get("/:id", validate(taskIdSchema, "params"), getTask);
router.patch("/:id", validate(taskIdSchema, "params"), validate(updateTaskSchema), updateTask);
router.delete("/:id", validate(taskIdSchema, "params"), deleteTask);

export default router;
