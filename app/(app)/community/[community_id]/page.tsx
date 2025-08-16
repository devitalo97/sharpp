import { PageHeader } from "@/app/lib/frontend/components/page-header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";
import {
  Users,
  FileText,
  HardDrive,
  Eye,
  EyeOff,
  Edit,
  Settings,
  Plus,
  Copy,
  Calendar,
  User,
  Trash2,
  Archive,
  UserPlus,
  ExternalLink,
} from "lucide-react";

type CommunityStatus = "active" | "paused" | "archived";
type CommunityVisibility = "private" | "unlisted" | "public";

interface Community {
  id: string;
  tenant_id: string;
  name: string;
  slug: string;
  description?: string;
  status: CommunityStatus;
  visibility: CommunityVisibility;
  tags?: string[];
  limits?: { members_qty?: number };
  owner_id: string;
  created_at: Date;
  updated_at: Date;
}

interface CommunityStats {
  members_count: number;
  contents_count: number;
  storage_used_bytes: number;
}

interface RecentContent {
  id: string;
  name: string;
  medias_count: number;
  updated_at: Date;
}

interface MemberPreview {
  id: string;
  name: string;
  role: "owner" | "admin" | "member";
  avatar_url?: string;
}

// Mock data for demonstration
const mockCommunity: Community = {
  id: "comm-123",
  tenant_id: "tenant-1",
  name: "Comunidade de Desenvolvedores",
  slug: "dev-community",
  description:
    "Uma comunidade para desenvolvedores compartilharem conhecimento e experiências sobre tecnologia.",
  status: "active",
  visibility: "public",
  tags: ["Tecnologia", "Desenvolvimento", "JavaScript", "React"],
  limits: { members_qty: 1000 },
  owner_id: "user-1",
  created_at: new Date("2024-01-15"),
  updated_at: new Date("2024-12-15"),
};

const mockStats: CommunityStats = {
  members_count: 247,
  contents_count: 89,
  storage_used_bytes: 2147483648, // 2GB
};

const mockRecentContent: RecentContent[] = [
  {
    id: "content-1",
    name: "Guia Completo de React Hooks",
    medias_count: 5,
    updated_at: new Date("2024-12-14"),
  },
  {
    id: "content-2",
    name: "Melhores Práticas em TypeScript",
    medias_count: 3,
    updated_at: new Date("2024-12-13"),
  },
  {
    id: "content-3",
    name: "Deploy com Vercel",
    medias_count: 8,
    updated_at: new Date("2024-12-12"),
  },
];

const mockMembers: MemberPreview[] = [
  {
    id: "user-1",
    name: "João Silva",
    role: "owner",
    avatar_url: undefined,
  },
  {
    id: "user-2",
    name: "Maria Santos",
    role: "admin",
    avatar_url: undefined,
  },
  {
    id: "user-3",
    name: "Pedro Costa",
    role: "member",
    avatar_url: undefined,
  },
  {
    id: "user-4",
    name: "Ana Oliveira",
    role: "member",
    avatar_url: undefined,
  },
];

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getStatusBadgeVariant(status: CommunityStatus) {
  switch (status) {
    case "active":
      return "default";
    case "paused":
      return "secondary";
    case "archived":
      return "destructive";
    default:
      return "outline";
  }
}

function getStatusLabel(status: CommunityStatus) {
  switch (status) {
    case "active":
      return "Ativa";
    case "paused":
      return "Pausada";
    case "archived":
      return "Arquivada";
    default:
      return status;
  }
}

function getVisibilityIcon(visibility: CommunityVisibility) {
  switch (visibility) {
    case "public":
      return Eye;
    case "unlisted":
      return EyeOff;
    case "private":
      return EyeOff;
    default:
      return Eye;
  }
}

function getVisibilityLabel(visibility: CommunityVisibility) {
  switch (visibility) {
    case "public":
      return "Pública";
    case "unlisted":
      return "Não listada";
    case "private":
      return "Privada";
    default:
      return visibility;
  }
}

function getRoleBadgeVariant(role: string) {
  switch (role) {
    case "owner":
      return "default";
    case "admin":
      return "secondary";
    case "member":
      return "outline";
    default:
      return "outline";
  }
}

function getRoleLabel(role: string) {
  switch (role) {
    case "owner":
      return "Proprietário";
    case "admin":
      return "Admin";
    case "member":
      return "Membro";
    default:
      return role;
  }
}

export default function CommunityPage({
  params,
}: {
  params: { community_id: string };
}) {
  const community = mockCommunity;
  const stats = mockStats;
  const recentContent = mockRecentContent;
  const members = mockMembers;

  const VisibilityIcon = getVisibilityIcon(community.visibility);
  const publicUrl =
    community.visibility !== "private"
      ? `${process.env.NEXT_PUBLIC_APP_URL || "https://app.example.com"}/c/${
          community.slug
        }`
      : null;

  return (
    <div className="grid gap-4">
      <PageHeader
        // title={
        //   <div className="flex items-center gap-2">
        //     {community.name}
        //     <Badge variant={getStatusBadgeVariant(community.status)}>{getStatusLabel(community.status)}</Badge>
        //   </div>
        // }
        title={community.name}
        description="Gerencie sua comunidade, conteúdos e membros"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Minhas Comunidades", href: "/community" },
          { label: community.name, href: `/community/${community.id}` },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/community/${community.id}/edit`}>
                <Edit className="h-4 w-4" />
                Editar
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href={`/community/${community.id}/content/new`}>
                <Plus className="h-4 w-4" />
                Novo conteúdo
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`/community/${community.id}/member`}>
                <Users className="h-4 w-4" />
                Membros
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`/community/${community.id}/setting`}>
                <Settings className="h-4 w-4" />
                Configurações
              </Link>
            </Button>
          </div>
        }
      />

      {/* Navigation Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview" asChild>
            <Link href={`/community/${community.id}`}>Visão geral</Link>
          </TabsTrigger>
          <TabsTrigger value="content" asChild>
            <Link href={`/community/${community.id}/content`}>Conteúdos</Link>
          </TabsTrigger>
          <TabsTrigger value="members" asChild>
            <Link href={`/community/${community.id}/member`}>Membros</Link>
          </TabsTrigger>
          <TabsTrigger value="settings" asChild>
            <Link href={`/community/${community.id}/setting`}>
              Configurações
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membros</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.members_count}</div>
            <p className="text-xs text-muted-foreground">
              {community.limits?.members_qty &&
                `de ${community.limits.members_qty} máximo`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conteúdos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.contents_count}</div>
            <p className="text-xs text-muted-foreground">Total publicado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Armazenamento</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatBytes(stats.storage_used_bytes)}
            </div>
            <p className="text-xs text-muted-foreground">Espaço utilizado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visibilidade</CardTitle>
            <VisibilityIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant="outline">
                {getVisibilityLabel(community.visibility)}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">Status atual</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-4 md:col-span-2">
          {/* About Community */}
          <Card>
            <CardHeader>
              <CardTitle>Sobre</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {community.description && (
                <p className="text-sm text-muted-foreground">
                  {community.description}
                </p>
              )}

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Slug:</span>
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  {community.slug}
                </code>
                <Button variant="ghost" size="sm">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              {community.tags && community.tags.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm font-medium">Tags:</span>
                  <div className="flex flex-wrap gap-2">
                    {community.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Content */}
          <Card>
            <CardHeader>
              <CardTitle>Conteúdos Recentes</CardTitle>
              <CardDescription>
                Últimos conteúdos publicados na comunidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentContent.length > 0 ? (
                <div className="space-y-4">
                  {recentContent.map((content) => (
                    <div
                      key={content.id}
                      className="flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{content.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{content.medias_count} mídias</span>
                          <span>•</span>
                          <span>{formatDate(content.updated_at)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button asChild variant="ghost" size="sm">
                          <Link
                            href={`/community/${community.id}/content/${content.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm">
                          <Link
                            href={`/community/${community.id}/content/${content.id}/edit`}
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Separator />
                  <Button
                    asChild
                    variant="outline"
                    className="w-full bg-transparent"
                  >
                    <Link href={`/community/${community.id}/content`}>
                      Ver todos os conteúdos
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Nenhum conteúdo ainda
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Comece criando o primeiro conteúdo da sua comunidade
                  </p>
                  <Button asChild>
                    <Link href={`/community/${community.id}/content/new`}>
                      <Plus className="h-4 w-4 mr-2" />
                      Criar conteúdo
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Atividade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <span className="font-medium">Criada em:</span>{" "}
                  {formatDate(community.created_at)}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <span className="font-medium">Última atualização:</span>{" "}
                  {formatDate(community.updated_at)}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <span className="font-medium">Proprietário:</span>{" "}
                  {community.owner_id}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Members Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Membros</CardTitle>
              <CardDescription>Últimos membros da comunidade</CardDescription>
            </CardHeader>
            <CardContent>
              {members.length > 0 ? (
                <div className="space-y-4">
                  {members.slice(0, 5).map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={member.avatar_url || "/placeholder.svg"}
                        />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {member.name}
                        </p>
                        <Badge
                          variant={getRoleBadgeVariant(member.role)}
                          className="text-xs"
                        >
                          {getRoleLabel(member.role)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <Separator />
                  <Button
                    asChild
                    variant="outline"
                    className="w-full bg-transparent"
                  >
                    <Link href={`/community/${community.id}/member`}>
                      Gerenciar membros
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">
                    Nenhum membro ainda
                  </p>
                  <Button asChild size="sm">
                    <Link href={`/community/${community.id}/member/invite`}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Convidar membros
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Status</Label>
                  <p className="text-xs text-muted-foreground">
                    Ativar ou pausar a comunidade
                  </p>
                </div>
                <Switch
                  checked={community.status === "active"}
                  disabled={community.status === "archived"}
                />
              </div>

              <Separator />

              {/* Visibility Settings */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Visibilidade</Label>
                <RadioGroup
                  defaultValue={community.visibility}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private" className="text-sm">
                      Privada
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unlisted" id="unlisted" />
                    <Label htmlFor="unlisted" className="text-sm">
                      Não listada
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public" className="text-sm">
                      Pública
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Public Link */}
              {publicUrl && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Link público</Label>
                    <div className="flex gap-2">
                      <Input value={publicUrl} readOnly className="text-xs" />
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={publicUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Destructive Actions */}
              <div className="space-y-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                    >
                      <Archive className="h-4 w-4 mr-2" />
                      Arquivar comunidade
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Arquivar comunidade</DialogTitle>
                      <DialogDescription>
                        Tem certeza que deseja arquivar esta comunidade? Ela
                        ficará inacessível para membros, mas os dados serão
                        preservados.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Cancelar</Button>
                      <Button variant="destructive">
                        <Archive className="h-4 w-4 mr-2" />
                        Arquivar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
