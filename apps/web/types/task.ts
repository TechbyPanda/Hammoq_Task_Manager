export type TaskStatus = "todo" | "in-progress" | "done";

export type Task = {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
};

export type TaskFormValues = Pick<Task, "title" | "description" | "status">;

export type TaskListResponse = {
  items: Task[];
};
