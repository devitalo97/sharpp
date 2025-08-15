"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import {
  ContentFormSchema,
  ContentTypeEnum,
  LinkStatusEnum,
  useContentForm,
} from "./use-content.form";
import { LinkIcon } from "lucide-react";

interface ContentFormProps {
  defaultValues?: Partial<ContentFormSchema>;
  onSubmit: (data: ContentFormSchema) => void;
  submitLabel?: string;
}

export function ContentForm({
  defaultValues,
  onSubmit,
  submitLabel = "Salvar",
}: ContentFormProps) {
  const form = useContentForm(defaultValues);

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-2">
        <Label htmlFor="titulo">Título</Label>
        <Input id="titulo" {...form.register("titulo")} />
        {form.formState.errors.titulo && (
          <p className="text-xs text-red-600">
            {form.formState.errors.titulo.message}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea id="descricao" {...form.register("descricao")} />
        {form.formState.errors.descricao && (
          <p className="text-xs text-red-600">
            {form.formState.errors.descricao.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="tipo">Tipo</Label>
          <select
            id="tipo"
            className="h-9 rounded-md border bg-background px-3 text-sm"
            {...form.register("tipo")}
          >
            {ContentTypeEnum.options.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            className="h-9 rounded-md border bg-background px-3 text-sm"
            {...form.register("status")}
          >
            {LinkStatusEnum.options.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="labels">Labels (separadas por vírgula)</Label>
        <Input
          id="labels"
          placeholder="ex.: onboarding, kit"
          defaultValue={(defaultValues?.labels || []).join(", ")}
          onChange={(e) => {
            const arr = e.currentTarget.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
            form.setValue("labels", arr);
          }}
        />
      </div>

      <DialogFooter className="mt-2">
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="gap-1"
        >
          <LinkIcon className="size-4" />
          {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}
