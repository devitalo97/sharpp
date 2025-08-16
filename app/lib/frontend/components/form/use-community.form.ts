"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod/v3";
import { useState } from "react";
import { toast } from "sonner";
import { normalize } from "../../util/normalize";

const communitySchema = z.object({
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
  membersLimit: z
    .number()
    .min(1, "Limite mínimo é 1")
    .max(10000, "Limite máximo é 10.000")
    .optional(),
  avatarUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  coverUrl: z.string().url("URL inválida").optional().or(z.literal("")),
});

type CommunityFormSchema = z.infer<typeof communitySchema>;

export function useCommunityForm() {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const form = useForm<CommunityFormSchema>({
    resolver: zodResolver(communitySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      status: "active",
      visibility: "public",
      tags: [],
      membersLimit: undefined,
      avatarUrl: "",
      coverUrl: "",
    },
  });

  const watchedName = form.watch("name");
  const watchedAvatarUrl = form.watch("avatarUrl");
  const watchedCoverUrl = form.watch("coverUrl");

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

  const onSubmit = (data: CommunityFormSchema) => {
    console.log("Dados da comunidade:", data);
    toast.success("Comunidade criada!", {
      description: `A comunidade "${data.name}" foi criada com sucesso.`,
    });
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
    watchedName,
    watchedAvatarUrl,
    watchedCoverUrl,
  };
}
