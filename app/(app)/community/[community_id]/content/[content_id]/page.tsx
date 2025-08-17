import { findOneByIdContentAction } from "@/app/lib/backend/action/content.action";
import { PageHeader } from "@/app/lib/frontend/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  ImageIcon,
  ExternalLink,
  HardDrive,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { formatBytes } from "@/app/lib/frontend/util/format-bytes";
import { MediaCard } from "./components/media-card";

interface PageProps {
  params: {
    community_id: string;
    content_id: string;
  };
}

export default async function ContentDisplayPage({ params }: PageProps) {
  const { community_id, content_id } = await params;

  try {
    const content = await findOneByIdContentAction(content_id);

    if (!content) {
      return (
        <div className="container mx-auto py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Conteúdo não encontrado</CardTitle>
              <CardDescription>
                O conteúdo solicitado não foi encontrado ou você não tem
                permissão para visualizá-lo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link href={`/community/${community_id}/content`}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    const totalMedias = content.medias?.length || 0;
    const totalSize =
      content.medias?.reduce((acc, media) => acc + media.size, 0) || 0;
    const validUrls =
      content.medias?.filter(
        (media) =>
          media.storage.url &&
          (!media.storage.expires_at ||
            media.storage.expires_at > Date.now() / 1000)
      ).length || 0;

    const breadcrumbs = [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Minhas Comunidades", href: "/community" },
      { label: "Comunidade", href: `/community/${community_id}` },
      { label: "Meus conteúdos", href: `/community/${community_id}/content` },
      { label: content.name, href: "#", current: true },
    ];

    return (
      <div className="container mx-auto py-8 space-y-8">
        <PageHeader
          title="Exibir conteúdo"
          description="Visualize os metadados e as mídias do conteúdo."
          breadcrumbs={breadcrumbs}
        />

        {/* Content Summary */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-2xl">{content.name}</CardTitle>
                  {content.slug && (
                    <Badge variant="secondary" className="font-mono text-xs">
                      {content.slug}
                    </Badge>
                  )}
                </div>
                {content.description && (
                  <CardDescription className="text-base leading-relaxed">
                    {content.description}
                  </CardDescription>
                )}
              </div>
            </div>

            {content.tags && content.tags.length > 0 && (
              <div className="flex items-center gap-2 pt-4">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <div className="flex flex-wrap gap-2">
                  {content.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <ImageIcon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{totalMedias}</p>
                  <p className="text-xs text-muted-foreground">
                    {totalMedias === 1 ? "Mídia" : "Mídias"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <HardDrive className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {formatBytes(totalSize)}
                  </p>
                  <p className="text-xs text-muted-foreground">Tamanho total</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <ExternalLink className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{validUrls}</p>
                  <p className="text-xs text-muted-foreground">URLs válidas</p>
                </div>
              </div>
            </div>

            <Separator className="mb-6" />

            <div className="flex gap-3">
              <Button asChild>
                <Link
                  href={`/community/${community_id}/content/${content.id}/edit`}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar conteúdo
                </Link>
              </Button>

              <Button variant="outline" asChild>
                <Link href={`/community/${community_id}/content`}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Media Section */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Mídias anexadas</CardTitle>
            <CardDescription>
              {totalMedias === 0
                ? "Nenhuma mídia foi anexada a este conteúdo."
                : `${totalMedias} ${
                    totalMedias === 1 ? "mídia anexada" : "mídias anexadas"
                  }.`}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {totalMedias === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Nenhuma mídia anexada
                </h3>
                <p className="text-muted-foreground mb-6">
                  Este conteúdo ainda não possui mídias anexadas.
                </p>
                <Button asChild>
                  <Link
                    href={`/community/${community_id}/content/${content.id}/edit`}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar conteúdo
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {content.medias?.map((media) => (
                  <MediaCard key={media.id} media={media} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Erro ao carregar conteúdo</CardTitle>
            <CardDescription>
              Ocorreu um erro ao tentar carregar o conteúdo. Tente novamente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button onClick={() => window.location.reload()}>
                Tentar novamente
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/community/${community_id}/content`}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}
