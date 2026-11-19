import styles from "./FeedbackMessage.module.css";

export function ErrorMessage({ message }: { message: string }) {
  return (
    <p className={styles.message} role="alert">
      {message}
    </p>
  );
}
