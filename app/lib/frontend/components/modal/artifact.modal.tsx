"use client";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ImageIcon,
  VideoIcon,
  FileTextIcon,
  FileIcon,
  Download,
  Calendar,
  Info,
  Tag,
  Ruler,
  HardDrive,
  FileType,
} from "lucide-react";
import { Artifact } from "@/app/lib/backend/domain/entity/artifact.entity";

interface ArtifactDetailModalProps {
  artifact: Artifact | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: (artifact: Artifact) => void;
}

const getTypeIcon = (type: Artifact["type"]) => {
  switch (type) {
    case "image":
      return <ImageIcon className="h-5 w-5" />;
    case "video":
      return <VideoIcon className="h-5 w-5" />;
    case "pdf":
      return <FileTextIcon className="h-5 w-5" />;
    default:
      return <FileIcon className="h-5 w-5" />;
  }
};

const getTypeColor = (type: Artifact["type"]) => {
  switch (type) {
    case "image":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "video":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case "pdf":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

const formatFileSize = (bytes?: number) => {
  if (!bytes) return "Unknown size";
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round((bytes / Math.pow(1024, i)) * 100) / 100} ${sizes[i]}`;
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};

export function ArtifactDetailModal({
  artifact,
  isOpen,
  onClose,
}: ArtifactDetailModalProps) {
  if (!artifact) return null;

  const fileName = artifact.key.split("/").pop() || artifact.id;
  const displayTitle = artifact.title || fileName;
  const src = artifact.signed_url || "/placeholder.svg";

  const handleDownload = (artifact: Artifact) => {
    const filename = artifact.title || artifact.key.split("/").pop()!;
    // navegando para a sua própria rota, tudo é same-origin:
    window.location.href = `/api/artifact/download?key=${
      artifact.key
    }&filename=${encodeURIComponent(filename)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Badge className={`${getTypeColor(artifact.type)} border-0`}>
                {getTypeIcon(artifact.type)}
                <span className="ml-2 capitalize">{artifact.type}</span>
              </Badge>
              <DialogTitle className="text-xl font-semibold">
                {displayTitle}
              </DialogTitle>
            </div>
            <Button
              onClick={() => handleDownload(artifact)}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="p-6 pt-4 space-y-6">
            {/* Media Preview */}
            <div className="w-full">
              {artifact.type === "image" ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                  <Image
                    src={src || "/placeholder.svg"}
                    alt={displayTitle}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full flex items-center justify-center bg-muted rounded-lg border">
                  <div className="text-center">
                    {getTypeIcon(artifact.type)}
                    <p className="text-lg text-muted-foreground mt-4">
                      {artifact.type.toUpperCase()} File
                    </p>
                    <p className="text-sm text-muted-foreground">{fileName}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {artifact.description && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Description
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {artifact.description}
                </p>
              </div>
            )}

            {/* Tags */}
            {artifact.tags && artifact.tags.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {artifact.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Technical Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Info className="h-5 w-5" />
                Technical Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* File Information */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    File Information
                  </h4>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Size:</span>
                      <span className="text-sm font-medium">
                        {formatFileSize(artifact.metadata?.size_bytes)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FileType className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Content Type:</span>
                      <span className="text-sm font-medium">
                        {artifact.metadata.content_type}
                      </span>
                    </div>

                    {artifact.metadata?.format && (
                      <div className="flex items-center gap-2">
                        <FileIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Format:</span>
                        <span className="text-sm font-medium uppercase">
                          {artifact.metadata.format}
                        </span>
                      </div>
                    )}

                    {artifact.metadata?.width && artifact.metadata?.height && (
                      <div className="flex items-center gap-2">
                        <Ruler className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Dimensions:</span>
                        <span className="text-sm font-medium">
                          {artifact.metadata.width} × {artifact.metadata.height}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timestamps */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Timestamps
                  </h4>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-sm">Created:</div>
                        <div className="text-sm font-medium">
                          {formatDate(artifact.created_at)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-sm">Updated:</div>
                        <div className="text-sm font-medium">
                          {formatDate(artifact.updated_at)}
                        </div>
                      </div>
                    </div>

                    {artifact.signed_url_expires_at && (
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="text-sm">URL Expires:</div>
                          <div className="text-sm font-medium">
                            {formatDate(artifact.signed_url_expires_at)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Attributes */}
            {artifact.attributes && artifact.attributes.length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Custom Attributes
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {artifact.attributes.map((attr, index) => (
                      <div
                        key={index}
                        className="flex flex-col space-y-1 p-3 bg-muted/50 rounded-lg"
                      >
                        <span className="text-sm font-medium text-muted-foreground">
                          {attr.key}
                        </span>
                        <span className="text-sm font-semibold">
                          {attr.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* File Path */}
            <Separator />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">File Path</h3>
              <code className="text-sm bg-muted px-3 py-2 rounded-md block break-all">
                {artifact.key}
              </code>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
