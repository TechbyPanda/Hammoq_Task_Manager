import { Schema, model, type InferSchemaType } from "mongoose";

export const TASK_STATUSES = ["todo", "in-progress", "done"] as const;

const taskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: { type: String, enum: TASK_STATUSES, default: "todo" },
  },
  { timestamps: true },
);

export type Task = InferSchemaType<typeof taskSchema>;

export const TaskModel = model("Task", taskSchema);
