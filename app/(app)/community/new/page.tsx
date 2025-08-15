import { CommunityForm } from "@/app/lib/frontend/components/form/community.form";
import { PageHeader } from "@/app/lib/frontend/components/page-header";

export default function Page() {
  return (
    <div className="grid gap-4">
      <PageHeader
        title="Criar Nova Comunidade"
        description="Configure sua comunidade em algumas etapas simples."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Minhas Comunidades", href: "/community" },
          { label: "Nova Comunidade" },
        ]}
      />
      <CommunityForm />
    </div>
  );
}
