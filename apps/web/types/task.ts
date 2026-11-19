export type Task = {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
};

export type TaskListResponse = {
  items: Task[];
};
