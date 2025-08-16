import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Palette, Upload, AlertTriangle, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SettingCommunityForm } from "@/app/lib/frontend/components/form/setting.community.form";
import { findOneByIdCommunityAction } from "@/app/lib/backend/action/community.action";

interface PageProps {
  params: {
    community_id: string;
  };
}

export default async function CommunityConfigurationPage({
  params,
}: PageProps) {
  const { community_id } = params;

  const community = await findOneByIdCommunityAction(community_id);

  if (!community) {
    notFound();
  }

  const breadcrumbs = [
    { label: "Comunidades", href: "/community" },
    { label: community.name, href: `/community/${community_id}` },
    {
      label: "Configurações",
      href: `/community/${community_id}/configuration`,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        description="Gerencie as configurações da comunidade"
        breadcrumbs={breadcrumbs}
        actions={
          <Button size="sm">
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <SettingCommunityForm community={community} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Community Avatar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Aparência
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Avatar da Comunidade</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={"/placeholder.svg"} />
                    <AvatarFallback>{community.name[0]}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Alterar
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Banner da Comunidade</Label>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Clique para fazer upload
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme">Tema</Label>
                <Select defaultValue="Padrão">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Padrão</SelectItem>
                    <SelectItem value="dark">Escuro</SelectItem>
                    <SelectItem value="blue">Azul</SelectItem>
                    <SelectItem value="green">Verde</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

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
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Zona de Perigo
              </CardTitle>
              <CardDescription>
                Ações irreversíveis que afetam permanentemente a comunidade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="destructive" className="w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir Comunidade
              </Button>
              <p className="text-xs text-muted-foreground">
                Esta ação não pode ser desfeita. Todos os dados serão perdidos
                permanentemente.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
