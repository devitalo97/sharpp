"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ExternalLink,
  Copy,
  FileText,
  ImageIcon,
  Video,
  Download,
  Clock,
  Tag,
} from "lucide-react";
import { formatBytes } from "@/app/lib/frontend/util/format-bytes";
import { formatExpiry } from "@/app/lib/frontend/util/format-expires-at";

interface Media {
  id: string;
  community_id: string;
  content_id: string;
  name: string;
  description?: string;
  type: string;
  size: number;
  metadata?: {
    width?: number;
    height?: number;
    format?: string;
  };
  tags?: string[];
  custom_attributes?: Record<string, string>;
  storage: {
    key: string;
    url?: string;
    expires_at?: number;
    checksum?: string;
  };
}

interface MediaCardProps {
  media: Media;
}

export function MediaCard({ media }: MediaCardProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const isImage = media.type.startsWith("image/");
  const isVideo = media.type.startsWith("video/");
  const isPdf = media.type === "application/pdf";
  const hasValidUrl =
    media.storage.url &&
    (!media.storage.expires_at || media.storage.expires_at > Date.now() / 1000);

  const handleCopyUrl = async () => {
    if (media.storage.url) {
      try {
        await navigator.clipboard.writeText(media.storage.url);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error("Failed to copy URL:", err);
      }
    }
  };

  const handleOpenUrl = () => {
    if (media.storage.url) {
      window.open(media.storage.url, "_blank");
    }
  };

  const renderPreview = () => {
    if (!hasValidUrl) {
      return (
        <div className="aspect-video bg-muted rounded-md border flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <Badge variant="secondary" className="text-xs">
              Sem URL disponível
            </Badge>
          </div>
        </div>
      );
    }

    if (isImage) {
      return (
        <img
          src={media.storage.url || "/placeholder.svg"}
          alt={media.name}
          className="aspect-video object-cover rounded-md border w-full"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            target.nextElementSibling?.classList.remove("hidden");
          }}
        />
      );
    }

    if (isVideo) {
      return (
        <video
          controls
          className="aspect-video rounded-md border w-full"
          preload="metadata"
        >
          <source src={media.storage.url} type={media.type} />
          Seu navegador não suporta reprodução de vídeo.
        </video>
      );
    }

    if (isPdf) {
      return (
        <div className="aspect-video bg-muted rounded-md border flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium mb-2">Documento PDF</p>
            <Button size="sm" onClick={handleOpenUrl}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Abrir PDF
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="aspect-video bg-muted rounded-md border flex items-center justify-center">
        <div className="text-center">
          <Download className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-xs text-muted-foreground mb-3">Arquivo genérico</p>
          <Button size="sm" onClick={handleOpenUrl}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Abrir arquivo
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card className="rounded-2xl overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base truncate">{media.name}</CardTitle>
            {media.description && (
              <CardDescription className="text-sm mt-1">
                {media.description}
              </CardDescription>
            )}
          </div>
          {(isImage || isVideo || isPdf) && (
            <div className="ml-2">
              {isImage && (
                <ImageIcon className="w-4 h-4 text-muted-foreground" />
              )}
              {isVideo && <Video className="w-4 h-4 text-muted-foreground" />}
              {isPdf && <FileText className="w-4 h-4 text-muted-foreground" />}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Preview */}
        {renderPreview()}

        {/* Tags */}
        {media.tags && media.tags.length > 0 && (
          <div className="flex items-center gap-2">
            <Tag className="w-3 h-3 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              {media.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Tipo:</span>
            <span className="font-mono">{media.type}</span>
          </div>

          <div className="flex justify-between">
            <span>Tamanho:</span>
            <span>{formatBytes(media.size)}</span>
          </div>

          {media.metadata?.width && media.metadata?.height && (
            <div className="flex justify-between">
              <span>Dimensões:</span>
              <span>
                {media.metadata.width} × {media.metadata.height}px
              </span>
            </div>
          )}

          {media.metadata?.format && (
            <div className="flex justify-between">
              <span>Formato:</span>
              <span className="font-mono">{media.metadata.format}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Storage:</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="font-mono truncate max-w-24 cursor-help">
                    {media.storage.key}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-mono text-xs">{media.storage.key}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex justify-between items-center">
            <span>Expiração:</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formatExpiry(media.storage.expires_at)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {hasValidUrl ? (
            <>
              <Button size="sm" variant="outline" onClick={handleOpenUrl}>
                <ExternalLink className="w-3 h-3 mr-1" />
                Abrir
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyUrl}
                disabled={copySuccess}
              >
                <Copy className="w-3 h-3 mr-1" />
                {copySuccess ? "Copiado!" : "Copiar URL"}
              </Button>
            </>
          ) : (
            <Button size="sm" variant="outline" disabled>
              <ExternalLink className="w-3 h-3 mr-1" />
              URL indisponível
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
