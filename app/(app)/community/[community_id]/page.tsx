"use client";

import type React from "react";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MoreHorizontal, Plus, Shield, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/empty-state";
import { TableSkeleton } from "@/components/skeletons";
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { PromoLinks } from "@/app/lib/frontend/components/promo-links";

type Member = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "reader" | "author";
};

const seedMembers: Member[] = [
  { id: "m1", name: "Ana Souza", email: "ana@example.com", role: "admin" },
  {
    id: "m2",
    name: "Carlos Lima",
    email: "carlos@example.com",
    role: "editor",
  },
  {
    id: "m3",
    name: "Júlia Ramos",
    email: "julia@example.com",
    role: "reader",
  },
];

export default function Page() {
  const params = useParams<{ id: string }>();
  const [tab, setTab] = useState("overview");
  const [members, setMembers] = useState<Member[]>(seedMembers);
  const [isLoadingMembers] = useState(false);
  const [isErrorMembers, setErrorMembers] = useState(false);

  const comunidade = useMemo(
    () => ({
      id: params?.id ?? "1",
      name: "Dev Brasil",
      description: "Comunidade de desenvolvedores no Brasil.",
      capa: "/placeholder.svg?height=144&width=640",
      membrosCount: 1520,
      linksAtivos: 18,
    }),
    [params]
  );

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbLink href="/comunidades">
                Minhas Comunidades
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{comunidade.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="space-y-1">
        <h1 className="text-xl font-semibold">{comunidade.name}</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie configurações, membros, conteúdo e promoção.
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full max-w-[800px]">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="members">Membros</TabsTrigger>
          <TabsTrigger value="conteudo">Conteúdo</TabsTrigger>
          <TabsTrigger value="promocao">Promoção</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card className="overflow-hidden">
            <img
              src={comunidade.capa || "/placeholder.svg"}
              alt="Imagem de capa da comunidade"
              className="h-36 w-full object-cover"
            />
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Informações</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="text-sm text-muted-foreground">
                {comunidade.description}
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Metric
                  label="Membros"
                  value={String(comunidade.membrosCount)}
                />
                <Metric
                  label="Links Ativos"
                  value={String(comunidade.linksAtivos)}
                />
                <Metric label="Status" value={<Badge>Ativa</Badge>} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="mt-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">Membros</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1">
                    <Plus className="size-4" />
                    Adicionar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Convidar membro</DialogTitle>
                  </DialogHeader>
                  <InviteMemberForm
                    onSubmit={(m) => {
                      setMembers((prev) => [
                        { id: crypto.randomUUID(), ...m },
                        ...prev,
                      ]);
                      toast.success("Convite enviado.");
                    }}
                  />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {isErrorMembers ? (
                <ErrorMembers onRetry={() => setErrorMembers(false)} />
              ) : isLoadingMembers ? (
                <TableSkeleton rows={4} cols={4} />
              ) : members.length === 0 ? (
                <EmptyState
                  title="Nenhum membro"
                  description="Convide pessoas para sua comunidade."
                  actionLabel="Convidar Membro"
                  onAction={() => {
                    const btn = document.activeElement as HTMLElement | null;
                    btn?.click();
                  }}
                />
              ) : (
                <div className="w-full overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Papel</TableHead>
                        <TableHead className="w-0"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.map((m) => (
                        <TableRow key={m.id}>
                          <TableCell className="font-medium">
                            {m.name}
                          </TableCell>
                          <TableCell>{m.email}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="gap-1">
                              <Shield className="size-3" />
                              {m.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost">
                                  <MoreHorizontal className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {RoleEnum.options.map((role) => (
                                  <DropdownMenuItem
                                    key={role}
                                    onSelect={() =>
                                      changeRole(
                                        m.id,
                                        role as Member["role"],
                                        setMembers
                                      )
                                    }
                                  >
                                    Tornar {role}
                                  </DropdownMenuItem>
                                ))}
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
                                        Remover membro?
                                      </AlertDialogTitle>
                                    </AlertDialogHeader>
                                    <p className="px-6 text-sm text-muted-foreground">
                                      Esta ação é irreversível. Confirme para
                                      remover.
                                    </p>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancelar
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        className="bg-red-600 hover:bg-red-700"
                                        onClick={() => {
                                          setMembers((prev) =>
                                            prev.filter((x) => x.id !== m.id)
                                          );
                                          toast.success("Membro removido.");
                                        }}
                                      >
                                        Remover
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conteudo" className="mt-4">
          <ContentLinks communityId={String(comunidade.id)} />
        </TabsContent>

        <TabsContent value="promocao" className="mt-4">
          <PromoLinks communityId={String(comunidade.id)} />
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <CommunitySettingsForm
            defaultValue={{
              name: comunidade.name,
              description: comunidade.description,
              privacy: "public",
            }}
            onSubmit={() => toast.success("Configurações salvas.")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ErrorMembers({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
      Não foi possível carregar os membros.
      <button className="ml-2 underline" onClick={onRetry}>
        Tentar novamente
      </button>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}

function InviteMemberForm({
  onSubmit,
}: {
  onSubmit?: (mem: Omit<Member, "id">) => void;
}) {
  const form = useForm<MemberInput>({
    resolver: zodResolver(MemberSchema),
    defaultValues: { name: "", email: "", role: "reader" },
  });
  return (
    <form
      className="grid gap-4"
      onSubmit={form.handleSubmit((data) => {
        onSubmit?.(data);
      })}
    >
      <div className="grid gap-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          {...form.register("name")}
          placeholder="Nome do membro"
        />
        {form.formState.errors.name ? (
          <p className="text-xs text-red-600">
            {form.formState.errors.name.message}
          </p>
        ) : null}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...form.register("email")}
          placeholder="email@exemplo.com"
        />
        {form.formState.errors.email ? (
          <p className="text-xs text-red-600">
            {form.formState.errors.email.message}
          </p>
        ) : null}
      </div>
      <div className="grid gap-2">
        <Label>Papel</Label>
        <RadioGroup
          defaultValue="reader"
          onValueChange={(v) => form.setValue("role", v as "reader")}
          className="grid grid-cols-3 gap-2"
        >
          {["admin", "editor", "reader"].map((p) => (
            <div
              key={p}
              className="flex items-center gap-2 rounded-md border p-2"
            >
              <RadioGroupItem id={`role-${p}`} value={p} />
              <Label htmlFor={`role-${p}`} className="font-normal">
                {p}
              </Label>
            </div>
          ))}
        </RadioGroup>
        {form.formState.errors.role ? (
          <p className="text-xs text-red-600">
            {form.formState.errors.role.message}
          </p>
        ) : null}
      </div>
      <DialogFooter>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Enviar convite
        </Button>
      </DialogFooter>
    </form>
  );
}

function changeRole(
  id: string,
  role: Member["role"],
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>
) {
  setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
  toast.success("Papel atualizado.");
}

function CommunitySettingsForm({
  defaultValue,
  onSubmit,
}: {
  defaultValue?: Partial<CommunityInput>;
  onSubmit?: (data: CommunityInput) => void;
}) {
  const form = useForm<CommunityInput>({
    resolver: zodResolver(CommunitySchema),
    defaultValues: {
      name: defaultValue?.name ?? "",
      description: defaultValue?.description ?? "",
      privacy: (defaultValue?.privacy as "public") ?? "public",
    },
  });
  return (
    <form
      className="grid gap-6"
      onSubmit={form.handleSubmit((data) => onSubmit?.(data))}
    >
      <div className="grid gap-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" {...form.register("name")} />
        {form.formState.errors.name ? (
          <p className="text-xs text-red-600">
            {form.formState.errors.name.message}
          </p>
        ) : null}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="desc">Descrição</Label>
        <Textarea id="desc" {...form.register("description")} />
        {form.formState.errors.description ? (
          <p className="text-xs text-red-600">
            {form.formState.errors.description.message}
          </p>
        ) : null}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="capa">Imagem de capa</Label>
        <Input id="capa" type="file" accept="image/*" />
      </div>
      <div className="grid gap-2">
        <Label>Privacidade</Label>
        <RadioGroup
          defaultValue={form.getValues("privacy")}
          onValueChange={(v) => form.setValue("privacy", v as "private")}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          <div className="flex items-center gap-2 rounded-md border p-3">
            <RadioGroupItem id="public" value="public" />
            <Label htmlFor="public" className="font-normal">
              Pública
            </Label>
          </div>
          <div className="flex items-center gap-2 rounded-md border p-3">
            <RadioGroupItem id="private" value="private" />
            <Label htmlFor="private" className="font-normal">
              Privada
            </Label>
          </div>
        </RadioGroup>
      </div>
      <div>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Salvar alterações
        </Button>
      </div>
    </form>
  );
}
