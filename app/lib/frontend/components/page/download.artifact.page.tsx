"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Search,
  Download,
  Eye,
  FileIcon,
  ImageIcon,
  VideoIcon,
  FileTextIcon,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Artifact } from "@/app/lib/backend/domain/artifact.entity";

const getTypeIcon = (type: string) => {
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

const formatFileSize = (bytes: number) => {
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round((bytes / Math.pow(1024, i)) * 100) / 100} ${sizes[i]}`;
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

export default function DownloadsPage(props: { artifacts: Artifact[] }) {
  const { artifacts } = props;
  const [selectedArtifact, setSelectedArtifact] = useState<
    (typeof artifacts)[0] | null
  >(null);

  const handleDownload = (artifactId: string) => {
    const artifact = artifacts.find((a) => a.id === artifactId)!;
    const filename = artifact.title || artifact.key.split("/").pop()!;
    // navegando para a sua própria rota, tudo é same-origin:
    window.location.href = `/api/artifact/download?key=${
      artifact.key
    }&filename=${encodeURIComponent(filename)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-2 mb-6">
            <h1 className="text-4xl font-bold tracking-tight">Downloads</h1>
            <p className="text-lg text-muted-foreground">
              Browse and download your artifacts
            </p>
          </div>
        </div>

        {/* Artifacts Grid/List */}
        {artifacts.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No artifacts found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </CardContent>
          </Card>
        ) : (
          <div
            className={
              "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            }
          >
            {artifacts.map((artifact) => (
              <Card
                key={artifact.id}
                className="group border-border/50 hover:shadow-lg transition-all duration-200"
              >
                <>
                  {/* Grid View */}
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    {artifact.type === "image" ? (
                      <Image
                        src={artifact.signed_url || "/placeholder.svg"}
                        alt={artifact.title || "Artifact"}
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

                    {/* Overlay Controls */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="secondary"
                              onClick={() => setSelectedArtifact(artifact)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View Details</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              onClick={() => handleDownload(artifact.id)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Download</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    {/* Type Badge */}
                    <Badge className="absolute top-2 right-2 bg-background/90 text-foreground">
                      {getTypeIcon(artifact.type)}
                      <span className="ml-1 capitalize">{artifact.type}</span>
                    </Badge>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-2">
                      {artifact.title || artifact.key.split("/").pop()}
                    </h3>

                    {artifact.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                        {artifact.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatDate(artifact.created_at)}</span>
                      <span>
                        {formatFileSize(artifact.metadata?.size_bytes || 0)}
                      </span>
                    </div>

                    {artifact.tags && artifact.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {artifact.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {artifact.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{artifact.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </>
              </Card>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        <Dialog
          open={!!selectedArtifact}
          onOpenChange={() => setSelectedArtifact(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedArtifact && getTypeIcon(selectedArtifact.type)}
                {selectedArtifact?.title ||
                  selectedArtifact?.key.split("/").pop()}
              </DialogTitle>
            </DialogHeader>

            {selectedArtifact && (
              <ScrollArea className="max-h-[70vh]">
                <div className="space-y-6">
                  {/* Preview */}
                  {selectedArtifact.type === "image" && (
                    <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={selectedArtifact.signed_url || "/placeholder.svg"}
                        alt={selectedArtifact.title || "Artifact"}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}

                  {/* Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Type:</span>
                            <Badge variant="outline">
                              {selectedArtifact.type}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Size:</span>
                            <span>
                              {formatFileSize(
                                selectedArtifact.metadata?.size_bytes || 0
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Created:
                            </span>
                            <span>
                              {formatDate(selectedArtifact.created_at)}
                            </span>
                          </div>
                          {selectedArtifact.metadata?.width &&
                            selectedArtifact.metadata?.height && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Dimensions:
                                </span>
                                <span>
                                  {selectedArtifact.metadata.width}×
                                  {selectedArtifact.metadata.height}
                                </span>
                              </div>
                            )}
                        </div>
                      </div>

                      {selectedArtifact.description && (
                        <div>
                          <h4 className="font-semibold mb-2">Description</h4>
                          <p className="text-sm text-muted-foreground">
                            {selectedArtifact.description}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {selectedArtifact.tags &&
                        selectedArtifact.tags.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">Tags</h4>
                            <div className="flex flex-wrap gap-1">
                              {selectedArtifact.tags.map((tag) => (
                                <Badge key={tag} variant="secondary">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                      {selectedArtifact.attributes &&
                        selectedArtifact.attributes.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">Attributes</h4>
                            <div className="space-y-2">
                              {selectedArtifact.attributes.map(
                                (attr, index) => (
                                  <div
                                    key={index}
                                    className="flex justify-between text-sm"
                                  >
                                    <span className="text-muted-foreground">
                                      {attr.key}:
                                    </span>
                                    <span>{attr.value}</span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      onClick={() => handleDownload(selectedArtifact.id)}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedArtifact(null)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
