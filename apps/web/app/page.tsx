"use client";

import { TaskList } from "../components/TaskList";
import { useTasks } from "../hooks/useTasks";

const LOADING_MESSAGE = "Loading tasks…";

export default function Home() {
  const { data, error, isPending } = useTasks();

  if (isPending) return <p>{LOADING_MESSAGE}</p>;
  if (error) return <p role="alert">{error.message}</p>;

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold">Tasks</h1>
      <TaskList tasks={data.items} />
    </main>
  );
}
