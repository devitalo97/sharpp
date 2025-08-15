"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Upload, X, Users, Eye, Settings, Tag } from "lucide-react";
import { useCommunityForm } from "./use-community.form";

export function CommunityForm() {
  const {
    form,
    handleNameChange,
    addTag,
    removeTag,
    onSubmit,
    tags,
    tagInput,
    setTagInput,
    watchedName,
    watchedAvatarUrl,
    watchedCoverUrl,
  } = useCommunityForm();
  return (
    <Card className="w-3xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Informações da Comunidade
        </CardTitle>
        <CardDescription>
          Configure os detalhes básicos da sua nova comunidade
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações Básicas</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Comunidade *</Label>
                <Input
                  id="name"
                  placeholder="Ex: Desenvolvedores React"
                  {...form.register("name")}
                  onChange={handleNameChange}
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
                  {...form.register("slug")}
                />
                <p className="text-sm text-muted-foreground">
                  URL amigável para sua comunidade
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
                placeholder="Descreva o propósito e objetivos da sua comunidade..."
                className="min-h-[100px]"
                {...form.register("description")}
              />
              <p className="text-sm text-muted-foreground">
                Máximo 500 caracteres
              </p>
              {form.formState.errors.description && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Configurações */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurações
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="visibility" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Visibilidade
                </Label>
                <Select
                  onValueChange={(value) =>
                    form.setValue(
                      "visibility",
                      value as "private" | "unlisted" | "public"
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a visibilidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Pública</SelectItem>
                    <SelectItem value="unlisted">Não listada</SelectItem>
                    <SelectItem value="private">Privada</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.visibility && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.visibility.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="membersLimit">Limite de Membros</Label>
                <Input
                  id="membersLimit"
                  type="number"
                  placeholder="Ex: 1000"
                  {...form.register("membersLimit", { valueAsNumber: true })}
                />
                <p className="text-sm text-muted-foreground">
                  Deixe vazio para ilimitado
                </p>
                {form.formState.errors.membersLimit && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.membersLimit.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Tags
            </h3>

            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Adicionar tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  className="flex-1"
                />
                <Button type="button" onClick={addTag} variant="outline">
                  Adicionar
                </Button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}

              <p className="text-sm text-muted-foreground">
                {tags.length}/10 tags adicionadas
              </p>
            </div>
          </div>

          <Separator />

          {/* Imagens */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Imagens
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="avatarUrl">Avatar da Comunidade</Label>
                <div className="space-y-3">
                  <Input
                    id="avatarUrl"
                    placeholder="https://exemplo.com/avatar.jpg"
                    {...form.register("avatarUrl")}
                  />
                  {watchedAvatarUrl && (
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={watchedAvatarUrl || "/placeholder.svg"}
                        />
                        <AvatarFallback>
                          {watchedName?.charAt(0)?.toUpperCase() || "C"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        Preview
                      </span>
                    </div>
                  )}
                </div>
                {form.formState.errors.avatarUrl && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.avatarUrl.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverUrl">Imagem de Capa</Label>
                <div className="space-y-3">
                  <Input
                    id="coverUrl"
                    placeholder="https://exemplo.com/capa.jpg"
                    {...form.register("coverUrl")}
                  />
                  {watchedCoverUrl && (
                    <div className="space-y-2">
                      <div className="aspect-video w-full overflow-hidden rounded-md border bg-muted">
                        <img
                          src={watchedCoverUrl || "/placeholder.svg"}
                          alt="Preview da capa"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Preview da capa
                      </span>
                    </div>
                  )}
                </div>
                {form.formState.errors.coverUrl && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.coverUrl.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Botões de Ação */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
            <Button type="submit" className="min-w-[120px]">
              Criar minha nova comunidade
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
