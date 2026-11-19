import { EditTaskPage } from "../../../../components/EditTaskPage";

type EditTaskPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditTaskRoute({ params }: EditTaskPageProps) {
  const { id } = await params;

  return <EditTaskPage taskId={id} />;
}
