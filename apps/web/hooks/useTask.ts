import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants/queryKeys";
import { getTask } from "../services/task.service";

export function useTask(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.task(id),
    queryFn: ({ signal }) => getTask(id, signal),
  });
}
