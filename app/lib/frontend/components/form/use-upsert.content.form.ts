"use client";

import type React from "react";
import { useState } from "react";
import { useForm, useFieldArray, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { extension } from "mime-types";
import { Content } from "@/app/lib/backend/domain/entity/content.entity";
import {
  createOneContentAction,
  updateOneContentAction,
} from "@/app/lib/backend/action/content.action";

const mimeTypeRegex = /^[a-z]+\/[a-z0-9.+-]+$/i;
const hexRegex = /^[A-Fa-f0-9]+$/;

export const mediaSchema = z.object({
  file: z.instanceof(File).optional(), // Optional for existing media
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
  custom_attributes: z.record(z.string(), z.string()).optional().default({}),
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
    url: z.string().optional(),
  }),
});

export type MediaFormData = z.infer<typeof mediaSchema>;

const contentUpsertSchema = z.object({
  id: z.string().optional(),
  community_id: z.string().min(1, "community_id é obrigatório"),
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
  medias: z.array(mediaSchema).min(1, "Pelo menos uma mídia é obrigatória"),
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
  const [newAttributeStates, setNewAttributeStates] = useState<
    Record<number, { key: string; value: string }>
  >({});

  const form = useForm<ContentUpsertFormSchema>({
    resolver: zodResolver(
      contentUpsertSchema
    ) as Resolver<ContentUpsertFormSchema>,
    defaultValues: {
      id: initialData?.id,
      community_id: communityId,
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      medias:
        initialData?.medias?.map((media) => ({
          ...media,
          tags: media.tags || [],
          custom_attributes: media.custom_attributes || {},
          upload: {
            progress: 100,
            status: "completed" as const,
            url: media.storage?.url || "",
          },
        })) || [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "medias",
    keyName: "id",
  });

  const generateS3Key = (
    file: File,
    communityId: string,
    contentId: string,
    mediaId: string
  ): string => {
    const ext =
      extension(file.type) ||
      file.name.split(".").pop()?.toLowerCase() ||
      "bin";
    return `${communityId}/${contentId}/${mediaId}.${ext}`;
  };

  const getSignedUploadUrl = async (
    file: File,
    s3Key: string
  ): Promise<string> => {
    const response = await fetch("/api/generate-signed-put-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: s3Key,
        contentType: file.type,
      }),
    });

    if (!response.ok) {
      throw new Error("Falha ao gerar URL de upload");
    }

    const data = await response.json();
    return data.signedUrl;
  };

  const uploadFile = async (
    file: File,
    signedUrl: string,
    onProgress: (progress: number) => void
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          resolve();
        } else {
          reject(new Error(`Upload falhou com status ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", (e) => {
        console.error(e);
        reject(
          e instanceof Error ? e : new Error("Erro de upload desconhecido")
        );
      });

      xhr.open("PUT", signedUrl);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    files.forEach((file) => {
      const mediaId = nanoid(21);
      const s3Key = generateS3Key(file, communityId, contentId, mediaId);

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
      });
    });

    event.target.value = "";
  };

  const addTag = (mediaIndex: number) => {
    if (!newTag.trim()) return;

    const currentMedia = fields[mediaIndex];
    const updatedTags = [...(currentMedia.tags || []), newTag.trim()];

    update(mediaIndex, {
      ...currentMedia,
      tags: updatedTags,
    });

    setNewTag("");
  };

  const removeTag = (mediaIndex: number, tagIndex: number) => {
    const currentMedia = fields[mediaIndex];
    const updatedTags = (currentMedia.tags || []).filter(
      (_, index) => index !== tagIndex
    );

    update(mediaIndex, {
      ...currentMedia,
      tags: updatedTags,
    });
  };

  const getNewAttributeKey = (mediaIndex: number) =>
    newAttributeStates[mediaIndex]?.key || "";

  const getNewAttributeValue = (mediaIndex: number) =>
    newAttributeStates[mediaIndex]?.value || "";

  const setNewAttributeKey = (mediaIndex: number) => (key: string) => {
    setNewAttributeStates((prev) => ({
      ...prev,
      [mediaIndex]: { ...prev[mediaIndex], key },
    }));
  };

  const setNewAttributeValue = (mediaIndex: number) => (value: string) => {
    setNewAttributeStates((prev) => ({
      ...prev,
      [mediaIndex]: { ...prev[mediaIndex], value },
    }));
  };

  const addCustomAttribute = (mediaIndex: number) => {
    const key = getNewAttributeKey(mediaIndex);
    const value = getNewAttributeValue(mediaIndex);

    if (!key.trim() || !value.trim()) return;

    const currentMedia = fields[mediaIndex];
    const updatedAttributes = {
      ...(currentMedia.custom_attributes || {}),
      [key.trim()]: value.trim(),
    };

    update(mediaIndex, {
      ...currentMedia,
      custom_attributes: updatedAttributes,
    });

    setNewAttributeStates((prev) => ({
      ...prev,
      [mediaIndex]: { key: "", value: "" },
    }));
  };

  const removeCustomAttribute = (mediaIndex: number, attributeKey: string) => {
    const currentMedia = fields[mediaIndex];
    const updatedAttributes = { ...(currentMedia.custom_attributes || {}) };
    delete updatedAttributes[attributeKey];

    update(mediaIndex, {
      ...currentMedia,
      custom_attributes: updatedAttributes,
    });
  };

  const uploadMedia = async (mediaIndex: number) => {
    const media = fields[mediaIndex];
    if (!media.file) return;

    try {
      update(mediaIndex, {
        ...media,
        upload: {
          ...media.upload,
          status: "uploading",
          progress: 0,
        },
      });

      toast.loading(`Iniciando upload de ${media.name}...`, {
        id: `upload-${mediaIndex}`,
      });

      const signedUrl = await getSignedUploadUrl(media.file, media.storage.key);

      await uploadFile(media.file, signedUrl, (progress) => {
        update(mediaIndex, {
          ...fields[mediaIndex],
          upload: {
            ...fields[mediaIndex].upload,
            progress,
          },
        });

        toast.loading(`Enviando ${media.name}... ${progress}%`, {
          id: `upload-${mediaIndex}`,
        });
      });

      update(mediaIndex, {
        ...fields[mediaIndex],
        upload: {
          ...fields[mediaIndex].upload,
          status: "completed",
          progress: 100,
        },
      });

      toast.success(`${media.name} foi enviado com sucesso!`, {
        id: `upload-${mediaIndex}`,
      });
    } catch (error) {
      update(mediaIndex, {
        ...fields[mediaIndex],
        upload: {
          ...fields[mediaIndex].upload,
          status: "error",
          progress: 0,
        },
      });

      toast.error(`Falha ao enviar ${media.name}. Tente novamente.`, {
        id: `upload-${mediaIndex}`,
      });
    }
  };

  const uploadAllMedias = async () => {
    const pendingMedias = fields
      .map((media, index) => ({ media, index }))
      .filter(({ media }) => media.upload?.status === "pending");

    if (pendingMedias.length === 0) {
      toast.info("Não há mídias pendentes para upload.");
      return;
    }

    toast.info(`Iniciando upload de ${pendingMedias.length} mídia(s)...`);

    for (const { index } of pendingMedias) {
      await uploadMedia(index);
    }

    toast.success("Todos os uploads foram concluídos!");
  };

  const onSubmit = async (data: ContentUpsertFormSchema) => {
    setIsSubmitting(true);

    try {
      const pendingUploads = data.medias.filter(
        (media) => media.upload?.status !== "completed"
      );

      if (pendingUploads.length > 0) {
        toast.error("Todas as mídias devem ser enviadas antes de salvar.");
        return;
      }

      const contentData = {
        ...data,
        medias: data.medias.map(({ upload, file, ...media }) => media),
      };

      if (isEditMode) {
        await updateOneContentAction(contentId, contentData);
      } else {
        await createOneContentAction({ ...contentData, id: contentId });
      }

      toast.loading(
        isEditMode ? "Salvando alterações..." : "Criando conteúdo..."
      );

      toast.success(
        isEditMode
          ? "Conteúdo atualizado com sucesso!"
          : "Conteúdo criado com sucesso!"
      );

      if (!isEditMode) {
        form.reset();
      }
    } catch (error) {
      toast.error(
        initialData
          ? "Ocorreu um erro ao salvar as alterações."
          : "Ocorreu um erro ao criar o conteúdo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    fields,
    isSubmitting,
    newTag,
    setNewTag,
    getNewAttributeKey,
    getNewAttributeValue,
    setNewAttributeKey,
    setNewAttributeValue,
    handleFileSelect,
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
