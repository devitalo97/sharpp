import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingCommunityForm } from "@/app/lib/frontend/components/form/setting.community.form";
import { findOneByIdCommunityAction } from "@/app/lib/backend/action/community.action";
import { AppearanceCommunityForm } from "@/app/lib/frontend/components/form/appearance.community.form";
import { DeleteCommunityForm } from "@/app/lib/frontend/components/form/delete.community.form";

interface PageProps {
  params: {
    community_id: string;
  };
}

export default async function CommunityConfigurationPage({
  params,
}: PageProps) {
  const { community_id } = await params;

  const community = await findOneByIdCommunityAction(community_id);

  if (!community) {
    notFound();
  }

  const breadcrumbs = [
    { label: "Comunidades", href: "/community" },
    { label: community.name, href: `/community/${community_id}` },
    {
      label: "Configurações",
      href: `/community/${community_id}/setting`,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        description="Gerencie as configurações da comunidade"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Configuration */}
        <div className="lg:col-span-2">
          <SettingCommunityForm community={community} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Community Appearance */}
          <AppearanceCommunityForm community={community} />

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Membros</span>
                <span className="font-medium">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Conteúdos</span>
                <span className="font-medium">156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Comentários
                </span>
                <span className="font-medium">2,891</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Criada em</span>
                <span className="font-medium">Jun 2023</span>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <DeleteCommunityForm community_id={community.id} />
        </div>
      </div>
    </div>
  );
}
