import { Suspense } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Users,
  FileText,
  Calendar,
  Globe,
  Lock,
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
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { Community } from "@/app/lib/backend/domain/entity/community.entity";
import { findManyCommunityAction } from "@/app/lib/backend/action/community.action";

function CommunityCard({ community }: { community: CustomCommunity }) {
  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
              <Link href={`/public/community/${community.id}`}>
                {community.name}
              </Link>
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {community.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            {community.visibility === "public" ? (
              <Globe className="h-4 w-4" />
            ) : community.visibility === "private" ? (
              <Lock className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Tags */}
          {community.tags && community.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {community.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {community.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{community.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>
                  {community.member_count.toLocaleString("pt-BR")} membros
                </span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>{community.content_count} conteúdos</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{community.created_at.toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CommunityListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-14" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

async function CommunityList({
  communities,
}: {
  communities: CustomCommunity[];
}) {
  if (communities.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Nenhuma comunidade encontrada"
        description={"Você ainda não faz parte de nenhuma comunidade."}
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {communities.map((community) => (
        <CommunityCard key={community.id} community={community} />
      ))}
    </div>
  );
}

interface CustomCommunity extends Community {
  member_count: number;
  content_count: number;
  member_status: string;
}

export default async function Page() {
  const _communities = await findManyCommunityAction({});
  const communities = _communities.map((c) => ({
    ...c,
    member_count: 1250,
    content_count: 89,
    member_status: "active" as const,
  }));
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Minhas Comunidades
          </h1>
          <p className="text-muted-foreground">
            Explore e acesse as comunidades das quais você faz parte.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar comunidades..."
                className="pl-9"
                name="search"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Communities List */}
        <Suspense fallback={<CommunityListSkeleton />}>
          <CommunityList communities={communities} />
        </Suspense>
      </div>
    </div>
  );
}
