import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  FileText,
  ImageIcon,
  Video,
  File,
  Calendar,
  BarChart3,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

// Mock data - replace with actual data fetching
const mockContents = [
  {
    id: "1",
    title: "Guia Completo de React Hooks",
    description:
      "Um guia abrangente sobre como usar React Hooks em seus projetos",
    type: "article",
    status: "published",
    visibility: "public",
    author: {
      name: "João Silva",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-16T14:20:00Z",
    views: 1250,
    likes: 89,
    comments: 23,
    mediaCount: 5,
    tags: ["React", "JavaScript", "Frontend"],
  },
  {
    id: "2",
    title: "Tutorial de Next.js 15",
    description: "Aprenda as novidades do Next.js 15 com exemplos práticos",
    type: "video",
    status: "draft",
    visibility: "private",
    author: {
      name: "Maria Santos",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-14T16:45:00Z",
    views: 0,
    likes: 0,
    comments: 0,
    mediaCount: 1,
    tags: ["Next.js", "React", "Tutorial"],
  },
  {
    id: "3",
    title: "Recursos da Comunidade",
    description: "Lista de recursos úteis para desenvolvedores",
    type: "resource",
    status: "published",
    visibility: "members_only",
    author: {
      name: "Pedro Costa",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: "2024-01-13T11:20:00Z",
    updatedAt: "2024-01-15T08:30:00Z",
    views: 890,
    likes: 45,
    comments: 12,
    mediaCount: 8,
    tags: ["Recursos", "Links", "Ferramentas"],
  },
];

const mockStats = {
  total: 156,
  published: 134,
  draft: 18,
  archived: 4,
};

function getContentIcon(type: string) {
  switch (type) {
    case "video":
      return <Video className="h-4 w-4" />;
    case "image":
      return <ImageIcon className="h-4 w-4" />;
    case "resource":
      return <File className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "published":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "draft":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "archived":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
}

function getVisibilityColor(visibility: string) {
  switch (visibility) {
    case "public":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "members_only":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case "private":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

interface PageProps {
  params: {
    community_id: string;
  };
}

export default async function CommunityContentsPage({ params }: PageProps) {
  const { community_id } = params;

  // Mock community data - replace with actual data fetching
  const community = {
    id: community_id,
    name: "Comunidade de Desenvolvedores",
    slug: "dev-community",
  };

  if (!community) {
    notFound();
  }

  const breadcrumbs = [
    { label: "Comunidades", href: "/communities" },
    { label: community.name, href: `/community/${community_id}` },
    { label: "Conteúdos", href: `/community/${community_id}/contents` },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Conteúdos"
        description="Gerencie todos os conteúdos da comunidade"
        breadcrumbs={breadcrumbs}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button asChild size="sm">
              <Link href={`/community/${community_id}/content/new`}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Conteúdo
              </Link>
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.total}</div>
            <p className="text-xs text-muted-foreground">conteúdos criados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publicados</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockStats.published}
            </div>
            <p className="text-xs text-muted-foreground">visíveis ao público</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rascunhos</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {mockStats.draft}
            </div>
            <p className="text-xs text-muted-foreground">em desenvolvimento</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Arquivados</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {mockStats.archived}
            </div>
            <p className="text-xs text-muted-foreground">não visíveis</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar conteúdos..." className="pl-10" />
              </div>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="published">Publicados</SelectItem>
                  <SelectItem value="draft">Rascunhos</SelectItem>
                  <SelectItem value="archived">Arquivados</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="article">Artigos</SelectItem>
                  <SelectItem value="video">Vídeos</SelectItem>
                  <SelectItem value="resource">Recursos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockContents.map((content) => (
              <div
                key={content.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                    {getContentIcon(content.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{content.title}</h3>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(content.status)}
                      >
                        {content.status === "published"
                          ? "Publicado"
                          : content.status === "draft"
                          ? "Rascunho"
                          : "Arquivado"}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={getVisibilityColor(content.visibility)}
                      >
                        {content.visibility === "public"
                          ? "Público"
                          : content.visibility === "members_only"
                          ? "Membros"
                          : "Privado"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                      {content.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Avatar className="h-4 w-4">
                          <AvatarImage
                            src={content.author.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {content.author.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span>{content.author.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(content.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BarChart3 className="h-3 w-3" />
                        <span>{content.views} visualizações</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <File className="h-3 w-3" />
                        <span>{content.mediaCount} mídias</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {content.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/community/${community_id}/content/${content.id}`}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/community/${community_id}/content/${content.id}/edit`}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
