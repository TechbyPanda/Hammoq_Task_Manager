import type { Task } from "../types/task";

const EMPTY_MESSAGE = "No tasks yet.";

export function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) return <p>{EMPTY_MESSAGE}</p>;

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task._id}>
          <strong>{task.title}</strong> — {task.status}
        </li>
      ))}
    </ul>
  );
}
