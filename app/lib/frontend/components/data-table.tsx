"use client";

import type React from "react";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter } from "lucide-react";
import { TableSkeleton, ErrorState } from "@/components/skeletons";
import { EmptyState } from "@/components/empty-state";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  title: string;
  data: T[];
  columns: Column<T>[];
  actions?: React.ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  emptyState?: {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
  };
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  filterable?: boolean;
  onFilter?: () => void;
}

export function DataTable<T extends Record<string, any>>({
  title,
  data,
  columns,
  actions,
  isLoading,
  isError,
  onRetry,
  emptyState,
  searchable,
  searchPlaceholder = "Buscar...",
  onSearch,
  filterable,
  onFilter,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  if (isError) {
    return <ErrorState message="Falha ao carregar dados." onRetry={onRetry} />;
  }

  if (isLoading) {
    return <TableSkeleton rows={5} cols={columns.length} />;
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-base">{title}</CardTitle>
        <div className="flex items-center gap-2">
          {searchable && (
            <div className="relative">
              <Input
                placeholder={searchPlaceholder}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          )}
          {filterable && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1 bg-transparent"
              onClick={onFilter}
            >
              <Filter className="size-4" />
              Filtros
            </Button>
          )}
          {actions}
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 && emptyState ? (
          <EmptyState
            title={emptyState.title}
            description={emptyState.description}
            actionLabel={emptyState.actionLabel}
            onAction={emptyState.onAction}
          />
        ) : (
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead
                      key={String(column.key)}
                      className={column.className}
                    >
                      {column.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={item.id || index}>
                    {columns.map((column) => (
                      <TableCell
                        key={String(column.key)}
                        className={column.className}
                      >
                        {column.render
                          ? column.render(item)
                          : item[column.key as keyof T]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
