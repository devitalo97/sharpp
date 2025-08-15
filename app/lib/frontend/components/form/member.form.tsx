"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DialogFooter } from "@/components/ui/dialog";
import { MemberFormSchema, useMemberForm } from "./use-member.form";

interface MemberFormProps {
  defaultValues?: Partial<MemberFormSchema>;
  onSubmit: (data: MemberFormSchema) => void;
  submitLabel?: string;
}

export function MemberForm({
  defaultValues,
  onSubmit,
  submitLabel = "Enviar convite",
}: MemberFormProps) {
  const form = useMemberForm(defaultValues);

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-2">
        <Label htmlFor="nome">Nome</Label>
        <Input
          id="nome"
          {...form.register("nome")}
          placeholder="Nome do membro"
        />
        {form.formState.errors.nome && (
          <p className="text-xs text-red-600">
            {form.formState.errors.nome.message}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...form.register("email")}
          placeholder="email@exemplo.com"
        />
        {form.formState.errors.email && (
          <p className="text-xs text-red-600">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label>Papel</Label>
        <RadioGroup
          defaultValue="Leitor"
          onValueChange={(v) =>
            form.setValue("papel", v as "Admin" | "Editor" | "Leitor")
          }
          className="grid grid-cols-3 gap-2"
        >
          {["Admin", "Editor", "Leitor"].map((p) => (
            <div
              key={p}
              className="flex items-center gap-2 rounded-md border p-2"
            >
              <RadioGroupItem id={`papel-${p}`} value={p} />
              <Label htmlFor={`papel-${p}`} className="font-normal">
                {p}
              </Label>
            </div>
          ))}
        </RadioGroup>
        {form.formState.errors.papel && (
          <p className="text-xs text-red-600">
            {form.formState.errors.papel.message}
          </p>
        )}
      </div>

      <DialogFooter>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}
