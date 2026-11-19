import Link from "next/link";
import { ROUTES } from "../constants/routes";
import { TASK_STATUS_OPTIONS } from "../constants/task";
import type { Task } from "../types/task";
import styles from "./TaskList.module.css";

export function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <section className={styles.board} aria-label="Tasks by status">
      {TASK_STATUS_OPTIONS.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.value);

        return (
          <section
            className={styles.column}
            key={column.value}
            aria-labelledby={`column-${column.value}`}
          >
            <header className={styles.columnHeader}>
              <h2 className={styles.columnTitle} id={`column-${column.value}`}>
                <span
                  className={`${styles.statusDot} ${styles[column.value]}`}
                  aria-hidden="true"
                />
                {column.label}
              </h2>
              <span className={styles.count} aria-label={`${columnTasks.length} tasks`}>
                {columnTasks.length}
              </span>
            </header>
            <ul className={styles.taskList}>
              {columnTasks.length > 0 ? (
                columnTasks.map((task) => (
                  <li key={task._id}>
                    <Link className={styles.taskCard} href={ROUTES.task(task._id)}>
                      <h3 className={styles.taskTitle}>{task.title}</h3>
                      {task.description && (
                        <p className={styles.taskDescription}>{task.description}</p>
                      )}
                    </Link>
                  </li>
                ))
              ) : (
                <li className={styles.emptyState}>No tasks here</li>
              )}
            </ul>
          </section>
        );
      })}
    </section>
  );
}
