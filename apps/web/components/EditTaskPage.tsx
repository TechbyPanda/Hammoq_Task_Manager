"use client";

import { useRouter } from "next/navigation";
import { ErrorMessage } from "./ErrorMessage";
import { LoadingMessage } from "./LoadingMessage";
import { TaskFormPage, TaskFormStatus } from "./TaskFormPage";
import { ROUTES } from "../constants/routes";
import { TASK_MESSAGES } from "../constants/task";
import { useTask } from "../hooks/useTask";
import { useUpdateTask } from "../hooks/useTaskMutations";
import type { TaskFormValues } from "../types/task";

export function EditTaskPage({ taskId }: { taskId: string }) {
  const router = useRouter();
  const { data: task, error, isPending } = useTask(taskId);
  const updateMutation = useUpdateTask(taskId);

  const handleUpdate = (values: TaskFormValues) => {
    updateMutation.mutate(values, { onSuccess: () => router.push(ROUTES.task(taskId)) });
  };

  if (isPending) {
    return (
      <TaskFormStatus backHref={ROUTES.task(taskId)}>
        <LoadingMessage message={TASK_MESSAGES.loadingTask} />
      </TaskFormStatus>
    );
  }

  if (error || !task) {
    return (
      <TaskFormStatus backHref={ROUTES.home}>
        <ErrorMessage message={error?.message ?? TASK_MESSAGES.loadError} />
      </TaskFormStatus>
    );
  }

  return (
    <TaskFormPage
      backHref={ROUTES.home}
      description="Update the details for this task."
      errorMessage={updateMutation.error?.message}
      initialValues={task}
      isSubmitting={updateMutation.isPending}
      onSubmit={handleUpdate}
      submitLabel="Save changes"
      taskId={task._id}
      title="Edit task"
    />
  );
}
