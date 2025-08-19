"use client";
import { Button } from "@/components/ui/button";
import type React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trash2,
  Upload,
  Plus,
  X,
  FileText,
  ImageIcon,
  Video,
  Music,
  Link2,
  CloudUpload,
  RefreshCcw,
  Save,
  Settings,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState, useCallback } from "react";
import { useContentUpsertForm } from "./use-upsert.content.form";
import { Content } from "@/app/lib/backend/domain/entity/content.entity";
import { normalize } from "../../util/normalize";

interface ContentUpsertFormProps {
  initialData?: Content;
  communityId: string;
  contentId: string;
}

export function ContentUpsertForm({
  initialData,
  communityId,
  contentId,
}: ContentUpsertFormProps) {
  const {
    form,
    fields,
    isSubmitting,
    isEditMode,
    activeTab,
    setActiveTab,
    newTag,
    setNewTag,
    handleFileSelect,
    handleFileDrop,
    addTag,
    removeTag,
    uploadMedia,
    uploadAllMedias,
    removeMedia,
    onSubmit,
  } = useContentUpsertForm({
    initialData,
    communityId,
    contentId,
  });

  const [isDragOver, setIsDragOver] = useState(false);

  const getFileIcon = (fileOrType: File | string) => {
    const type = typeof fileOrType === "string" ? fileOrType : fileOrType.type;
    if (type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />;
    if (type.startsWith("video/")) return <Video className="h-4 w-4" />;
    if (type.startsWith("audio/")) return <Music className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      handleFileDrop(files);
    },
    [handleFileDrop]
  );

  return (
    <div className="w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {isEditMode ? "Editar Conteúdo" : "Criar Conteúdo"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditMode
              ? "Atualize as informações do seu conteúdo"
              : "Crie um novo conteúdo para sua comunidade"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {form.watch("status") === "draft" ? (
            <Badge variant="secondary" className="gap-1">
              <EyeOff className="h-3 w-3" />
              Rascunho
            </Badge>
          ) : (
            <Badge className="gap-1">
              <Eye className="h-3 w-3" />
              Publicado
            </Badge>
          )}
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "content" | "media" | "settings")
          }
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content" className="gap-2">
              <Link2 className="h-4 w-4" />
              Conteúdo
            </TabsTrigger>
            <TabsTrigger value="media" className="gap-2">
              <CloudUpload className="h-4 w-4" />
              Mídias ({fields.length})
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6 mt-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Conteúdo</Label>
                    <Input
                      id="name"
                      {...form.register("name", {
                        onChange: (e) => {
                          form.setValue("name", e.target.value);
                          form.setValue("slug", normalize(e.target.value));
                        },
                      })}
                      placeholder="Digite o nome do conteúdo"
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug (URL)</Label>
                    <Input
                      id="slug"
                      placeholder="conteudo-exemplo"
                      {...form.register("slug", {
                        onChange: (e) =>
                          form.setValue("slug", normalize(e.target.value)),
                      })}
                    />
                    <p className="text-xs text-muted-foreground">
                      URL amigável para o conteúdo
                    </p>
                    {form.formState.errors.slug && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.slug.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    {...form.register("description")}
                    placeholder="Descreva brevemente o conteúdo..."
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Uma descrição opcional que ajuda os membros a entenderem o
                    conteúdo
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-6 mt-6">
            <Card>
              <CardContent className="p-6">
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragOver
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <CloudUpload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Adicionar Mídias</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Arraste arquivos aqui ou clique para selecionar
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("file-input")?.click()
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Selecionar Arquivos
                  </Button>
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.tsx,.ts"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {fields.length > 0 && (
                  <div className="mt-6 flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      {fields.length} arquivo{fields.length !== 1 ? "s" : ""}{" "}
                      adicionado{fields.length !== 1 ? "s" : ""}
                    </p>
                    {fields.some(
                      (media) => media.upload?.status === "pending"
                    ) && (
                      <Button type="button" size="sm" onClick={uploadAllMedias}>
                        <Upload className="h-4 w-4 mr-2" />
                        Enviar Todos
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-4">
              {fields.map((media, index) => (
                <Card key={media.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-muted flex-shrink-0">
                        {getFileIcon(media.file || media.type)}
                      </div>

                      <div className="flex-1 min-w-0 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium truncate">
                              {media.file?.name || media.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {(
                                  (media.file?.size || media.size) /
                                  1024 /
                                  1024
                                ).toFixed(2)}{" "}
                                MB
                              </Badge>
                              {media.upload?.status === "completed" && (
                                <Badge variant="default" className="text-xs">
                                  Enviado
                                </Badge>
                              )}
                              {media.upload?.status === "error" && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  Erro
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            {media.upload?.status === "pending" && (
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => uploadMedia(index)}
                              >
                                <Upload className="h-4 w-4" />
                              </Button>
                            )}
                            {media.upload?.status === "error" && (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => uploadMedia(index)}
                              >
                                <RefreshCcw className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeMedia(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {media.upload?.status === "uploading" && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Enviando...</span>
                              <span>{media.upload.progress}%</span>
                            </div>
                            <Progress
                              value={media.upload.progress}
                              className="h-2"
                            />
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm">Título</Label>
                            <Input
                              {...form.register(`medias.${index}.name`)}
                              placeholder="Título da mídia"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm">Descrição</Label>
                            <Input
                              {...form.register(`medias.${index}.description`)}
                              placeholder="Descrição opcional"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-sm">Tags</Label>
                          {media.tags && media.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {media.tags.map((tag, tagIndex) => (
                                <Badge
                                  key={tagIndex}
                                  variant="secondary"
                                  className="text-xs gap-1"
                                >
                                  {tag}
                                  <X
                                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                                    onClick={() => removeTag(index)(tagIndex)}
                                  />
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Input
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              placeholder="Adicionar tag"
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  if (newTag.trim()) {
                                    addTag(index)(newTag.trim());
                                    setNewTag("");
                                  }
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (newTag.trim()) {
                                  addTag(index)(newTag.trim());
                                  setNewTag("");
                                }
                              }}
                              disabled={!newTag.trim()}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Status de Publicação
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Salvar como rascunho</Label>
                      <p className="text-sm text-muted-foreground">
                        Rascunhos não são visíveis para os membros
                      </p>
                    </div>
                    <Switch
                      checked={form.watch("status") === "draft"}
                      onCheckedChange={(checked) =>
                        form.setValue("status", checked ? "draft" : "published")
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Agendamento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Publicar em (opcional)</Label>
                    <Input
                      type="datetime-local"
                      {...form.register("scheduled_at", {
                        setValueAs: (value) =>
                          value ? new Date(value) : undefined,
                      })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Deixe vazio para publicar imediatamente
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Expiração</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Expira em (opcional)</Label>
                    <Input
                      type="datetime-local"
                      {...form.register("expires_at", {
                        setValueAs: (value) =>
                          value ? new Date(value) : undefined,
                      })}
                    />
                    <p className="text-xs text-muted-foreground">
                      O conteúdo será automaticamente removido nesta data
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between pt-6 border-t bg-background sticky bottom-0">
          <div className="flex items-center gap-4">
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Cancelar
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="submit"
              disabled={isSubmitting || fields.length === 0}
              className="min-w-32"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />
                  {isEditMode ? "Salvando..." : "Criando..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {form.watch("status") === "draft"
                    ? "Salvar Rascunho"
                    : isEditMode
                    ? "Salvar Alterações"
                    : "Publicar Conteúdo"}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
