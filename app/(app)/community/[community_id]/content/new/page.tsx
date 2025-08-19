import { ContentUpsertForm } from "@/app/lib/frontend/components/form/upsert.content.form";
import { PageHeader } from "@/app/lib/frontend/components/page-header";
import { nanoid } from "nanoid";

interface PageProps {
  params: {
    community_id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { community_id } = await params;
  const contentId = nanoid();

  return (
    <div className="grid gap-4">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Minhas Comunidades", href: "/community" },
          {
            label: "Minha comunidade",
            href: `/community/${community_id}`,
          },
          {
            label: "Meus conteúdos",
            href: `/community/${community_id}/content`,
          },
          { label: "Novo conteúdo" },
        ]}
      />
      <ContentUpsertForm communityId={community_id} contentId={contentId} />
    </div>
  );
}
