import { findOneByIdCommunityAction } from "@/app/lib/backend/action/community.action";
import { UpsertBlockForm } from "@/app/lib/frontend/components/form/upsert.block.form";
import { PageHeader } from "@/app/lib/frontend/components/page-header";

interface PageProps {
  params: Promise<{
    community_id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { community_id } = await params;
  const community = await findOneByIdCommunityAction(community_id);

  if (!community) return;

  return (
    <div className="grid">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Minhas Comunidades", href: "/community" },
          {
            label: community.name,
            href: `/community/${community_id}`,
          },
          {
            label: "Conteúdos",
            href: `/community/${community_id}/content`,
          },
          { label: "Novo conteúdo" },
        ]}
      />
      <UpsertBlockForm />
    </div>
  );
}
