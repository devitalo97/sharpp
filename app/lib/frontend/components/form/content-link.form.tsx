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
  RefreshCcw,
} from "lucide-react";
import { toast } from "sonner";
import { useContentLinkForm } from "./use-content-link.form";
import { normalize } from "../../util/normalize";

export function ContentLinkForm() {
  const {
    form,
    fields,
    isSubmitting,
    newTag,
    setNewTag,
    getNewAttributeKey,
    getNewAttributeValue,
    setNewAttributeKey,
    setNewAttributeValue,
    handleFileSelect,
    addTag,
    removeTag,
    addCustomAttribute,
    removeCustomAttribute,
    uploadMedia,
    uploadAllMedias,
    removeMedia,
    onSubmit,
  } = useContentLinkForm();

  // Obter ícone do tipo de arquivo
  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/"))
      return <ImageIcon className="h-4 w-4" />;
    if (file.type.startsWith("video/")) return <Video className="h-4 w-4" />;
    if (file.type.startsWith("audio/")) return <Music className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };
  return (
    <Card className="border max-w-4xl">
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
              <Label htmlFor="name" className="text-sm font-medium">
                Nome do Link
              </Label>
              <Input
                id="name"
                {...form.register("name", {
                  onChange: (e) => {
                    form.setValue("name", e.target.value);
                    form.setValue("slug", normalize(e.target.value));
                  },
                })}
                placeholder="Digite o nome do link de conteúdo"
                className="h-10"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL) *</Label>
              <Input
                id="slug"
                placeholder="desenvolvedores-react"
                {...form.register("slug", {
                  onChange: (e) =>
                    form.setValue("slug", normalize(e.target.value)),
                })}
              />
              <p className="text-sm text-muted-foreground">
                URL amigável para o link
              </p>
              {form.formState.errors.slug && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.slug.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Descrição do Link
              </Label>
              <Textarea
                id="description"
                {...form.register("description")}
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
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Arquivos
                </Button>
                {fields.length > 0 && (
                  <Button
                    type="button"
                    onClick={uploadAllMedias}
                    disabled={fields.every(
                      (media) => media.upload.status === "completed"
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
                              {(media.file.size / 1024 / 1024).toFixed(2)} MB
                            </Badge>
                            {media.upload.status === "completed" && (
                              <Badge className="text-xs">Enviado</Badge>
                            )}
                            {media.upload.status === "error" && (
                              <>
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  Erro
                                </Badge>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant={"outline"}
                                  onClick={() => uploadMedia(index)}
                                >
                                  <RefreshCcw className="h-4 w-4 mr-1" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {media.upload.status === "pending" && (
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
                          onClick={() => removeMedia(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {media.upload.status === "uploading" && (
                      <div className="space-y-2 p-3 rounded-md bg-muted">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Enviando arquivo...
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {media.upload.progress}%
                          </span>
                        </div>
                        <Progress
                          value={media.upload.progress}
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
                          {...form.register(`medias.${index}.name`)}
                          placeholder="Título da mídia"
                          className="h-9"
                        />
                        {form.formState.errors.medias?.[index]?.name && (
                          <p className="text-sm text-destructive">
                            {form.formState.errors.medias[index]?.name?.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Descrição</Label>
                        <Input
                          {...form.register(`medias.${index}.description`)}
                          placeholder="Descrição da mídia"
                          className="h-9"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Tags</Label>

                      {media.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {media.tags.map((tag, tagIndex) => (
                            <Badge
                              key={tagIndex}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {tag}
                              <X
                                className="h-3 w-3 cursor-pointer hover:text-destructive"
                                onClick={() => removeTag(index, tagIndex)}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Digite uma nova tag"
                          className="flex-1 h-9"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (newTag.trim()) {
                                addTag(index);
                                toast.success(`Tag "${newTag}" adicionada!`);
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
                              addTag(index);
                              toast.success(`Tag "${newTag}" adicionada!`);
                            }
                          }}
                          disabled={!newTag.trim()}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        Atributos Customizados
                      </Label>

                      {/* inputs + botão */}
                      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
                        <Input
                          value={getNewAttributeKey(index)}
                          onChange={(e) =>
                            setNewAttributeKey(index)(e.target.value)
                          }
                          placeholder="Nome do atributo"
                          className="h-9"
                        />
                        <Input
                          value={getNewAttributeValue(index)}
                          onChange={(e) =>
                            setNewAttributeValue(index)(e.target.value)
                          }
                          placeholder="Valor do atributo"
                          className="h-9"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (
                                getNewAttributeKey(index).trim() &&
                                getNewAttributeValue(index).trim()
                              ) {
                                addCustomAttribute(index);
                                toast.success(
                                  `Atributo "${getNewAttributeKey(
                                    index
                                  )}" adicionado!`
                                );
                              }
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-9 bg-transparent"
                          onClick={() => {
                            if (
                              getNewAttributeKey(index).trim() &&
                              getNewAttributeValue(index).trim()
                            ) {
                              addCustomAttribute(index);
                              toast.success(
                                `Atributo "${getNewAttributeKey(
                                  index
                                )}" adicionado!`
                              );
                            } else {
                              toast.error(
                                "Preencha o nome e valor do atributo."
                              );
                            }
                          }}
                          disabled={
                            !getNewAttributeKey(index).trim() ||
                            !getNewAttributeValue(index).trim()
                          }
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar
                        </Button>
                      </div>

                      {/* linha única com chips minimalistas */}
                      {Object.entries(media.custom_attributes).length > 0 && (
                        <div className="flex items-center gap-2 overflow-x-auto rounded-md border bg-background px-2 py-2">
                          {Object.entries(media.custom_attributes).map(
                            ([key, value]) => (
                              <button
                                key={key}
                                type="button"
                                onClick={() => {
                                  removeCustomAttribute(index, key);
                                  toast.success(`Atributo "${key}" removido!`);
                                }}
                                title="Remover atributo"
                                className="group inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs text-muted-foreground hover:bg-muted transition"
                              >
                                <span className="font-mono text-foreground/80">
                                  {key}
                                </span>
                                <span className="opacity-70">:</span>
                                <span className="truncate max-w-[12rem]">
                                  {value}
                                </span>
                                <X className="h-3.5 w-3.5 opacity-60 group-hover:opacity-90" />
                              </button>
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
  );
}
