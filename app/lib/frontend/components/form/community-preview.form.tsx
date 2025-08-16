"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Settings, Shield, CheckCircle } from "lucide-react";
import { CommunitySettings } from "./community-settings.form";
import { CommunityFormSchema } from "./use-create.community.form";
import { MemberFormSchema } from "./use-member.form";

interface CommunityPreviewProps {
  communityData: CommunityFormSchema;
  settingsData: CommunitySettings;
  memberData: MemberFormSchema;
  onSubmit: () => void;
  onBack?: () => void;
  isLoading?: boolean;
}

export function CommunityPreviewForm({
  communityData,
  settingsData,
  memberData,
  onSubmit,
  onBack,
  isLoading,
}: CommunityPreviewProps) {
  const enabledPermissions = Object.entries(settingsData.permissions)
    .filter(([_, enabled]) => enabled)
    .map(([key]) => key);

  const enabledFeatures = Object.entries(settingsData.features)
    .filter(([_, enabled]) => enabled)
    .map(([key]) => key);

  return (
    <div className="grid gap-6">
      <div className="text-center">
        <CheckCircle className="mx-auto size-12 text-emerald-600" />
        <h3 className="mt-2 text-lg font-semibold">Quase pronto!</h3>
        <p className="text-sm text-muted-foreground">
          Revise as configurações antes de criar sua comunidade.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Community Info */}
        <InfoCard
          title={communityData.nome}
          description={communityData.descricao}
          badges={[
            {
              label:
                communityData.privacidade === "publica" ? "Pública" : "Privada",
              variant: "default",
            },
            { label: "Nova", variant: "secondary" },
          ]}
          metrics={[
            { label: "Membros", value: "1" },
            { label: "Links", value: "0" },
            { label: "Status", value: <Badge variant="default">Ativa</Badge> },
          ]}
        />

        {/* First Member */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="size-4" />
              Primeiro Membro
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                {memberData.nome.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-medium">{memberData.nome}</div>
                <div className="text-sm text-muted-foreground">
                  {memberData.email}
                </div>
              </div>
              <Badge variant="default" className="ml-auto">
                <Shield className="mr-1 size-3" />
                {memberData.papel}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="size-4" />
              Permissões Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {enabledPermissions.length > 0 ? (
                enabledPermissions.map((permission) => (
                  <Badge key={permission} variant="secondary">
                    {permission.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">
                  Nenhuma permissão especial
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="size-4" />
              Recursos Habilitados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {enabledFeatures.length > 0 ? (
                enabledFeatures.map((feature) => (
                  <Badge key={feature} variant="outline">
                    {feature.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">
                  Recursos padrão
                </span>
              )}
            </div>
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

        <Button onClick={onSubmit} disabled={isLoading} className="gap-2">
          {isLoading ? "Criando..." : "Criar Comunidade"}
          <CheckCircle className="size-4" />
        </Button>
      </div>
    </div>
  );
}
