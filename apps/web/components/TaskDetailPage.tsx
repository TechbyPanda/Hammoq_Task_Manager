"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Button, ButtonLink } from "./Button";
import { ErrorMessage } from "./ErrorMessage";
import { LoadingMessage } from "./LoadingMessage";
import { ROUTES } from "../constants/routes";
import { TASK_MESSAGES } from "../constants/task";
import { useTask } from "../hooks/useTask";
import { useDeleteTask } from "../hooks/useTaskMutations";
import type { Task } from "../types/task";
import styles from "./TaskDetailPage.module.css";

const DATE_FORMATTER = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDate(date: string) {
  return DATE_FORMATTER.format(new Date(date));
}

export function TaskDetailPage({ taskId }: { taskId: string }) {
  const { data: task, error, isPending } = useTask(taskId);
  let content: ReactNode;

  if (isPending) {
    content = <LoadingMessage message={TASK_MESSAGES.loadingTask} />;
  } else if (error || !task) {
    content = <ErrorMessage message={error?.message ?? TASK_MESSAGES.loadError} />;
  } else {
    content = <TaskDetails task={task} />;
  }

  return (
    <main className={styles.page}>
      <Link className={styles.backLink} href={ROUTES.home}>
        Back to tasks
      </Link>
      {content}
    </main>
  );
}

function TaskDetails({ task }: { task: Task }) {
  const router = useRouter();
  const deleteMutation = useDeleteTask(task._id);

  const handleDelete = () => {
    if (!window.confirm(TASK_MESSAGES.confirmDelete)) return;
    deleteMutation.mutate(undefined, { onSuccess: () => router.push(ROUTES.home) });
  };

  return (
    <article className={styles.detailCard}>
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>Task details</p>
          <h1 className={styles.title}>{task.title}</h1>
        </div>
        <div className={styles.actions}>
          <ButtonLink href={ROUTES.editTask(task._id)} variant="secondary">
            Edit
          </ButtonLink>
          <Button
            disabled={deleteMutation.isPending}
            onClick={handleDelete}
            type="button"
            variant="danger"
          >
            Delete
          </Button>
        </div>
      </div>
      {deleteMutation.error && <ErrorMessage message={deleteMutation.error.message} />}
      <section className={styles.description}>
        <h2>Description</h2>
        <p>{task.description || "No description provided."}</p>
      </section>
      <dl className={styles.timestamps}>
        <div>
          <dt>Created</dt>
          <dd>
            <time dateTime={task.createdAt}>{formatDate(task.createdAt)}</time>
          </dd>
        </div>
        <div>
          <dt>Last updated</dt>
          <dd>
            <time dateTime={task.updatedAt}>{formatDate(task.updatedAt)}</time>
          </dd>
        </div>
      </dl>
    </article>
  );
}
