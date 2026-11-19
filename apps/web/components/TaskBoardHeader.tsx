import type { ReactNode } from "react";
import styles from "./TaskBoardHeader.module.css";

export function TaskBoardHeader({ action }: { action?: ReactNode }) {
  return (
    <header className={styles.header}>
      <div>
        <p className={styles.eyebrow}>Workspace</p>
        <h1 className={styles.title}>Tasks</h1>
        <p className={styles.subtitle}>Keep your work moving forward.</p>
      </div>
      {action}
    </header>
  );
}
