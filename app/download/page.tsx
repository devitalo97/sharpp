import { findManyArtifactAction } from "../lib/backend/action/artifact.action";
import DownloadsPage from "../lib/frontend/components/page/download.artifact.page";

export default async function Page() {
  const artifacts = await findManyArtifactAction();
  return <DownloadsPage artifacts={artifacts} />;
}
