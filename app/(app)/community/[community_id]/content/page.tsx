import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
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
  Heart,
  MessageCircle,
  TrendingUp,
  Clock,
  Archive,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { findOneByIdCommunityAction } from "@/app/lib/backend/action/community.action";
import { findManyContentAction } from "@/app/lib/backend/action/content.action";
import { Content } from "@/app/lib/backend/domain/entity/content.entity";

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

function StatsCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: any;
}) {
  return (
    <Card className="border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

function ContentCard({
  content,
  communityId,
}: {
  content: CustomContent;
  communityId: string;
}) {
  return (
    <Card className="border">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-lg border flex items-center justify-center">
              {getContentIcon(content.type)}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-medium text-base leading-tight mb-1">
                  {content.name}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {content.status === "published"
                      ? "Publicado"
                      : content.status === "draft"
                      ? "Rascunho"
                      : "Arquivado"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {content.medias?.length} mídias
                  </span>
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
                      href={`/community/${communityId}/content/${content.id}`}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/community/${communityId}/content/${content.id}/edit`}
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

            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {content.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Avatar className="h-5 w-5">
                    <AvatarImage
                      src={content.author.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback className="text-xs">
                      {content.author.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span>{content.author.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {formatDate(content.created_at.toLocaleDateString())}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <BarChart3 className="h-3 w-3" />
                  <span>{content.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  <span>{content.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  <span>{content.comments}</span>
                </div>
              </div>
            </div>

            {content.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {content.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {content.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{content.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface CustomContent extends Content {
  type: string;
  author: { name: string; avatar: string };
  views: number;
  likes: number;
  comments: number;
}
export default async function CommunityContentsPage({ params }: PageProps) {
  const { community_id } = await params;

  // Mock community data - replace with actual data fetching
  const community = await findOneByIdCommunityAction(community_id);
  const _contents = await findManyContentAction({});

  const contents: CustomContent[] = _contents.map((c) => ({
    ...c,
    type: "resource",
    author: {
      name: "Pedro Costa",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    views: 890,
    likes: 45,
    comments: 12,
  }));

  if (!community) {
    notFound();
  }

  const breadcrumbs = [
    { label: "Comunidades", href: "/communities" },
    { label: community.name, href: `/community/${community_id}` },
    { label: "Conteúdos", href: `/community/${community_id}/content` },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Conteúdos"
        description="Gerencie todos os conteúdos da comunidade"
        breadcrumbs={breadcrumbs}
        actions={
          <div className="flex items-center gap-3">
            <Button asChild size="sm" className="gap-2">
              <Link href={`/community/${community_id}/content/new`}>
                <Plus className="h-4 w-4" />
                Novo Conteúdo
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Total"
          value={mockStats.total}
          description="conteúdos criados"
          icon={FileText}
        />
        <StatsCard
          title="Publicados"
          value={mockStats.published}
          description="visíveis ao público"
          icon={TrendingUp}
        />
        <StatsCard
          title="Rascunhos"
          value={mockStats.draft}
          description="em desenvolvimento"
          icon={Clock}
        />
        <StatsCard
          title="Arquivados"
          value={mockStats.archived}
          description="não visíveis"
          icon={Archive}
        />
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar conteúdos..." className="pl-10" />
              </div>
            </div>
          </div>
        </CardHeader>

        <Tabs defaultValue="all" className="w-full">
          <div className="px-6 pb-4">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
              <TabsTrigger value="all" className="gap-2">
                <FileText className="h-4 w-4" />
                Todos
              </TabsTrigger>
              <TabsTrigger value="published" className="gap-2">
                <Eye className="h-4 w-4" />
                Publicados
              </TabsTrigger>
              <TabsTrigger value="draft" className="gap-2">
                <Edit className="h-4 w-4" />
                Rascunhos
              </TabsTrigger>
              <TabsTrigger value="archived" className="gap-2">
                <Archive className="h-4 w-4" />
                Arquivados
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-0">
            <CardContent className="pt-0">
              <div className="grid gap-4">
                {contents.map((content) => (
                  <ContentCard
                    key={content.id}
                    content={content}
                    communityId={community_id}
                  />
                ))}
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="published" className="mt-0">
            <CardContent className="pt-0">
              <div className="grid gap-4">
                {contents
                  .filter((c) => c.status === "published")
                  .map((content) => (
                    <ContentCard
                      key={content.id}
                      content={content}
                      communityId={community_id}
                    />
                  ))}
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="draft" className="mt-0">
            <CardContent className="pt-0">
              <div className="grid gap-4">
                {contents
                  .filter((c) => c.status === "draft")
                  .map((content) => (
                    <ContentCard
                      key={content.id}
                      content={content}
                      communityId={community_id}
                    />
                  ))}
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="archived" className="mt-0">
            <CardContent className="pt-0">
              <div className="grid gap-4">
                {contents
                  .filter((c) => c.status === "archived")
                  .map((content) => (
                    <ContentCard
                      key={content.id}
                      content={content}
                      communityId={community_id}
                    />
                  ))}
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
