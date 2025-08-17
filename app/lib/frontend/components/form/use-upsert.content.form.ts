"use client";
import { useState } from "react";
import type React from "react";

import { useForm, useFieldArray, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { createManyContentAction } from "@/app/lib/backend/action/content.action";
import { updateOneContentAction } from "@/app/lib/backend/action/content.action";
import type { Content } from "@/app/lib/backend/domain/entity/content.entity";

const mimeTypeRegex = /^[a-z]+\/[a-z0-9.+-]+$/i;
const hexRegex = /^[A-Fa-f0-9]+$/;

export const mediaSchema = z.object({
  file: z.instanceof(File).optional(),
  id: z.string().min(1, "id é obrigatório"),
  community_id: z.string().min(1, "community_id é obrigatório"),
  content_id: z.string().min(1, "content_id é obrigatório"),
  name: z.string().min(1, "name é obrigatório"),
  description: z.string().optional(),
  type: z
    .string()
    .regex(mimeTypeRegex, "type deve ser um MIME válido (ex.: image/png)"),
  size: z.number().int().nonnegative().describe("tamanho em bytes"),
  metadata: z
    .object({
      width: z.number().int().positive().optional(),
      height: z.number().int().positive().optional(),
      format: z.string().min(1).optional(),
    })
    .optional(),
  tags: z.array(z.string().min(1)).optional().default([]),
  custom_attributes: z.record(z.string(), z.string()),
  storage: z.object({
    key: z.string().min(1, "storage.key é obrigatório"),
    url: z.url().optional(),
    expires_at: z.number().int().positive().optional(),
    checksum: z
      .string()
      .regex(hexRegex, "checksum deve ser hexadecimal")
      .optional(),
  }),
  upload: z.object({
    progress: z.number().default(0),
    status: z
      .enum(["pending", "uploading", "completed", "error"])
      .default("pending"),
    url: z.string(),
  }),
  created_at: z.date().default(() => new Date()),
});

export type Media = z.infer<typeof mediaSchema>;

const contentUpsertSchema = z.object({
  id: z.string().default(() => nanoid(21)),
  community_id: z.string().default(() => nanoid(21)),
  name: z.string().min(1, "Nome do conteúdo é obrigatório"),
  slug: z
    .string()
    .min(2, "Slug deve ter pelo menos 2 caracteres")
    .max(50, "Slug muito longo")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug deve conter apenas letras minúsculas, números e hífens"
    ),
  description: z.string().optional(),
  status: z.enum(["draft", "archived", "published"]).default("draft"),
  scheduled_at: z.date().optional(),
  expires_at: z.date().optional(),
  medias: z.array(mediaSchema).min(1, "Pelo menos uma mídia é obrigatória"),
  tags: z.array(z.string().min(1)).optional().default([]),
  created_at: z.date().default(() => new Date()),
});

type ContentUpsertFormSchema = z.infer<typeof contentUpsertSchema>;

interface UseContentUpsertFormProps {
  initialData?: Content;
  communityId: string;
}

export function useContentUpsertForm({
  initialData,
  communityId,
}: UseContentUpsertFormProps) {
  const isEditMode = !!initialData;
  const contentId = initialData?.id || nanoid(21);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [activeTab, setActiveTab] = useState<"content" | "media" | "settings">(
    "content"
  );

  const form = useForm<ContentUpsertFormSchema>({
    resolver: zodResolver(
      contentUpsertSchema
    ) as Resolver<ContentUpsertFormSchema>,
    defaultValues: isEditMode
      ? {
          id: initialData.id,
          community_id: initialData.community_id,
          name: initialData.name,
          slug: initialData.slug,
          description: initialData.description || "",
          status: initialData.status,
          scheduled_at: initialData.scheduled_at
            ? new Date(initialData.scheduled_at)
            : undefined,
          expires_at: initialData.expires_at
            ? new Date(initialData.expires_at)
            : undefined,
          medias:
            initialData.medias?.map((media) => ({
              ...media,
              file: undefined,
              tags: media.tags || [],
              custom_attributes: media.custom_attributes || {},
              upload: {
                progress: 100,
                status: "completed" as const,
                url: media.storage.url || "",
              },
            })) || [],
        }
      : {
          id: contentId,
          community_id: communityId,
          name: "",
          slug: "",
          description: "",
          status: "draft",
          medias: [],
        },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "medias",
    keyName: "id",
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    addFiles(files);
    event.target.value = "";
  };

  const handleFileDrop = (files: File[]) => {
    addFiles(files);
  };

  const addFiles = (files: File[]) => {
    files.forEach((file) => {
      const mediaId = nanoid(21);
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "bin";
      const s3Key = `${communityId}/${contentId}/${mediaId}.${fileExtension}`;

      append({
        id: mediaId,
        content_id: contentId,
        community_id: communityId,
        file,
        name: file.name.replace(/\.[^/.]+$/, ""),
        description: "",
        tags: [],
        custom_attributes: {},
        type: file.type,
        size: file.size,
        storage: {
          key: s3Key,
        },
        upload: {
          progress: 0,
          status: "pending",
          url: "",
        },
        created_at: new Date(),
      });
    });
  };

  const addTag = (mediaIndex: number) => (tag: string) => {
    update(mediaIndex, {
      ...fields[mediaIndex],
      tags: [...fields[mediaIndex].tags, tag],
    });
  };

  const removeTag = (mediaIndex: number) => (tagIndex: number) => {
    update(mediaIndex, {
      ...fields[mediaIndex],
      tags: fields[mediaIndex].tags.filter((_, index) => index !== tagIndex),
    });
  };

  const addCustomAttribute =
    (mediaIndex: number) => (key: string, value: string) => {
      update(mediaIndex, {
        ...fields[mediaIndex],
        custom_attributes: {
          ...fields[mediaIndex].custom_attributes,
          [key]: value,
        },
      });
    };

  const removeCustomAttribute = (mediaIndex: number) => (key: string) => {
    const media = fields[mediaIndex];
    const customAttributes = { ...media.custom_attributes };
    delete customAttributes[key];
    update(mediaIndex, { ...media, custom_attributes: customAttributes });
  };

  const uploadMedia = async (mediaIndex: number) => {
    const media = fields[mediaIndex];
    if (!media.file) return;

    // Simulate upload
    const progressInterval = setInterval(() => {
      update(mediaIndex, {
        ...media,
        upload: { ...media.upload, progress: media.upload.progress + 10 },
      });
    }, 500);

    setTimeout(() => {
      clearInterval(progressInterval);
      update(mediaIndex, {
        ...media,
        upload: {
          ...media.upload,
          status: "completed",
          url: "https://example.com/uploaded-file",
        },
      });
    }, 5000);
  };

  const uploadAllMedias = async () => {
    for (let i = 0; i < fields.length; i++) {
      await uploadMedia(i);
    }
  };

  const onSubmit = async (data: ContentUpsertFormSchema) => {
    setIsSubmitting(true);

    try {
      // Verificar se todas as mídias foram enviadas
      const pendingUploads = data.medias.filter(
        (media) => media.upload?.status !== "completed"
      );

      if (pendingUploads.length > 0) {
        toast.error(
          "Todas as mídias devem ser enviadas antes de salvar o conteúdo."
        );
        return;
      }

      const loadingMessage = isEditMode
        ? "Salvando alterações..."
        : "Salvando conteúdo...";
      const successMessage = isEditMode
        ? "Conteúdo atualizado com sucesso!"
        : "Conteúdo criado com sucesso!";

      toast.loading(loadingMessage);

      // Preparar dados para envio (remover propriedades de upload)
      const contentData = {
        ...data,
        medias: data.medias.map(({ upload, file, ...media }) => media),
      };

      if (isEditMode) {
        // Modo de edição: usar updateOneContentAction
        await updateOneContentAction(contentId, contentData);
      } else {
        // Modo de criação: usar createManyContentAction
        await createManyContentAction([contentData]);
      }

      toast.success(successMessage);

      // Reset do formulário apenas no modo de criação
      if (!isEditMode) {
        form.reset();
      }
    } catch (error) {
      const errorMessage = isEditMode
        ? "Ocorreu um erro ao salvar as alterações."
        : "Ocorreu um erro ao criar o conteúdo.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    fields,
    isSubmitting,
    isEditMode,
    activeTab,
    setActiveTab,
    newTag,
    setNewTag,
    handleFileSelect,
    handleFileDrop,
    addTag,
    removeTag,
    addCustomAttribute,
    removeCustomAttribute,
    uploadMedia,
    uploadAllMedias,
    removeMedia: remove,
    onSubmit,
  };
}
