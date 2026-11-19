export const ROUTES = {
  home: "/",
  newTask: "/task/new",
  task: (id: string) => `/task/${encodeURIComponent(id)}`,
  editTask: (id: string) => `/task/${encodeURIComponent(id)}/edit`,
} as const;
