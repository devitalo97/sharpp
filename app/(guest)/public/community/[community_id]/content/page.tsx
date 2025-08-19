import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Filter,
  FileText,
  Calendar,
  Eye,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { Content } from "@/app/lib/backend/domain/entity/content.entity";
import { findManyContentAction } from "@/app/lib/backend/action/content.action";

function ContentCard({ content }: { content: Content }) {
  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="space-y-2">
          <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
            <Link
              href={`/public/community/${content.community_id}/content/${content.id}`}
            >
              {content.name}
            </Link>
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {content.description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Tags */}
          {content.tags && content.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {content.tags.slice(0, 4).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {content.tags.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{content.tags.length - 4}
                </Badge>
              )}
            </div>
          )}

          {/* Meta Info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>{content.medias.length} mídias</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>Publicado</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                {(
                  content.published_at || content.created_at
                ).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

async function ContentList({ contents }: { contents: Content[] }) {
  if (contents.length === 0) {
    return (
      <EmptyState
        title="Nenhum conteúdo encontrado"
        description={"Esta comunidade ainda não possui conteúdos publicados."}
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {contents.map((content) => (
        <ContentCard key={content.id} content={content} />
      ))}
    </div>
  );
}

export default async function Page({
  params,
}: {
  params: { community_id: string };
}) {
  const { community_id } = await params;
  const contents = await findManyContentAction({ community_id });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/public/community/${community_id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para comunidade
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Conteúdos Publicados
          </h1>
          <p className="text-muted-foreground">
            Explore todos os conteúdos disponíveis nesta comunidade.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar conteúdos..."
                className="pl-9"
                name="search"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ContentList contents={contents} />
      </div>
    </div>
  );
}
