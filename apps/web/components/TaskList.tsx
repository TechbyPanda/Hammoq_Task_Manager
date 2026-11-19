import type { Task } from "../types/task";
import styles from "./TaskList.module.css";

const COLUMNS = [
  { status: "todo", title: "To Do" },
  { status: "in-progress", title: "In Progress" },
  { status: "done", title: "Done" },
] as const satisfies ReadonlyArray<{
  status: Task["status"];
  title: string;
}>;

export function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <section className={styles.board} aria-label="Tasks by status">
      {COLUMNS.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.status);

        return (
          <section
            className={styles.column}
            key={column.status}
            aria-labelledby={`column-${column.status}`}
          >
            <header className={styles.columnHeader}>
              <h2 className={styles.columnTitle} id={`column-${column.status}`}>
                <span
                  className={`${styles.statusDot} ${styles[column.status]}`}
                  aria-hidden="true"
                />
                {column.title}
              </h2>
              <span className={styles.count} aria-label={`${columnTasks.length} tasks`}>
                {columnTasks.length}
              </span>
            </header>
            <ul className={styles.taskList}>
              {columnTasks.length > 0 ? (
                columnTasks.map((task) => (
                  <li className={styles.taskCard} key={task._id}>
                    <h3 className={styles.taskTitle}>{task.title}</h3>
                    {task.description && (
                      <p className={styles.taskDescription}>{task.description}</p>
                    )}
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
