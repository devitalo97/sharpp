import { findManyArtifactAction } from "../lib/backend/action/artifact.action";
import { CreateManyArtifactForm } from "../lib/frontend/components/form/artifact.create-many.form";
import { ArtifactList } from "../lib/frontend/components/list/artifact.list";

export default async function Home() {
  const artifacts = await findManyArtifactAction();
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Artifact Gallery</h1>
        <p className="text-muted-foreground">
          Manage and view your uploaded artifacts with detailed information and
          download capabilities.
        </p>
      </div>
      <CreateManyArtifactForm />
      <ArtifactList artifacts={artifacts} />
    </div>
  );
}
