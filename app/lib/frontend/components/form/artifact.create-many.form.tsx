"use client";

import type React from "react";

import { uploadArtifactAction } from "@/app/lib/backend/action/artifact.action";
import { useState } from "react";
import { Upload, X, Plus, Trash2, ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ArtifactData {
  file: File;
  title: string;
  description: string;
  customAttributes: { key: string; value: string }[];
  preview: string;
}

export function CreateManyArtifactForm() {
  const [isUploading, setIsUploading] = useState(false);
  const [artifacts, setArtifacts] = useState<ArtifactData[]>([]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newArtifacts: ArtifactData[] = Array.from(files).map((file) => ({
      file,
      title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
      description: "",
      customAttributes: [],
      preview: URL.createObjectURL(file),
    }));

    setArtifacts((prev) => [...prev, ...newArtifacts]);
    event.target.value = "";
  };

  const updateArtifact = (index: number, updates: Partial<ArtifactData>) => {
    setArtifacts((prev) =>
      prev.map((artifact, i) =>
        i === index ? { ...artifact, ...updates } : artifact
      )
    );
  };

  const removeArtifact = (index: number) => {
    setArtifacts((prev) => {
      const artifact = prev[index];
      URL.revokeObjectURL(artifact.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const addCustomAttribute = (artifactIndex: number) => {
    updateArtifact(artifactIndex, {
      customAttributes: [
        ...artifacts[artifactIndex].customAttributes,
        { key: "", value: "" },
      ],
    });
  };

  const updateCustomAttribute = (
    artifactIndex: number,
    attrIndex: number,
    field: "key" | "value",
    value: string
  ) => {
    const updatedAttributes = [...artifacts[artifactIndex].customAttributes];
    updatedAttributes[attrIndex][field] = value;
    updateArtifact(artifactIndex, { customAttributes: updatedAttributes });
  };

  const removeCustomAttribute = (artifactIndex: number, attrIndex: number) => {
    const updatedAttributes = artifacts[artifactIndex].customAttributes.filter(
      (_, i) => i !== attrIndex
    );
    updateArtifact(artifactIndex, { customAttributes: updatedAttributes });
  };

  const handleUpload = async () => {
    if (artifacts.length === 0) return;

    setIsUploading(true);

    try {
      const formData = new FormData();

      artifacts.forEach((artifact, index) => {
        formData.append("files", artifact.file);
        formData.append(`titles[${index}]`, artifact.title);
        formData.append(`descriptions[${index}]`, artifact.description);
        formData.append(
          `attributes[${index}]`,
          JSON.stringify(artifact.customAttributes)
        );
      });

      await uploadArtifactAction(formData);

      // Clear artifacts after successful upload
      artifacts.forEach((artifact) => URL.revokeObjectURL(artifact.preview));
      setArtifacts([]);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Artifacts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Selection */}
        <div className="space-y-2">
          <Label htmlFor="file-upload">Select Images</Label>
          <Input
            id="file-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
          <p className="text-sm text-muted-foreground">
            Select multiple images to upload with custom metadata
          </p>
        </div>

        {/* Artifacts List */}
        {artifacts.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Selected Images ({artifacts.length})
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    artifacts.forEach((artifact) =>
                      URL.revokeObjectURL(artifact.preview)
                    );
                    setArtifacts([]);
                  }}
                >
                  Clear All
                </Button>
              </div>

              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-6">
                  {artifacts.map((artifact, index) => (
                    <Card key={index} className="relative">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
                              <img
                                src={artifact.preview || "/placeholder.svg"}
                                alt={artifact.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <Badge variant="secondary" className="mb-2">
                                {artifact.file.type}
                              </Badge>
                              <p className="text-sm text-muted-foreground">
                                {(artifact.file.size / 1024 / 1024).toFixed(2)}{" "}
                                MB
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeArtifact(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Title */}
                        <div className="space-y-2">
                          <Label htmlFor={`title-${index}`}>Title</Label>
                          <Input
                            id={`title-${index}`}
                            value={artifact.title}
                            onChange={(e) =>
                              updateArtifact(index, { title: e.target.value })
                            }
                            placeholder="Enter image title"
                          />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                          <Label htmlFor={`description-${index}`}>
                            Description
                          </Label>
                          <Textarea
                            id={`description-${index}`}
                            value={artifact.description}
                            onChange={(e) =>
                              updateArtifact(index, {
                                description: e.target.value,
                              })
                            }
                            placeholder="Enter image description"
                            rows={3}
                          />
                        </div>

                        {/* Custom Attributes */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Custom Attributes</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addCustomAttribute(index)}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add Attribute
                            </Button>
                          </div>

                          {artifact.customAttributes.length > 0 && (
                            <div className="space-y-2">
                              {artifact.customAttributes.map(
                                (attr, attrIndex) => (
                                  <div
                                    key={attrIndex}
                                    className="flex items-center gap-2"
                                  >
                                    <Input
                                      placeholder="Key"
                                      value={attr.key}
                                      onChange={(e) =>
                                        updateCustomAttribute(
                                          index,
                                          attrIndex,
                                          "key",
                                          e.target.value
                                        )
                                      }
                                      className="flex-1"
                                    />
                                    <Input
                                      placeholder="Value"
                                      value={attr.value}
                                      onChange={(e) =>
                                        updateCustomAttribute(
                                          index,
                                          attrIndex,
                                          "value",
                                          e.target.value
                                        )
                                      }
                                      className="flex-1"
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        removeCustomAttribute(index, attrIndex)
                                      }
                                      className="text-destructive hover:text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </>
        )}

        {/* Upload Button */}
        {artifacts.length > 0 && (
          <>
            <Separator />
            <Button
              onClick={handleUpload}
              disabled={isUploading || artifacts.length === 0}
              className="w-full"
              size="lg"
            >
              {isUploading ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-spin" />
                  Uploading {artifacts.length} image
                  {artifacts.length > 1 ? "s" : ""}...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload {artifacts.length} image
                  {artifacts.length > 1 ? "s" : ""}
                </>
              )}
            </Button>
          </>
        )}

        {/* Empty State */}
        {artifacts.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No images selected</h3>
            <p className="text-muted-foreground">
              Choose images to upload and add custom metadata
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
