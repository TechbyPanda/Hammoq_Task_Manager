"use client";

import type { ReactNode } from "react";
import { ButtonLink } from "../components/Button";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingMessage } from "../components/LoadingMessage";
import { TaskList } from "../components/TaskList";
import { TaskBoardHeader } from "../components/TaskBoardHeader";
import { ROUTES } from "../constants/routes";
import { TASK_MESSAGES } from "../constants/task";
import { useTasks } from "../hooks/useTasks";
import styles from "./page.module.css";

export default function Home() {
  const { data, error, isPending } = useTasks();
  let content: ReactNode;

  if (isPending) {
    content = <LoadingMessage message={TASK_MESSAGES.loadingTasks} />;
  } else if (error || !data) {
    content = <ErrorMessage message={error?.message ?? TASK_MESSAGES.loadError} />;
  } else {
    content = <TaskList tasks={data.items} />;
  }

  return (
    <main className={styles.page}>
      <TaskBoardHeader action={<ButtonLink href={ROUTES.newTask}>Add new task</ButtonLink>} />
      {content}
    </main>
  );
}
