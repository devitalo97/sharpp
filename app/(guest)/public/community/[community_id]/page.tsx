import { Suspense } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  FileText,
  Calendar,
  Globe,
  Lock,
  Eye,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Community } from "@/app/lib/backend/domain/entity/community.entity";
import { findOneByIdCommunityAction } from "@/app/lib/backend/action/community.action";
import { notFound } from "next/navigation";

function CommunityOverviewSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    </div>
  );
}

async function CommunityOverview({
  community,
}: {
  community: CustomCommunity;
}) {
  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "public":
        return <Globe className="h-4 w-4" />;
      case "private":
        return <Lock className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const getVisibilityLabel = (visibility: string) => {
    switch (visibility) {
      case "public":
        return "Pública";
      case "private":
        return "Privada";
      default:
        return "Restrita";
    }
  };

  return (
    <div className="space-y-8">
      {/* Community Header */}
      <div className="space-y-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">
            {community.name}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {community.description}
          </p>
        </div>

        {/* Tags */}
        {community.tags && community.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {community.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Community Meta */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            {getVisibilityIcon(community.visibility)}
            <span>{getVisibilityLabel(community.visibility)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Criada em {community.created_at.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Idioma: {community.language}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membros</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {community.member_count.toLocaleString("pt-BR")}
            </div>
            <p className="text-xs text-muted-foreground">
              membros ativos na comunidade
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conteúdos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {community.published_content_count}
            </div>
            <p className="text-xs text-muted-foreground">
              conteúdos publicados disponíveis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Conteúdos
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{community.content_count}</div>
            <p className="text-xs text-muted-foreground">
              incluindo rascunhos e arquivados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button asChild size="lg">
          <Link href={`/public/community/${community.id}/content`}>
            <FileText className="mr-2 h-4 w-4" />
            Ver Conteúdos
          </Link>
        </Button>
        <Button variant="outline" size="lg">
          <ExternalLink className="mr-2 h-4 w-4" />
          Compartilhar Comunidade
        </Button>
      </div>
    </div>
  );
}

interface CustomCommunity extends Community {
  member_count: number;
  content_count: number;
  published_content_count: number;
  member_status: string;
}

export default async function Page({
  params,
}: {
  params: Promise<{ community_id: string }>;
}) {
  const { community_id } = await params;
  const _community = await findOneByIdCommunityAction(community_id);
  if (!_community) {
    return notFound();
  }

  const community = {
    ..._community,
    member_count: 1250,
    content_count: 89,
    published_content_count: 67,
    member_status: "active" as const,
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/public/community">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para comunidades
            </Link>
          </Button>
        </div>

        {/* Community Overview */}
        <Suspense fallback={<CommunityOverviewSkeleton />}>
          <CommunityOverview community={community} />
        </Suspense>
      </div>
    </div>
  );
}
