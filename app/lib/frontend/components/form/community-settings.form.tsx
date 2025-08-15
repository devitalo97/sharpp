"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, MessageSquare, Shield } from "lucide-react";

export interface CommunitySettings {
  permissions: {
    membersCanPost: boolean;
    membersCanInvite: boolean;
    requireApproval: boolean;
    allowPublicJoin: boolean;
  };
  features: {
    enableNotifications: boolean;
    enableAnalytics: boolean;
    enableIntegrations: boolean;
  };
  moderation: {
    autoModeration: boolean;
    requirePostApproval: boolean;
    allowReports: boolean;
  };
}

interface CommunitySettingsProps {
  defaultValues?: Partial<CommunitySettings>;
  onSubmit: (data: CommunitySettings) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

export function CommunitySettingsForm({
  defaultValues,
  onSubmit,
  onBack,
  isLoading,
}: CommunitySettingsProps) {
  const [settings, setSettings] = useState<CommunitySettings>({
    permissions: {
      membersCanPost: true,
      membersCanInvite: false,
      requireApproval: false,
      allowPublicJoin: true,
      ...defaultValues?.permissions,
    },
    features: {
      enableNotifications: true,
      enableAnalytics: true,
      enableIntegrations: false,
      ...defaultValues?.features,
    },
    moderation: {
      autoModeration: false,
      requirePostApproval: false,
      allowReports: true,
      ...defaultValues?.moderation,
    },
  });

  const updatePermission = (
    key: keyof CommunitySettings["permissions"],
    value: boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      permissions: { ...prev.permissions, [key]: value },
    }));
  };

  const updateFeature = (
    key: keyof CommunitySettings["features"],
    value: boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      features: { ...prev.features, [key]: value },
    }));
  };

  const updateModeration = (
    key: keyof CommunitySettings["moderation"],
    value: boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      moderation: { ...prev.moderation, [key]: value },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(settings);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        {/* Permissions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="size-4" />
              Permissões
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <label className="flex items-start gap-3 text-sm">
              <Checkbox
                checked={settings.permissions.membersCanPost}
                onCheckedChange={(checked) =>
                  updatePermission("membersCanPost", !!checked)
                }
              />
              <div>
                <div className="font-medium">Membros podem postar</div>
                <div className="text-xs text-muted-foreground">
                  Permitir que membros criem conteúdo
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 text-sm">
              <Checkbox
                checked={settings.permissions.membersCanInvite}
                onCheckedChange={(checked) =>
                  updatePermission("membersCanInvite", !!checked)
                }
              />
              <div>
                <div className="font-medium">Membros podem convidar</div>
                <div className="text-xs text-muted-foreground">
                  Permitir convites de novos membros
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 text-sm">
              <Checkbox
                checked={settings.permissions.requireApproval}
                onCheckedChange={(checked) =>
                  updatePermission("requireApproval", !!checked)
                }
              />
              <div>
                <div className="font-medium">Requer aprovação</div>
                <div className="text-xs text-muted-foreground">
                  Novos membros precisam ser aprovados
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 text-sm">
              <Checkbox
                checked={settings.permissions.allowPublicJoin}
                onCheckedChange={(checked) =>
                  updatePermission("allowPublicJoin", !!checked)
                }
              />
              <div>
                <div className="font-medium">Entrada pública</div>
                <div className="text-xs text-muted-foreground">
                  Qualquer pessoa pode se juntar
                </div>
              </div>
            </label>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="size-4" />
              Recursos
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <label className="flex items-start gap-3 text-sm">
              <Checkbox
                checked={settings.features.enableNotifications}
                onCheckedChange={(checked) =>
                  updateFeature("enableNotifications", !!checked)
                }
              />
              <div>
                <div className="font-medium">Notificações</div>
                <div className="text-xs text-muted-foreground">
                  Alertas por email e push
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 text-sm">
              <Checkbox
                checked={settings.features.enableAnalytics}
                onCheckedChange={(checked) =>
                  updateFeature("enableAnalytics", !!checked)
                }
              />
              <div>
                <div className="font-medium">Analytics</div>
                <div className="text-xs text-muted-foreground">
                  Métricas e relatórios detalhados
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 text-sm">
              <Checkbox
                checked={settings.features.enableIntegrations}
                onCheckedChange={(checked) =>
                  updateFeature("enableIntegrations", !!checked)
                }
              />
              <div>
                <div className="font-medium">Integrações</div>
                <div className="text-xs text-muted-foreground">
                  Conectar com ferramentas externas
                  <Badge variant="secondary" className="ml-1 text-[10px]">
                    Pro
                  </Badge>
                </div>
              </div>
            </label>
          </CardContent>
        </Card>

        {/* Moderation */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquare className="size-4" />
              Moderação
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <label className="flex items-start gap-3 text-sm">
              <Checkbox
                checked={settings.moderation.autoModeration}
                onCheckedChange={(checked) =>
                  updateModeration("autoModeration", !!checked)
                }
              />
              <div>
                <div className="font-medium">Moderação automática</div>
                <div className="text-xs text-muted-foreground">
                  IA detecta conteúdo inadequado
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 text-sm">
              <Checkbox
                checked={settings.moderation.requirePostApproval}
                onCheckedChange={(checked) =>
                  updateModeration("requirePostApproval", !!checked)
                }
              />
              <div>
                <div className="font-medium">Aprovar posts</div>
                <div className="text-xs text-muted-foreground">
                  Posts precisam ser aprovados
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 text-sm">
              <Checkbox
                checked={settings.moderation.allowReports}
                onCheckedChange={(checked) =>
                  updateModeration("allowReports", !!checked)
                }
              />
              <div>
                <div className="font-medium">Permitir denúncias</div>
                <div className="text-xs text-muted-foreground">
                  Membros podem reportar conteúdo
                </div>
              </div>
            </label>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        {onBack ? (
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isLoading}
          >
            Voltar
          </Button>
        ) : (
          <div />
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Continuar"}
        </Button>
      </div>
    </form>
  );
}
