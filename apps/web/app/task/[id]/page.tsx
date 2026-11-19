import { TaskDetailPage } from "../../../components/TaskDetailPage";

type TaskPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TaskPage({ params }: TaskPageProps) {
  const { id } = await params;

  return <TaskDetailPage taskId={id} />;
}
