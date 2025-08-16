"use client";

import { Community } from "@/app/lib/backend/domain/entity/community.entity";
import { Column, DataTable } from "../data-table";
import { StatusBadge } from "../status-badge";
import { ActionDropdown, ActionItem } from "../action-dropdown";
import { Archive, ArrowRight, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { toast } from "sonner";

export function CommunityTable({ communities }: { communities: Community[] }) {
  const handleArchive = (id: string) => {
    toast.info("Comunidade arquivada.");
  };

  const handleDelete = (id: string) => {
    toast.success("Comunidade excluída.");
  };
  const columns: Column<Community>[] = [
    {
      key: "nome",
      label: "Nome",
      render: (item) => <span className="font-medium">{item.name}</span>,
    },
    {
      key: "membros",
      label: "Membros",
    },
    {
      key: "links",
      label: "Links",
    },
    {
      key: "status",
      label: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "actions",
      label: "",
      className: "w-0",
      render: (item) => {
        const actions: ActionItem[] = [
          {
            label: "Arquivar",
            icon: Archive,
            onClick: () => handleArchive(item.id),
          },
          {
            label: "Excluir",
            icon: Trash2,
            variant: "destructive",
            confirm: {
              title: "Excluir comunidade?",
              description: "Esta ação é irreversível. Confirme para excluir.",
              confirmLabel: "Excluir",
            },
            onClick: () => handleDelete(item.id),
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
              <Link href={`/community/${item.id}`}>
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
      title="Lista"
      data={communities}
      columns={columns}
      emptyState={{
        title: "Nenhuma comunidade encontrada",
        description: "Crie sua primeira comunidade para começar.",
        actionLabel: "Criar Comunidade",
        onAction: () => (window.location.href = "/community/new"),
      }}
    />
  );
}
