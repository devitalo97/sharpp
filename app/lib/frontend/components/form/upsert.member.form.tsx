// ===== file: src/app/components/member/create.member.form.tsx =====
"use client";

import * as React from "react";
import { FormProvider } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  UpsertMemberSchema,
  useCreateMemberForm,
} from "./use-upsert.member.form";

interface UpsertMemberFormProps {
  community_id: string;
  defaultValues?: UpsertMemberSchema;
}

export function UpsertMemberForm({
  community_id,
  defaultValues,
}: UpsertMemberFormProps) {
  const isEdit = Boolean(defaultValues?.id);

  const { onSubmit, isSubmitting, form } = useCreateMemberForm({
    community_id,
    defaultValues,
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className="w-full">
        <Card className="max-w-2xl">
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="Ex.: Maria Silva"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">E-mail (opcional)</Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                placeholder="maria@exemplo.com"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="username">Username (opcional)</Label>
                <Input
                  id="username"
                  {...form.register("username")}
                  placeholder="maria.silva"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefone (opcional)</Label>
                <Input
                  id="phone"
                  {...form.register("phone")}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2 justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEdit
                  ? "Salvando..."
                  : "Criando..."
                : isEdit
                ? "Salvar alterações"
                : "Criar membro"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  );
}
