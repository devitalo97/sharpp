"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { EmptyState } from "@/components/empty-state";
import { TableSkeleton, ErrorState } from "@/components/skeletons";
import {
  MoreHorizontal,
  Plus,
  Copy,
  Trash2,
  Pencil,
  LinkIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import z from "zod/v3";
export const PromoStatusEnum = z.enum(["Ativo", "Pausado"]);

export const UTMSchema = z.object({
  source: z.string().trim().optional(),
  medium: z.string().trim().optional(),
  campaign: z.string().trim().optional(),
});

// Link de Promoção
export const PromoLinkSchema = z.object({
  nome: z.string().min(2, "Nome obrigatório"),
  status: PromoStatusEnum.default("Ativo"),
  utm: UTMSchema.default({}),
});
export type PromoLinkInput = z.infer<typeof PromoLinkSchema>;

export function buildUtmUrl(baseUrl: string, utm?: z.infer<typeof UTMSchema>) {
  try {
    const url = new URL(baseUrl);
    if (utm?.source) url.searchParams.set("utm_source", utm.source);
    if (utm?.medium) url.searchParams.set("utm_medium", utm.medium);
    if (utm?.campaign) url.searchParams.set("utm_campaign", utm.campaign);
    return url.toString();
  } catch {
    return baseUrl;
  }
}

export type Promo = {
  id: string;
  nome: string;
  url: string;
  acessos: number;
  conversoes: number;
  status: "Ativo" | "Pausado";
};

const seed: Promo[] = [];

export function PromoLinks({ communityId }: { communityId: string }) {
  const [rows, setRows] = useState<Promo[]>(seed);
  const [editing, setEditing] = useState<Promo | null>(null);
  const [open, setOpen] = useState(false);
  const [isLoading] = useState(false);
  const [isError, setError] = useState(false);

  const baseUrl = "https://cm.app/p/novo";

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-base">Promoção & Recomendações</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <Plus className="size-4" />
              Novo Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Editar Link" : "Novo Link"}</DialogTitle>
            </DialogHeader>
            <PromoForm
              defaultValue={
                editing
                  ? {
                      nome: editing.nome,
                      status: editing.status,
                      utm: { source: "", medium: "", campaign: "" },
                    }
                  : undefined
              }
              baseUrl={editing?.url ?? baseUrl}
              onSubmit={(data) => {
                if (editing) {
                  setRows((prev) =>
                    prev.map((r) =>
                      r.id === editing.id ? { ...editing, ...data } : r
                    )
                  );
                  toast.success("Link atualizado.");
                  setEditing(null);
                } else {
                  setRows((prev) => [
                    {
                      id: crypto.randomUUID(),
                      url: buildUtmUrl(baseUrl, data.utm),
                      acessos: 0,
                      conversoes: 0,
                      status: data.status,
                      nome: data.nome,
                    },
                    ...prev,
                  ]);
                  toast.success("Link criado.");
                }
                setOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isError ? (
          <ErrorState
            message="Falha ao carregar links de promoção."
            onRetry={() => setError(false)}
          />
        ) : isLoading ? (
          <TableSkeleton rows={4} cols={6} />
        ) : rows.length === 0 ? (
          <EmptyState
            title="Nenhum link de promoção"
            description="Crie um link com UTMs para acompanhar conversões."
            actionLabel="Novo Link"
            onAction={() => setOpen(true)}
          />
        ) : (
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Acessos</TableHead>
                  <TableHead>Conversões</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-0"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.nome}</TableCell>
                    <TableCell className="max-w-[260px] truncate">
                      {r.url}
                    </TableCell>
                    <TableCell>{r.acessos}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{r.conversoes}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={r.status === "Ativo" ? "default" : "secondary"}
                      >
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            navigator.clipboard.writeText(r.url);
                            toast("Link copiado para a área de transferência.");
                          }}
                          title="Copiar link"
                        >
                          <Copy className="size-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onSelect={() => {
                                setEditing(r);
                                setOpen(true);
                              }}
                            >
                              <Pencil className="mr-2 size-4" />
                              Editar
                            </DropdownMenuItem>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 size-4" />
                                  Remover
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Remover link de promoção?
                                  </AlertDialogTitle>
                                </AlertDialogHeader>
                                <p className="px-6 text-sm text-muted-foreground">
                                  Esta ação é irreversível. Confirme para
                                  excluir.
                                </p>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={() => {
                                      setRows((prev) =>
                                        prev.filter((x) => x.id !== r.id)
                                      );
                                      toast.success("Link removido.");
                                    }}
                                  >
                                    Remover
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
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

function PromoForm({
  defaultValue,
  baseUrl,
  onSubmit,
}: {
  defaultValue?: Partial<PromoLinkInput>;
  baseUrl: string;
  onSubmit?: (data: PromoLinkInput) => void;
}) {
  const form = useForm<PromoLinkInput>({
    resolver: zodResolver(PromoLinkSchema),
    defaultValues: {
      nome: defaultValue?.nome ?? "",
      status: defaultValue?.status ?? ("Ativo" as "Ativo" | "Pausado"),
      utm: defaultValue?.utm ?? { source: "", medium: "", campaign: "" },
    },
  });
  const utmValues = form.watch("utm");
  const preview = buildUtmUrl(baseUrl, UTMSchema.parse(utmValues));

  return (
    <form
      className="grid gap-4"
      onSubmit={form.handleSubmit((data) => onSubmit?.(data))}
    >
      <div className="grid gap-2">
        <Label htmlFor="nome">Nome</Label>
        <Input id="nome" {...form.register("nome")} />
        {form.formState.errors.nome ? (
          <p className="text-xs text-red-600">
            {form.formState.errors.nome.message}
          </p>
        ) : null}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          className="h-9 rounded-md border bg-background px-3 text-sm"
          {...form.register("status")}
        >
          <option value="Ativo">Ativo</option>
          <option value="Pausado">Pausado</option>
        </select>
      </div>

      <div className="grid gap-2">
        <div className="text-sm font-medium">UTM Builder</div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="utm-source">utm_source</Label>
            <Input
              id="utm-source"
              {...form.register("utm.source")}
              placeholder="ex.: ig"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="utm-medium">utm_medium</Label>
            <Input
              id="utm-medium"
              {...form.register("utm.medium")}
              placeholder="ex.: social"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="utm-campaign">utm_campaign</Label>
            <Input
              id="utm-campaign"
              {...form.register("utm.campaign")}
              placeholder="ex.: q3_launch"
            />
          </div>
        </div>
        <div className="mt-2 rounded-md border bg-muted/50 p-3 text-xs">
          <div className="mb-1 flex items-center gap-2 font-medium">
            <LinkIcon className="size-4" /> URL final (preview)
          </div>
          <code className="block break-all">{preview}</code>
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Salvar
        </Button>
      </DialogFooter>
    </form>
  );
}
