// "tasks" (the list) and "task" (one task) are separate so a mutation can refresh one without the other.
export const QUERY_KEYS = {
  tasks: ["tasks"] as const,
  task: (id: string) => ["task", id] as const,
};
