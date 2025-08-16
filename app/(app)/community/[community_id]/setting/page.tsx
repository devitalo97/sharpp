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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Save,
  Settings,
  Globe,
  Lock,
  Users,
  Bell,
  Palette,
  Upload,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PageProps {
  params: {
    community_id: string;
  };
}

export default async function CommunityConfigurationPage({
  params,
}: PageProps) {
  const { community_id } = params;

  // Mock community data - replace with actual data fetching
  const community = {
    id: community_id,
    name: "Comunidade de Desenvolvedores",
    slug: "dev-community",
    description:
      "Uma comunidade para desenvolvedores compartilharem conhecimento e experiências.",
    avatar: "/placeholder.svg?height=80&width=80",
    banner: "/placeholder.svg?height=200&width=800",
    visibility: "public",
    membershipType: "open",
    allowMemberInvites: true,
    requireApproval: false,
    allowContentCreation: true,
    moderateContent: false,
    enableNotifications: true,
    enableComments: true,
    enableLikes: true,
    theme: "default",
    language: "pt-BR",
    timezone: "America/Sao_Paulo",
  };

  if (!community) {
    notFound();
  }

  const breadcrumbs = [
    { label: "Comunidades", href: "/communities" },
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
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Informações Básicas
              </CardTitle>
              <CardDescription>
                Configure as informações principais da comunidade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Comunidade</Label>
                  <Input id="name" defaultValue={community.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL da Comunidade</Label>
                  <Input id="slug" defaultValue={community.slug} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  defaultValue={community.description}
                  rows={3}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select defaultValue={community.language}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select defaultValue={community.timezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">
                        São Paulo (GMT-3)
                      </SelectItem>
                      <SelectItem value="America/New_York">
                        New York (GMT-5)
                      </SelectItem>
                      <SelectItem value="Europe/London">
                        London (GMT+0)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Access */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Privacidade e Acesso
              </CardTitle>
              <CardDescription>
                Configure quem pode ver e participar da comunidade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="visibility">Visibilidade da Comunidade</Label>
                <Select defaultValue={community.visibility}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <div>
                          <div>Pública</div>
                          <div className="text-xs text-muted-foreground">
                            Qualquer pessoa pode ver
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="private">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        <div>
                          <div>Privada</div>
                          <div className="text-xs text-muted-foreground">
                            Apenas membros podem ver
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="membership">Tipo de Adesão</Label>
                <Select defaultValue={community.membershipType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">
                      Aberta - Qualquer pessoa pode entrar
                    </SelectItem>
                    <SelectItem value="approval">
                      Por Aprovação - Requer aprovação do admin
                    </SelectItem>
                    <SelectItem value="invite">
                      Por Convite - Apenas por convite
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Membros podem convidar outros</Label>
                    <p className="text-sm text-muted-foreground">
                      Permite que membros enviem convites
                    </p>
                  </div>
                  <Switch defaultChecked={community.allowMemberInvites} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Requer aprovação para novos membros</Label>
                    <p className="text-sm text-muted-foreground">
                      Administradores devem aprovar novos membros
                    </p>
                  </div>
                  <Switch defaultChecked={community.requireApproval} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Configurações de Conteúdo
              </CardTitle>
              <CardDescription>
                Configure como o conteúdo é criado e moderado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Membros podem criar conteúdo</Label>
                  <p className="text-sm text-muted-foreground">
                    Permite que membros criem posts e conteúdos
                  </p>
                </div>
                <Switch defaultChecked={community.allowContentCreation} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Moderar conteúdo antes da publicação</Label>
                  <p className="text-sm text-muted-foreground">
                    Conteúdo precisa ser aprovado antes de ficar visível
                  </p>
                </div>
                <Switch defaultChecked={community.moderateContent} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Permitir comentários</Label>
                  <p className="text-sm text-muted-foreground">
                    Membros podem comentar em conteúdos
                  </p>
                </div>
                <Switch defaultChecked={community.enableComments} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Permitir curtidas</Label>
                  <p className="text-sm text-muted-foreground">
                    Membros podem curtir conteúdos
                  </p>
                </div>
                <Switch defaultChecked={community.enableLikes} />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificações
              </CardTitle>
              <CardDescription>
                Configure as notificações da comunidade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações ativadas</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar notificações para membros
                  </p>
                </div>
                <Switch defaultChecked={community.enableNotifications} />
              </div>
            </CardContent>
          </Card>
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
                    <AvatarImage src={community.avatar || "/placeholder.svg"} />
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
                <Select defaultValue={community.theme}>
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
