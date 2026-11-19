import styles from "./FeedbackMessage.module.css";

export function LoadingMessage({ message }: { message: string }) {
  return (
    <p className={styles.message} role="status">
      {message}
    </p>
  );
}
