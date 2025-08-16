import { ContentLinkForm } from "@/app/lib/frontend/components/form/content-link.form";
import { PageHeader } from "@/app/lib/frontend/components/page-header";

export default function Page() {
  return (
    <div className="grid gap-4">
      <PageHeader
        title="Criar link de conteúdo"
        description="Faça upload de múltiplas mídias digitais e organize seu conteúdo com
            metadados personalizados."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Minhas Comunidades", href: "/community" },
          { label: "Minha comunidade", href: "/community/1" },
          { label: "Meus conteúdos", href: "/community/1/content" },
          { label: "Novo conteúdo" },
        ]}
      />
      <ContentLinkForm />
    </div>
  );
}
