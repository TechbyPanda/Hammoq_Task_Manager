"use client";

import type { FormEvent } from "react";
import { Button, ButtonLink } from "./Button";
import { ErrorMessage } from "./ErrorMessage";
import {
  TASK_DESCRIPTION_MAX_LENGTH,
  TASK_STATUS_OPTIONS,
  TASK_TITLE_MAX_LENGTH,
} from "../constants/task";
import type { TaskFormValues, TaskStatus } from "../types/task";
import styles from "./TaskForm.module.css";

export type TaskFormProps = {
  cancelHref: string;
  initialValues?: Partial<TaskFormValues>;
  submitLabel: string;
  onSubmit: (values: TaskFormValues) => void;
  isSubmitting: boolean;
  errorMessage?: string;
};

// The inputs are uncontrolled, so we read their values once on submit instead of keeping state.
function readFormValues(form: HTMLFormElement): TaskFormValues {
  const formData = new FormData(form);
  return {
    title: String(formData.get("title")),
    description: String(formData.get("description")),
    status: formData.get("status") as TaskStatus,
  };
}

export function TaskForm({
  cancelHref,
  initialValues,
  submitLabel,
  onSubmit,
  isSubmitting,
  errorMessage,
}: TaskFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(readFormValues(event.currentTarget));
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span>Task name</span>
        <input
          autoComplete="off"
          defaultValue={initialValues?.title}
          maxLength={TASK_TITLE_MAX_LENGTH}
          name="title"
          placeholder="e.g. Prepare project brief"
          required
        />
      </label>
      <label className={styles.field}>
        <span>Description</span>
        <textarea
          defaultValue={initialValues?.description}
          maxLength={TASK_DESCRIPTION_MAX_LENGTH}
          name="description"
          placeholder="Add a few details about this task"
          rows={5}
        />
      </label>
      <label className={styles.field}>
        <span>Status</span>
        <select defaultValue={initialValues?.status ?? "todo"} name="status">
          {TASK_STATUS_OPTIONS.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </label>
      {errorMessage && <ErrorMessage message={errorMessage} />}
      <div className={styles.actions}>
        <ButtonLink href={cancelHref} variant="secondary">
          Cancel
        </ButtonLink>
        <Button disabled={isSubmitting} type="submit">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
