"use client";

import { Column, DataTable } from "../data-table";
import { ActionDropdown, ActionItem } from "../action-dropdown";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  Activity,
  Calendar,
  Crown,
  Shield,
  User,
  UserCog,
  UserX,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Member } from "@/app/lib/backend/domain/entity/member.entity";

export type MemberRole = "owner" | "admin" | "moderator" | "member";
export type MemberStatus =
  | "active"
  | "inactive"
  | "invited"
  | "banned"
  | "removed"
  | "blocked";

export interface CustomMember extends Member {
  joinedAt: string | Date;
  lastActivity: string | Date;
  contentCount: number;
  commentsCount: number;
  likesReceived: number;
  avatar: string;
}

export function MemberTable({ members }: { members: CustomMember[] }) {
  const handleChangeRole = (id: string) => toast.info("Alterar função (stub).");
  const handleRemove = (id: string) => toast.error("Membro removido (stub).");

  const columns: Column<CustomMember>[] = [
    {
      key: "member",
      label: "Membro",
      className: "min-w-[280px]",
      render: (m) => (
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={m.avatar || "/placeholder.svg"} />
            <AvatarFallback>{m.name?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="font-medium truncate">{m.name}</div>
            <div className="text-xs text-muted-foreground truncate">
              {m.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Função",
      render: (m) => <RoleBadge role={m.role} />,
    },
    {
      key: "status",
      label: "Status",
      render: (m) => <MemberStatusBadge status={m.status} />,
    },
    {
      key: "joinedAt",
      label: "Desde",
      render: (m) => (
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(m.joinedAt)}</span>
        </div>
      ),
    },
    {
      key: "lastActivity",
      label: "Atividade",
      render: (m) => (
        <div className="flex items-center gap-1">
          <Activity className="h-3 w-3" />
          <span>Ativo {getRelativeTime(m.lastActivity)}</span>
        </div>
      ),
    },
    {
      key: "stats",
      label: "Engajamento",
      className: "min-w-[220px]",
      render: (m) => (
        <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-1">
          <span>{m.contentCount} conteúdos</span>
          <span>{m.commentsCount} comentários</span>
          <span>{m.likesReceived} curtidas</span>
        </div>
      ),
    },
    {
      key: "actions",
      label: "",
      className: "w-0",
      render: (m) => {
        const actions: ActionItem[] = [
          {
            label: "Alterar função",
            icon: UserCog,
            onClick: () => handleChangeRole(m.id),
          },
          {
            label: "Remover membro",
            icon: UserX,
            variant: "destructive",
            confirm: {
              title: "Remover membro?",
              description: "Esta ação é irreversível. Confirme para remover.",
              confirmLabel: "Remover",
            },
            onClick: () => handleRemove(m.id),
          },
        ];

        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              asChild
              size="sm"
              variant="outline"
              className="gap-1 bg-transparent"
            >
              <Link href={`/community/${m.community_id}/member/${m.id}`}>
                Gerenciar
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <ActionDropdown actions={actions} />
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      title="Membros"
      data={members}
      columns={columns}
      emptyState={{
        title: "Nenhum membro encontrado",
        description: "Convide pessoas para sua comunidade.",
        actionLabel: "Convidar Membro",
        onAction: () => toast.message("Abrir modal de convite (stub)."),
      }}
    />
  );
}

/* ---------- UI helpers ---------- */

function RoleBadge({ role }: { role: MemberRole }) {
  const { icon: Icon, label, className } = roleMeta[role] ?? roleMeta.member;
  return (
    <Badge variant="secondary" className={className}>
      <div className="flex items-center gap-1">
        <Icon className="h-3.5 w-3.5" />
        <span>{label}</span>
      </div>
    </Badge>
  );
}

function MemberStatusBadge({ status }: { status: MemberStatus }) {
  const map: Record<MemberStatus, { label: string; className?: string }> = {
    active: { label: "Ativo", className: "" },
    inactive: { label: "Inativo", className: "" },
    blocked: { label: "Bloqueado", className: "" },
    invited: { label: "Convidado", className: "" },
    removed: { label: "Removido", className: "" },
    banned: {
      label: "Banido",
      className: "text-destructive border-destructive/40",
    },
  };
  const { label, className } = map[status];
  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
}

const roleMeta: Record<
  MemberRole,
  { icon: any; label: string; className?: string }
> = {
  owner: {
    icon: Crown,
    label: "Dono",
    className: "bg-yellow-100/60 text-yellow-900",
  },
  admin: {
    icon: Shield,
    label: "Administrador",
    className: "bg-sky-100/60 text-sky-900",
  },
  moderator: {
    icon: UserCog,
    label: "Moderador",
    className: "bg-emerald-100/60 text-emerald-900",
  },
  member: { icon: User, label: "Membro", className: "" },
};

function formatDate(d: string | Date) {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(date)
    .replace(".", "");
}

function getRelativeTime(d: string | Date) {
  const date = typeof d === "string" ? new Date(d) : d;
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
    ["second", 1],
  ];

  for (const [unit, seconds] of units) {
    if (Math.abs(diffSec) >= seconds || unit === "second") {
      const value = Math.round(-diffSec / seconds);
      return rtf.format(value, unit);
    }
  }
  return "agora";
}
