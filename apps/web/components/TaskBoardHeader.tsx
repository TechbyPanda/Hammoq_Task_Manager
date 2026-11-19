import styles from "./TaskBoardHeader.module.css";

export function TaskBoardHeader() {
  return (
    <header className={styles.header}>
      <p className={styles.eyebrow}>Workspace</p>
      <h1 className={styles.title}>Tasks</h1>
      <p className={styles.subtitle}>Keep your work moving forward.</p>
    </header>
  );
}
