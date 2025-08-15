"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";
import { useContentLinkForm } from "./use-content-link.form";

export default function ContentLinkForm() {
  const {
    form,
    fields,
    remove,

    isSubmitting,

    // drafts
    tagDrafts,
    setTagDraft,
    attrDrafts,
    setAttrDraft,

    // actions
    handleFileSelect,
    addTag,
    removeTag,
    addCustomAttribute,
    removeCustomAttribute,
    uploadMedia,
    uploadAllMedias,
    onSubmit,
  } = useContentLinkForm({
    signedUrlEndpoint: "/api/generate-signed-url",
    s3Prefix: "content-links",
  });

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/"))
      return <ImageIcon className="h-4 w-4" />;
    if (file.type.startsWith("video/")) return <Video className="h-4 w-4" />;
    if (file.type.startsWith("audio/")) return <Music className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            Criar Link de Conteúdo
          </h1>
          <p className="text-muted-foreground">
            Faça upload de múltiplas mídias digitais e organize seu conteúdo com
            metadados personalizados
          </p>
        </div>

        <Card className="border">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-lg font-medium">
              <Link2 className="h-5 w-5" />
              Informações do Link
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="linkTitle" className="text-sm font-medium">
                    Título do Link
                  </Label>
                  <Input
                    id="linkTitle"
                    {...form.register("linkTitle")}
                    placeholder="Digite o título do link de conteúdo"
                    className="h-10"
                  />
                  {form.formState.errors.linkTitle && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.linkTitle.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="linkDescription"
                    className="text-sm font-medium"
                  >
                    Descrição do Link
                  </Label>
                  <Textarea
                    id="linkDescription"
                    {...form.register("linkDescription")}
                    placeholder="Descrição opcional do link"
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium flex items-center gap-2">
                      <CloudUpload className="h-4 w-4" />
                      Mídias Digitais
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Adicione arquivos de imagem, vídeo, áudio ou documentos
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById("file-input")?.click()
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Arquivos
                    </Button>

                    {fields.length > 0 && (
                      <Button
                        type="button"
                        onClick={uploadAllMedias}
                        disabled={fields.every(
                          (m) => m.uploadStatus === "completed"
                        )}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Todos
                      </Button>
                    )}
                  </div>
                </div>

                <input
                  id="file-input"
                  type="file"
                  multiple
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {form.formState.errors.medias && (
                  <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">
                      {form.formState.errors.medias.message}
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {fields.map((media, index) => (
                    <Card key={media.id} className="border">
                      <div className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-md bg-muted">
                              {getFileIcon(media.file)}
                            </div>
                            <div className="space-y-1">
                              <h3 className="font-medium text-sm truncate max-w-xs">
                                {media.file.name}
                              </h3>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  {(media.file.size / 1024 / 1024).toFixed(2)}{" "}
                                  MB
                                </Badge>

                                {media.uploadStatus === "completed" && (
                                  <Badge className="text-xs">Enviado</Badge>
                                )}
                                {media.uploadStatus === "error" && (
                                  <Badge
                                    variant="destructive"
                                    className="text-xs"
                                  >
                                    Erro
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {media.uploadStatus === "pending" && (
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => uploadMedia(index)}
                              >
                                <Upload className="h-4 w-4 mr-1" />
                                Upload
                              </Button>
                            )}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {media.uploadStatus === "uploading" && (
                          <div className="space-y-2 p-3 rounded-md bg-muted">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">
                                Enviando arquivo...
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {media.uploadProgress}%
                              </span>
                            </div>
                            <Progress
                              value={media.uploadProgress}
                              className="h-2"
                            />
                          </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              Título da Mídia
                            </Label>
                            <Input
                              {...form.register(
                                `medias.${index}.title` as const
                              )}
                              placeholder="Título da mídia"
                              className="h-9"
                            />
                            {form.formState.errors.medias?.[index]?.title && (
                              <p className="text-sm text-destructive">
                                {
                                  form.formState.errors.medias[index]?.title
                                    ?.message
                                }
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              Descrição
                            </Label>
                            <Input
                              {...form.register(
                                `medias.${index}.description` as const
                              )}
                              placeholder="Descrição da mídia"
                              className="h-9"
                            />
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Tags</Label>

                          {media.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {media.tags.map((tag, tagIndex) => (
                                <div
                                  key={`${tag}-${tagIndex}`}
                                  className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs"
                                >
                                  <span className="px-0.5">{tag}</span>
                                  <button
                                    type="button"
                                    className="inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-muted"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeTag(index, tagIndex);
                                    }}
                                    title="Remover tag"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Input
                              value={tagDrafts[index] ?? ""}
                              onChange={(e) =>
                                setTagDraft(index, e.target.value)
                              }
                              placeholder="Digite uma nova tag"
                              className="flex-1 h-9"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addTag(index);
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addTag(index)}
                              disabled={!(tagDrafts[index] || "").trim()}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <Separator />

                        {/* Atributos Customizados */}
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">
                            Atributos Customizados
                          </Label>

                          {/* inputs + botão (modernos e alinhados) */}
                          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
                            <Input
                              value={attrDrafts[index]?.key ?? ""}
                              onChange={(e) =>
                                setAttrDraft(index, "key", e.target.value)
                              }
                              placeholder="Nome do atributo"
                              className="h-9"
                            />
                            <Input
                              value={attrDrafts[index]?.value ?? ""}
                              onChange={(e) =>
                                setAttrDraft(index, "value", e.target.value)
                              }
                              placeholder="Valor do atributo"
                              className="h-9"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addCustomAttribute(index);
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-9"
                              onClick={() => addCustomAttribute(index)}
                              disabled={
                                !(attrDrafts[index]?.key || "").trim() ||
                                !(attrDrafts[index]?.value || "").trim()
                              }
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Adicionar
                            </Button>
                          </div>

                          {/* linha única com chips minimalistas (scroll horizontal) */}
                          {Object.entries(media.customAttributes).length >
                            0 && (
                            <div className="flex items-center gap-2 overflow-x-auto rounded-md border bg-background px-2 py-2">
                              {Object.entries(media.customAttributes).map(
                                ([key, value]) => (
                                  <div
                                    key={key}
                                    className="inline-flex items-center gap-2 rounded-full border px-2 py-1 text-xs text-muted-foreground"
                                  >
                                    <span className="font-mono text-foreground/80">
                                      {key}
                                    </span>
                                    <span className="opacity-70">:</span>
                                    <span className="truncate max-w-[12rem]">
                                      {value}
                                    </span>
                                    <button
                                      type="button"
                                      className="inline-flex h-5 w-5 items-center justify-center rounded-full hover:bg-muted"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeCustomAttribute(index, key);
                                      }}
                                      title="Remover atributo"
                                    >
                                      <X className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t">
                <Button
                  type="submit"
                  disabled={isSubmitting || fields.length === 0}
                  className="min-w-32"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />
                      Salvando...
                    </>
                  ) : (
                    "Criar Link"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
