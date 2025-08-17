"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell, Globe, Lock, Save, Settings } from "lucide-react";
import { Community } from "@/app/lib/backend/domain/entity/community.entity";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { useSettingCommunityForm } from "./use-setting.community.form";
import { Controller } from "react-hook-form";
import { normalize } from "../../util/normalize";

interface CommunitySettingsProps {
  community: Community;
}

export function SettingCommunityForm({ community }: CommunitySettingsProps) {
  const { form, isSubmitting, onSubmit } = useSettingCommunityForm({
    defaultValues: community,
  });
  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Informações Básicas
          </CardTitle>
          <CardDescription>
            Configure as informações principais da comunidade
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Comunidade</Label>
              <Input
                id="name"
                {...form.register("name", {
                  onChange: (e) => {
                    form.setValue("name", e.target.value);
                    form.setValue("slug", normalize(e.target.value));
                  },
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL da Comunidade</Label>
              <Input
                id="slug"
                {...form.register("slug", {
                  onChange: (e) => {
                    form.setValue("slug", normalize(e.target.value));
                  },
                })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              rows={3}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <Controller
                control={form.control}
                name="language"
                render={({ field }) => (
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Fuso Horário</Label>
              <Controller
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">
                        São Paulo (GMT-3)
                      </SelectItem>
                      <SelectItem value="America/New_York">
                        New York (GMT-5)
                      </SelectItem>
                      <SelectItem value="Europe/London">
                        London (GMT+0)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Privacidade e Acesso
          </CardTitle>
          <CardDescription>
            Configure quem pode ver e participar da comunidade
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="visibility">Visibilidade da Comunidade</Label>
            <Controller
              name="visibility"
              control={form.control}
              render={({ field }) => (
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <div className="flex flex-col items-start">
                          <div>Pública</div>
                          <div className="text-xs text-muted-foreground">
                            Qualquer pessoa pode ver
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="private">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        <div className="flex flex-col items-start">
                          <div>Privada</div>
                          <div className="text-xs text-muted-foreground">
                            Apenas membros podem ver
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* <div className="space-y-2">
                <Label htmlFor="membership">Tipo de Adesão</Label>
                <Select defaultValue={community.membershipType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">
                      Aberta - Qualquer pessoa pode entrar
                    </SelectItem>
                    <SelectItem value="approval">
                      Por Aprovação - Requer aprovação do admin
                    </SelectItem>
                    <SelectItem value="invite">
                      Por Convite - Apenas por convite
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div> */}

          {/* 
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Membros podem convidar outros</Label>
                    <p className="text-sm text-muted-foreground">
                      Permite que membros enviem convites
                    </p>
                  </div>
                  <Switch defaultChecked={community.allowMemberInvites} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Requer aprovação para novos membros</Label>
                    <p className="text-sm text-muted-foreground">
                      Administradores devem aprovar novos membros
                    </p>
                  </div>
                  <Switch defaultChecked={community.requireApproval} />
                </div>
              </div> */}
        </CardContent>
      </Card>

      {/* Content Settings */}
      {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Configurações de Conteúdo
              </CardTitle>
              <CardDescription>
                Configure como o conteúdo é criado e moderado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Membros podem criar conteúdo</Label>
                  <p className="text-sm text-muted-foreground">
                    Permite que membros criem posts e conteúdos
                  </p>
                </div>
                <Switch defaultChecked={community.allowContentCreation} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Moderar conteúdo antes da publicação</Label>
                  <p className="text-sm text-muted-foreground">
                    Conteúdo precisa ser aprovado antes de ficar visível
                  </p>
                </div>
                <Switch defaultChecked={community.moderateContent} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Permitir comentários</Label>
                  <p className="text-sm text-muted-foreground">
                    Membros podem comentar em conteúdos
                  </p>
                </div>
                <Switch defaultChecked={community.enableComments} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Permitir curtidas</Label>
                  <p className="text-sm text-muted-foreground">
                    Membros podem curtir conteúdos
                  </p>
                </div>
                <Switch defaultChecked={community.enableLikes} />
              </div>
            </CardContent>
          </Card> */}

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações
          </CardTitle>
          <CardDescription>
            Configure as notificações da comunidade
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notificações ativadas</Label>
              <p className="text-sm text-muted-foreground">
                Enviar notificações para membros
              </p>
            </div>
            <Controller
              name="enable_notifications"
              control={form.control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="min-w-32 ml-auto"
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />
            Salvando...
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Salvar alterações
          </>
        )}
      </Button>
    </form>
  );
}
