"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  Download,
  Filter,
  Grid3X3,
  List,
  Eye,
  FileIcon,
  ImageIcon,
  VideoIcon,
  FileTextIcon,
  X,
  ChevronDown,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Artifact } from "@/app/lib/backend/domain/artifact.entity";

type ViewMode = "grid" | "list";
type SortBy = "name" | "date" | "size" | "type";
type SortOrder = "asc" | "desc";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedArtifacts, setSelectedArtifacts] = useState<string[]>([]);
  const [selectedArtifact, setSelectedArtifact] = useState<
    (typeof artifacts)[0] | null
  >(null);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    artifacts.forEach((artifact) => {
      artifact.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, []);

  // Filter and sort artifacts
  const filteredArtifacts = useMemo(() => {
    const filtered = artifacts.filter((artifact) => {
      const matchesSearch =
        !searchQuery ||
        artifact.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artifact.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        artifact.tags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesType =
        selectedType === "all" || artifact.type === selectedType;

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => artifact.tags?.includes(tag));

      return matchesSearch && matchesType && matchesTags;
    });

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = (a.title || a.key).localeCompare(b.title || b.key);
          break;
        case "date":
          comparison =
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case "size":
          comparison =
            (a.metadata?.size_bytes || 0) - (b.metadata?.size_bytes || 0);
          break;
        case "type":
          comparison = a.type.localeCompare(b.type);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [searchQuery, selectedType, selectedTags, sortBy, sortOrder]);

  const handleSelectArtifact = (artifactId: string) => {
    setSelectedArtifacts((prev) =>
      prev.includes(artifactId)
        ? prev.filter((id) => id !== artifactId)
        : [...prev, artifactId]
    );
  };

  const handleSelectAll = () => {
    if (selectedArtifacts.length === filteredArtifacts.length) {
      setSelectedArtifacts([]);
    } else {
      setSelectedArtifacts(filteredArtifacts.map((a) => a.id));
    }
  };

  const handleDownload = (artifactId: string) => {
    const artifact = artifacts.find((a) => a.id === artifactId);
    if (artifact?.signed_url) {
      // Create download link
      const link = document.createElement("a");
      link.href = artifact.signed_url;
      link.download =
        artifact.title || artifact.key.split("/").pop() || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleBulkDownload = () => {
    selectedArtifacts.forEach((id) => handleDownload(id));
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
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

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {filteredArtifacts.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Available</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {selectedArtifacts.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Selected</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {formatFileSize(
                      filteredArtifacts.reduce(
                        (acc, a) => acc + (a.metadata?.size_bytes || 0),
                        0
                      )
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Size</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {new Set(filteredArtifacts.map((a) => a.type)).size}
                  </p>
                  <p className="text-xs text-muted-foreground">File Types</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Controls */}
        <Card className="mb-6 border-border/50">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search artifacts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                {/* Type Filter */}
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="image">Images</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                    <SelectItem value="pdf">PDFs</SelectItem>
                    <SelectItem value="other">Others</SelectItem>
                  </SelectContent>
                </Select>

                {/* Tags Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2 bg-transparent">
                      <Filter className="h-4 w-4" />
                      Tags
                      {selectedTags.length > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {selectedTags.length}
                        </Badge>
                      )}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {allTags.map((tag) => (
                      <DropdownMenuItem
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className="flex items-center gap-2"
                      >
                        <Checkbox checked={selectedTags.includes(tag)} />
                        {tag}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Sort */}
                <Select
                  value={`${sortBy}-${sortOrder}`}
                  onValueChange={(value) => {
                    const [by, order] = value.split("-") as [SortBy, SortOrder];
                    setSortBy(by);
                    setSortOrder(order);
                  }}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Newest First</SelectItem>
                    <SelectItem value="date-asc">Oldest First</SelectItem>
                    <SelectItem value="name-asc">Name A-Z</SelectItem>
                    <SelectItem value="name-desc">Name Z-A</SelectItem>
                    <SelectItem value="size-desc">Largest First</SelectItem>
                    <SelectItem value="size-asc">Smallest First</SelectItem>
                    <SelectItem value="type-asc">Type A-Z</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedTags.length > 0 || selectedType !== "all") && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                {selectedType !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Type: {selectedType}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setSelectedType("all")}
                    />
                  </Badge>
                )}
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => toggleTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedArtifacts.length > 0 && (
          <Card className="mb-6 border-border/50 bg-blue-50/50 dark:bg-blue-950/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={
                      selectedArtifacts.length === filteredArtifacts.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="font-medium">
                    {selectedArtifacts.length} of {filteredArtifacts.length}{" "}
                    selected
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleBulkDownload} className="gap-2">
                    <Download className="h-4 w-4" />
                    Download Selected
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedArtifacts([])}
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Artifacts Grid/List */}
        {filteredArtifacts.length === 0 ? (
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
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "space-y-4"
            }
          >
            {filteredArtifacts.map((artifact) => (
              <Card
                key={artifact.id}
                className="group border-border/50 hover:shadow-lg transition-all duration-200"
              >
                {viewMode === "grid" ? (
                  <>
                    {/* Grid View */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {artifact.type === "image" ? (
                        <Image
                          src={artifact.signed_url || "/placeholder.svg"}
                          alt={artifact.title || "Artifact"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-muted">
                          <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-background/80 flex items-center justify-center mb-3 mx-auto">
                              {getTypeIcon(artifact.type)}
                            </div>
                            <p className="text-xs font-medium text-muted-foreground">
                              {artifact.type.toUpperCase()}
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

                      {/* Selection Checkbox */}
                      <div className="absolute top-2 left-2">
                        <Checkbox
                          checked={selectedArtifacts.includes(artifact.id)}
                          onCheckedChange={() =>
                            handleSelectArtifact(artifact.id)
                          }
                          className="bg-background/80"
                        />
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
                ) : (
                  <>
                    {/* List View */}
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={selectedArtifacts.includes(artifact.id)}
                          onCheckedChange={() =>
                            handleSelectArtifact(artifact.id)
                          }
                        />

                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          {artifact.type === "image" ? (
                            <Image
                              src={artifact.signed_url || "/placeholder.svg"}
                              alt={artifact.title || "Artifact"}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              {getTypeIcon(artifact.type)}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">
                            {artifact.title || artifact.key.split("/").pop()}
                          </h3>
                          {artifact.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {artifact.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span>{formatDate(artifact.created_at)}</span>
                            <span>
                              {formatFileSize(
                                artifact.metadata?.size_bytes || 0
                              )}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {artifact.type}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedArtifact(artifact)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDownload(artifact.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </>
                )}
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
