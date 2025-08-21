// ===== file: src/app/components/member/create.member.form.tsx =====
"use client";

import { createOneMemberAction } from "@/app/lib/backend/action/member.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { nanoid } from "nanoid";
import * as React from "react";
import { Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod/v3";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// --- Shared schema (keep in sync with the hook) ---
export const upsertMemberSchema = z.object({
  id: z.string().optional(),
  community_id: z.string(),
  name: z.string().min(2, "Nome muito curto"),
  email: z
    .string()
    .email("E-mail inválido")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? undefined : v)),
  username: z.string().optional(),
  phone: z.string().refine((value) => {
    const phone = parsePhoneNumberFromString(value);
    return phone?.isValid();
  }, "Número de telefone inválido"),
  bio: z.string().max(500, "Descrição muito longa").optional(),
  role: z.enum(["member", "moderator"]).default("member"),
  status: z
    .enum(["invited", "active", "inactive", "removed", "blocked"])
    .default("active"),
  deleted: z.boolean().default(false),
  archived: z.boolean().default(false),
});
export type UpsertMemberSchema = z.infer<typeof upsertMemberSchema>;

export type CreateMemberFormProps = {
  community_id: string;
  defaultValues?: Partial<UpsertMemberSchema>;
};

export function useCreateMemberForm({
  community_id,
  defaultValues,
}: CreateMemberFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const form = useForm<UpsertMemberSchema>({
    resolver: zodResolver(upsertMemberSchema) as Resolver<UpsertMemberSchema>,
    defaultValues: {
      ...defaultValues,
      community_id,
      role: "member",
      status: "active",
    },
  });

  const onSubmit = async (data: UpsertMemberSchema) => {
    setIsSubmitting(true);

    try {
      toast.loading("Criando membro...");
      const id = defaultValues?.id ?? nanoid();

      await createOneMemberAction({ ...data, community_id, id });

      toast.success("Membro criado com sucesso!");
    } catch (error) {
      toast.error("Erro ao criar membro", {
        description: error instanceof Error ? error.message : "unknown",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit, (e) => console.log(e)),
    isSubmitting,
  };
}
