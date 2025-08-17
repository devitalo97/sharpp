"use client";

import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod/v3";
import { createOneMemberAction } from "@/app/lib/backend/action/member.action";
import { nanoid } from "nanoid";

interface UseCreateMemberFormProps {
  community_id: string;
}

export const createMemberSchema = z.object({
  id: z.string().default(nanoid(21)),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  bio: z.string().max(500, "Descrição muito longa").optional(),
  role: z.enum(["admin", "member", "moderator"]),
  status: z
    .enum(["invited", "active", "inactive", "removed", "blocked"])
    .default("active"),
  deleted: z.boolean().default(false),
  archived: z.boolean().default(false),
});

export type CreateMemberFormData = z.infer<typeof createMemberSchema>;

export function useCreateMemberForm({
  community_id,
}: UseCreateMemberFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateMemberFormData>({
    resolver: zodResolver(createMemberSchema) as Resolver<CreateMemberFormData>,
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      role: "member",
      status: "active",
    },
  });

  const onSubmit = async (data: CreateMemberFormData) => {
    setIsSubmitting(true);

    try {
      toast.loading("Criando membro...");

      // Simulate API call
      await createOneMemberAction({ ...data, community_id });

      toast.success("Membro criado com sucesso!");

      // Redirect back to s list
      router.push(`/community/${community_id}/member`);
    } catch (error) {
      toast.error("Erro ao criar membro");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/community/${community_id}/member`);
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit, (e) => console.log(e)),
    handleCancel,
    isSubmitting,
  };
}
