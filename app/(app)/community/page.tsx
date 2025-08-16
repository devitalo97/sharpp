"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/data-table";
import { ActionDropdown, type ActionItem } from "@/components/action-dropdown";
import { StatusBadge } from "@/components/status-badge";
import { PageHeader } from "@/components/page-header";
import { useTableState } from "@/hooks/use-table-state";
import Link from "next/link";
import { ArrowRight, Plus, Archive, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Community = {
  id: string;
  nome: string;
  membros: number;
  links: number;
  status: "Ativa" | "Arquivada";
};

const initialCommunities: Community[] = [
  { id: "1", nome: "Dev Brasil", membros: 1520, links: 18, status: "Ativa" },
  { id: "2", nome: "Designers LATAM", membros: 830, links: 9, status: "Ativa" },
  { id: "3", nome: "Mkt Growth", membros: 410, links: 6, status: "Arquivada" },
];

export default function Page() {
  const [communities, setCommunities] =
    useState<Community[]>(initialCommunities);

  const { filteredData, searchQuery, setSearchQuery, filters, setFilters } =
    useTableState({
      data: communities,
      searchFields: ["nome"],
      filterFn: (item, filters) => {
        if (filters.status && filters.status !== "Todos") {
          return item.status === filters.status;
        }
        return true;
      },
    });

  const handleArchive = (id: string) => {
    setCommunities((prev) =>
      prev.map((x) => (x.id === id ? { ...x, status: "Arquivada" } : x))
    );
    toast("Comunidade arquivada.");
  };

  const handleDelete = (id: string) => {
    setCommunities((prev) => prev.filter((x) => x.id !== id));
    toast.success("Comunidade excluída.");
  };

  const columns: Column<Community>[] = [
    {
      key: "nome",
      label: "Nome",
      render: (item) => <span className="font-medium">{item.nome}</span>,
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
    <div className="grid gap-4">
      <PageHeader
        title="Minhas Comunidades"
        description="Crie, edite e gerencie suas comunidades."
        actions={
          <Button asChild className="gap-1">
            <Link href="/community/new">
              <Plus className="size-4" />
              Criar Comunidade
            </Link>
          </Button>
        }
      />

      <DataTable
        title="Lista"
        data={filteredData}
        columns={columns}
        searchable
        searchPlaceholder="Buscar comunidades..."
        onSearch={setSearchQuery}
        filterable
        onFilter={() => {
          // Toggle between status filters
          const currentStatus = filters.status || "Todos";
          const nextStatus =
            currentStatus === "Todos"
              ? "Ativa"
              : currentStatus === "Ativa"
              ? "Arquivada"
              : "Todos";
          setFilters({ ...filters, status: nextStatus });
          toast(`Filtro: ${nextStatus}`);
        }}
        emptyState={{
          title: "Nenhuma comunidade encontrada",
          description: "Crie sua primeira comunidade para começar.",
          actionLabel: "Criar Comunidade",
          onAction: () => (window.location.href = "/comunidades/nova"),
        }}
      />
    </div>
  );
}
