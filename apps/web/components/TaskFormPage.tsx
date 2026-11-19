import Link from "next/link";
import type { ReactNode } from "react";
import { ROUTES } from "../constants/routes";
import { TaskForm, type TaskFormProps } from "./TaskForm";
import styles from "./TaskFormPage.module.css";

type TaskFormPageProps = Omit<TaskFormProps, "cancelHref"> & {
  backHref: string;
  description: string;
  title: string;
  taskId?: string;
};

export function TaskFormPage({
  backHref,
  description,
  title,
  taskId,
  ...formProps
}: TaskFormPageProps) {
  const cancelHref = taskId ? ROUTES.task(taskId) : backHref;

  return (
    <main className={styles.page}>
      <Link className={styles.backLink} href={backHref}>
        Back to tasks
      </Link>
      <section className={styles.card}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>{taskId ? "Edit task" : "New task"}</p>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>{description}</p>
        </header>
        <TaskForm cancelHref={cancelHref} {...formProps} />
      </section>
    </main>
  );
}

export function TaskFormStatus({
  backHref,
  children,
}: {
  backHref: string;
  children: ReactNode;
}) {
  return (
    <main className={styles.page}>
      <Link className={styles.backLink} href={backHref}>
        Back to tasks
      </Link>
      {children}
    </main>
  );
}
