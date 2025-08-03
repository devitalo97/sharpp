"use client";
import Image from "next/image";
import {
  ImageIcon,
  X,
  FileIcon,
  VideoIcon,
  FileTextIcon,
  TagIcon,
  InfoIcon,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Artifact } from "@/app/lib/backend/domain/artifact.entity";

interface ArtifactListProps {
  artifacts: Artifact[];
  onDelete?: (artifactId: string) => void;
}

const getTypeIcon = (type: Artifact["type"]) => {
  switch (type) {
    case "image":
      return <ImageIcon className="h-4 w-4" />;
    case "video":
      return <VideoIcon className="h-4 w-4" />;
    case "pdf":
      return <FileTextIcon className="h-4 w-4" />;
    default:
      return <FileIcon className="h-4 w-4" />;
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
  }).format(date);
};

export function ArtifactList({ artifacts, onDelete }: ArtifactListProps) {
  const handleDelete = (artifactId: string) => {
    if (onDelete) {
      onDelete(artifactId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Gallery ({artifacts.length}{" "}
          {artifacts.length === 1 ? "item" : "items"})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {artifacts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No artifacts uploaded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artifacts.map((artifact) => {
              const fileName = artifact.key.split("/").pop() || artifact.id;
              const displayTitle = artifact.title || fileName;
              const src = artifact.signed_url || "/placeholder.svg";

              return (
                <Card
                  key={artifact.id}
                  className="group relative overflow-hidden"
                >
                  {/* Header with type and delete button */}
                  <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10">
                    <Badge
                      className={`${getTypeColor(artifact.type)} border-0`}
                    >
                      {getTypeIcon(artifact.type)}
                      <span className="ml-1 capitalize">{artifact.type}</span>
                    </Badge>

                    {onDelete && (
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDelete(artifact.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Media Preview */}
                  <div className="aspect-video overflow-hidden bg-muted">
                    {artifact.type === "image" ? (
                      <Image
                        src={src || "/placeholder.svg"}
                        alt={displayTitle}
                        width={400}
                        height={300}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-muted">
                        <div className="text-center">
                          {getTypeIcon(artifact.type)}
                          <p className="text-sm text-muted-foreground mt-2">
                            {artifact.type.toUpperCase()} File
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4 space-y-3">
                    {/* Title and Description */}
                    <div>
                      <h3
                        className="font-semibold text-sm line-clamp-2"
                        title={displayTitle}
                      >
                        {displayTitle}
                      </h3>
                      {artifact.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {artifact.description}
                        </p>
                      )}
                    </div>

                    {/* Tags */}
                    {artifact.tags && artifact.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {artifact.tags.slice(0, 3).map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            <TagIcon className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {artifact.tags.length > 3 && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant="outline" className="text-xs">
                                  +{artifact.tags.length - 3}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="space-y-1">
                                  {artifact.tags.slice(3).map((tag, index) => (
                                    <div key={index} className="text-xs">
                                      {tag}
                                    </div>
                                  ))}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    )}

                    <Separator />

                    {/* Metadata */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <InfoIcon className="h-3 w-3" />
                        <span>Details</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {artifact.metadata?.size_bytes && (
                          <div>
                            <span className="text-muted-foreground">Size:</span>
                            <span className="ml-1">
                              {formatFileSize(artifact.metadata.size_bytes)}
                            </span>
                          </div>
                        )}

                        {artifact.metadata?.width &&
                          artifact.metadata?.height && (
                            <div>
                              <span className="text-muted-foreground">
                                Dimensions:
                              </span>
                              <span className="ml-1">
                                {artifact.metadata.width}×
                                {artifact.metadata.height}
                              </span>
                            </div>
                          )}

                        {artifact.metadata?.format && (
                          <div>
                            <span className="text-muted-foreground">
                              Format:
                            </span>
                            <span className="ml-1 uppercase">
                              {artifact.metadata.format}
                            </span>
                          </div>
                        )}

                        <div>
                          <span className="text-muted-foreground">
                            Created:
                          </span>
                          <span className="ml-1">
                            {formatDate(artifact.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Custom Attributes */}
                    {artifact.attributes && artifact.attributes.length > 0 && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <TagIcon className="h-3 w-3" />
                            <span>Attributes</span>
                          </div>

                          <div className="space-y-1">
                            {artifact.attributes
                              .slice(0, 3)
                              .map((attr, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between text-xs"
                                >
                                  <span className="text-muted-foreground truncate">
                                    {attr.key}:
                                  </span>
                                  <span
                                    className="ml-2 truncate"
                                    title={attr.value}
                                  >
                                    {attr.value}
                                  </span>
                                </div>
                              ))}

                            {artifact.attributes.length > 3 && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-auto p-0 text-xs text-muted-foreground"
                                    >
                                      +{artifact.attributes.length - 3} more
                                      attributes
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <div className="space-y-1 max-w-xs">
                                      {artifact.attributes
                                        .slice(3)
                                        .map((attr, index) => (
                                          <div
                                            key={index}
                                            className="flex justify-between text-xs"
                                          >
                                            <span className="text-muted-foreground">
                                              {attr.key}:
                                            </span>
                                            <span className="ml-2">
                                              {attr.value}
                                            </span>
                                          </div>
                                        ))}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
