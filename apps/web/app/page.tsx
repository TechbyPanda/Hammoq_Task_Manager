"use client";

import type { ReactNode } from "react";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingMessage } from "../components/LoadingMessage";
import { TaskList } from "../components/TaskList";
import { TaskBoardHeader } from "../components/TaskBoardHeader";
import { useTasks } from "../hooks/useTasks";
import styles from "./page.module.css";

export default function Home() {
  const { data, error, isPending } = useTasks();
  let content: ReactNode;

  if (isPending) {
    content = <LoadingMessage message="Loading tasks…" />;
  } else if (error) {
    content = <ErrorMessage message={error.message} />;
  } else if (data) {
    content = <TaskList tasks={data.items} />;
  } else {
    content = <ErrorMessage message="Tasks could not be loaded." />;
  }

  return (
    <main className={styles.page}>
      <TaskBoardHeader />
      {content}
    </main>
  );
}
