"use client";

import { useRouter } from "next/navigation";
import { ROUTES } from "../constants/routes";
import { useCreateTask } from "../hooks/useTaskMutations";
import type { TaskFormValues } from "../types/task";
import { TaskFormPage } from "./TaskFormPage";

export function NewTaskPage() {
  const router = useRouter();
  const { mutate: createTask, isPending, error } = useCreateTask();

  const handleCreate = (values: TaskFormValues) => {
    createTask(values, { onSuccess: () => router.push(ROUTES.home) });
  };

  return (
    <TaskFormPage
      backHref={ROUTES.home}
      description="Add the details for your new task."
      errorMessage={error?.message}
      isSubmitting={isPending}
      onSubmit={handleCreate}
      submitLabel="Create task"
      title="Add a new task"
    />
  );
}
