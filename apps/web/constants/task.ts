import type { TaskStatus } from "../types/task";

export const TASK_STATUS_OPTIONS: ReadonlyArray<{ value: TaskStatus; label: string }> = [
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

// Same limits as the backend validator, so the browser catches them first.
export const TASK_TITLE_MAX_LENGTH = 200;
export const TASK_DESCRIPTION_MAX_LENGTH = 2000;

export const TASK_MESSAGES = {
  loadingTasks: "Loading tasks…",
  loadingTask: "Loading task…",
  loadError: "Task could not be loaded.",
  confirmDelete: "Delete this task? This cannot be undone.",
} as const;
