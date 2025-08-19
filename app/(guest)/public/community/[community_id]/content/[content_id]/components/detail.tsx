"use client";

import Image from "next/image";
import {
  Download,
  Copy,
  RefreshCw,
  FileText,
  ImageIcon,
  Video,
  File,
  Calendar,
  Tag,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Content } from "@/app/lib/backend/domain/entity/content.entity";
import { Media } from "@/app/lib/backend/domain/entity/media.entity";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
}

function isUrlExpired(expiresAt?: number): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
}

function getMediaIcon(type: string) {
  if (type.startsWith("image/")) return ImageIcon;
  if (type.startsWith("video/")) return Video;
  return File;
}

function getMediaTypeLabel(type: string): string {
  if (type.startsWith("image/")) return "Imagem";
  if (type.startsWith("video/")) return "Vídeo";
  if (type === "application/pdf") return "PDF";
  if (type === "application/zip") return "Arquivo ZIP";
  return "Arquivo";
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Link copiado!");
  } catch (err) {
    toast("Erro ao copiar");
  }
}

async function refreshMediaUrl(contentId: string, mediaId: string) {
  // Simulate API call to refresh URL
  toast("Link atualizado!" + contentId + mediaId);
}

function MediaCard({
  media,
  content_id,
}: {
  media: Media;
  content_id: string;
}) {
  const MediaIcon = getMediaIcon(media.type);
  const isExpired = isUrlExpired(media.storage.expires_at);

  const renderPreview = () => {
    if (isExpired) {
      return (
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center space-y-2">
            <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">Link expirado</p>
          </div>
        </div>
      );
    }

    if (media.type.startsWith("image/")) {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <div className="aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
              <Image
                src={media.storage.url! || "/placeholder.svg"}
                alt={media.name}
                width={400}
                height={225}
                className="w-full h-full object-cover"
              />
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <Image
              src={media.storage.url! || "/placeholder.svg"}
              alt={media.name}
              width={media.metadata?.width || 800}
              height={media.metadata?.height || 600}
              className="w-full h-auto"
            />
          </DialogContent>
        </Dialog>
      );
    }

    if (media.type.startsWith("video/")) {
      return (
        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
          <video
            controls
            className="w-full h-full"
            poster="/placeholder.svg?height=225&width=400"
          >
            <source src={media.storage.url!} type={media.type} />
            Seu navegador não suporta o elemento de vídeo.
          </video>
        </div>
      );
    }

    return (
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center space-y-2">
          <MediaIcon className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-sm font-medium">{getMediaTypeLabel(media.type)}</p>
        </div>
      </div>
    );
  };

  return (
    <Card className="group">
      <CardHeader className="pb-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <CardTitle className="text-base leading-tight">
              {media.name}
            </CardTitle>
            <div className="flex items-center gap-1">
              {isExpired ? (
                <Badge variant="destructive" className="text-xs">
                  Expirado
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Ativo
                </Badge>
              )}
            </div>
          </div>
          {media.description && (
            <CardDescription className="text-sm line-clamp-2">
              {media.description}
            </CardDescription>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preview */}
        {renderPreview()}

        {/* Tags */}
        {media.tags && media.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {media.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Metadata */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>Tipo:</span>
            <span>{getMediaTypeLabel(media.type)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tamanho:</span>
            <span>{formatBytes(media.size)}</span>
          </div>
          {media.metadata?.width && media.metadata?.height && (
            <div className="flex justify-between">
              <span>Dimensões:</span>
              <span>
                {media.metadata.width} × {media.metadata.height}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {isExpired ? (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => refreshMediaUrl(content_id, media.id)}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar Link
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 bg-transparent"
                asChild
              >
                <a
                  href={`/api/download-media?content_id=${encodeURIComponent(
                    content_id
                  )}&media_id=${encodeURIComponent(media.id)}`}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </a>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => copyToClipboard(media.storage.url!)}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar Link
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function ContentDetail({ content }: { content: Content }) {
  return (
    <div className="space-y-8">
      {/* Content Header */}
      <div className="space-y-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">{content.name}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {content.description}
          </p>
        </div>

        {/* Tags */}
        {content.tags && content.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {content.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Content Meta */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              Publicado em{" "}
              {(
                content.published_at || content.created_at
              ).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>{content.medias.length} mídias disponíveis</span>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Mídias do Conteúdo</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {content.medias.map((media) => (
            <MediaCard key={media.id} media={media} content_id={content.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
