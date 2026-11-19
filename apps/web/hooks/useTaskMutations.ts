import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants/queryKeys";
import { createTask, deleteTask, updateTask } from "../services/task.service";
import type { TaskFormValues } from "../types/task";

// Each mutation refreshes the task list afterwards so the board never shows stale data.

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks }),
  });
}

export function useUpdateTask(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: TaskFormValues) => updateTask(id, values),
    onSuccess: (task) => {
      queryClient.setQueryData(QUERY_KEYS.task(id), task);
      return queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks });
    },
  });
}

export function useDeleteTask(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteTask(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks }),
  });
}
