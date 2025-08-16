"use client";

import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod/v3";
import { useState } from "react";
import { toast } from "sonner";
import { normalize } from "../../util/normalize";
import { createOneCommunityAction } from "@/app/lib/backend/action/community.action";
import { nanoid } from "nanoid";

const communitySchema = z.object({
  id: z.string().default(nanoid(21)),
  tenant_id: z.string().default(nanoid(21)),
  owner_id: z.string().default(nanoid(21)),
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome muito longo"),
  slug: z
    .string()
    .min(2, "Slug deve ter pelo menos 2 caracteres")
    .max(50, "Slug muito longo")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug deve conter apenas letras minúsculas, números e hífens"
    ),
  description: z.string().max(500, "Descrição muito longa").optional(),
  status: z.enum(["active", "paused", "archived"]),
  visibility: z.enum(["private", "unlisted", "public"]),
  tags: z.array(z.string()).max(10, "Máximo 10 tags").optional(),
  limits: z
    .object({
      members_qty: z
        .number()
        .min(1, "Limite mínimo é 1")
        .max(10000, "Limite máximo é 10.000")
        .optional(),
    })
    .optional(),
  created_at: z.date().default(() => new Date()),
});

type CommunityFormSchema = z.infer<typeof communitySchema>;

export function useCommunityForm() {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CommunityFormSchema>({
    resolver: zodResolver(communitySchema) as Resolver<CommunityFormSchema>,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      status: "active",
      visibility: "public",
      tags: [],
      limits: undefined,
    },
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue("name", name);
    form.setValue("slug", normalize(name));
  };

  const addTag = () => {
    if (
      tagInput.trim() &&
      !tags.includes(tagInput.trim()) &&
      tags.length < 10
    ) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      form.setValue("tags", newTags);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    form.setValue("tags", newTags);
  };

  const onSubmit = async (data: CommunityFormSchema) => {
    setIsSubmitting(true);
    try {
      toast.loading("Criando comunidade...");
      await createOneCommunityAction(data);
      toast.success(`A comunidade "${data.name}" foi criada com sucesso.`);
    } catch (error) {
      toast.error("Ocorreu um erro ao criar a comunidade.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return {
    form,
    handleNameChange,
    addTag,
    removeTag,
    onSubmit,
    tags,
    tagInput,
    setTagInput,
    isSubmitting,
  };
}
