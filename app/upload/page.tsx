import { findManyArtifactAction } from "../lib/backend/action/artifact.action";
import { CreateManyArtifactForm } from "../lib/frontend/components/form/artifact.create-many.form";
import { ArtifactList } from "../lib/frontend/components/list/artifact.list";

export default async function Home() {
  const artifacts = await findManyArtifactAction();
  return (
    <div className="max-w-4xl mx-auto">
      <CreateManyArtifactForm />
      <ArtifactList artifacts={artifacts} />
    </div>
  );
}
