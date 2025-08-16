import { findOneByIdContentAction } from "@/app/lib/backend/action/content.action";
import { ContentUpsertForm } from "@/app/lib/frontend/components/form/upsert.content.form";
import { PageHeader } from "@/app/lib/frontend/components/page-header";

interface PageProps {
  params: {
    community_id: string;
    content_id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { community_id, content_id } = await params;
  const content = await findOneByIdContentAction(content_id);

  if (!content) return;

  return (
    <div className="grid gap-4">
      <PageHeader
        title="Editar link de conteúdo"
        description="Faça upload de múltiplas mídias digitais e organize seu conteúdo com
            metadados personalizados."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Minhas Comunidades", href: "/community" },
          { label: "Minha comunidade", href: "/community/1" },
          { label: "Meus conteúdos", href: "/community/1/content" },
          {
            label: `Editar conteúdo - ${content.name}`,
            href: `/community/1/content/${content.id}/edit`,
          },
        ]}
      />
      <ContentUpsertForm
        initialData={content}
        communityId={community_id}
        mode="edit"
      />
    </div>
  );
}
