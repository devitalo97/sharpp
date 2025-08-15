"use client";

import { useState } from "react";
import { useForm, useFieldArray, Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

/** =========================
 *  Zod schemas e tipos
 *  ========================= */
export const mediaSchema = z.object({
  file: z.instanceof(File),
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional().default(""),
  tags: z.array(z.string()).default([]),
  customAttributes: z.record(z.string(), z.string()).default({}),
  uploadProgress: z.number().default(0),
  uploadStatus: z
    .enum(["pending", "uploading", "completed", "error"])
    .default("pending"),
  s3Key: z.string().optional().default(""),
  uploadUrl: z.string().optional().default(""),
});

export const contentLinkSchema = z.object({
  linkTitle: z.string().min(1, "Título do link é obrigatório"),
  linkDescription: z.string().optional(),
  medias: z.array(mediaSchema).min(1, "Pelo menos uma mídia é obrigatória"),
});

// Use tipo de ENTRADA no RHF (aceita undefined; defaults aplicados via parse)
export type ContentLinkFormInput = z.input<typeof contentLinkSchema>;
export type MediaItemInput = z.input<typeof mediaSchema>;

type Options = {
  signedUrlEndpoint?: string; // ex.: "/api/generate-signed-url"
  s3Prefix?: string; // ex.: "content-links"
};

export function useContentLinkForm(options: Options = {}) {
  const {
    signedUrlEndpoint = "/api/generate-signed-url",
    s3Prefix = "content-links",
  } = options;

  const [isSubmitting, setIsSubmitting] = useState(false);

  // drafts por mídia (evita espelhar valor entre cards)
  const [tagDrafts, setTagDrafts] = useState<Record<number, string>>({});
  const [attrDrafts, setAttrDrafts] = useState<
    Record<number, { key: string; value: string }>
  >({});

  const setTagDraft = (i: number, v: string) =>
    setTagDrafts((prev) => ({ ...prev, [i]: v }));

  const setAttrDraft = (i: number, field: "key" | "value", v: string) =>
    setAttrDrafts((prev) => ({ ...prev, [i]: { ...prev[i], [field]: v } }));

  const form = useForm<ContentLinkFormInput>({
    resolver: zodResolver(contentLinkSchema) as Resolver<
      z.output<typeof contentLinkSchema>
    >,
    defaultValues: {
      linkTitle: "",
      linkDescription: "",
      medias: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "medias",
  });

  /** =========================
   *  Helpers
   *  ========================= */
  const generateS3Key = (file: File, index: number): string => {
    const ts = Date.now();
    const rnd = Math.random().toString(36).slice(2, 10);
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
    return `${s3Prefix}/${ts}-${rnd}-${index}.${ext}`;
  };

  const getSignedUploadUrl = async (
    file: File,
    s3Key: string
  ): Promise<string> => {
    const res = await fetch(signedUrlEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: s3Key,
        contentType: file.type,
        contentLength: file.size,
        contentDispositionFileName: file.name,
      }),
    });
    if (!res.ok) throw new Error("Falha ao gerar URL de upload");
    const data = await res.json();
    return data.signedUrl as string;
  };

  const uploadFile = (
    file: File,
    signedUrl: string,
    onProgress: (n: number) => void
  ) =>
    new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100);
          onProgress(pct);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve();
        else reject(new Error(`Upload falhou [${xhr.status}]`));
      });

      xhr.addEventListener("error", () =>
        reject(new Error("Erro de rede durante upload"))
      );

      xhr.open("PUT", signedUrl);
      xhr.setRequestHeader(
        "Content-Type",
        file.type || "application/octet-stream"
      );
      xhr.send(file);
    });

  /** =========================
   *  Actions expostas
   *  ========================= */
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const baseIndex = fields.length;

    files.forEach((file, i) => {
      const s3Key = generateS3Key(file, baseIndex + i);
      append({
        file,
        title: file.name.replace(/\.[^/.]+$/, ""),
        description: "",
        tags: [],
        customAttributes: {},
        uploadProgress: 0,
        uploadStatus: "pending",
        s3Key,
        uploadUrl: "",
      });
    });

    event.target.value = "";
  };

  const addTag = (mediaIndex: number) => {
    const draft = (tagDrafts[mediaIndex] || "").trim();
    if (!draft) return;
    const current = fields[mediaIndex];
    update(mediaIndex, { ...current, tags: [...current.tags, draft] });
    setTagDraft(mediaIndex, "");
  };

  const removeTag = (mediaIndex: number, tagIndex: number) => {
    const current = fields[mediaIndex];
    update(mediaIndex, {
      ...current,
      tags: current.tags.filter((_, i) => i !== tagIndex),
    });
  };

  const addCustomAttribute = (mediaIndex: number) => {
    const draft = attrDrafts[mediaIndex] || { key: "", value: "" };
    const k = (draft.key || "").trim();
    const v = (draft.value || "").trim();
    if (!k || !v) return;

    const current = fields[mediaIndex];
    update(mediaIndex, {
      ...current,
      customAttributes: { ...current.customAttributes, [k]: v },
    });

    setAttrDraft(mediaIndex, "key", "");
    setAttrDraft(mediaIndex, "value", "");
  };

  const removeCustomAttribute = (mediaIndex: number, attributeKey: string) => {
    const current = fields[mediaIndex];
    const attrs = { ...current.customAttributes };
    delete attrs[attributeKey];
    update(mediaIndex, { ...current, customAttributes: attrs });
  };

  const uploadMedia = async (mediaIndex: number) => {
    const media = fields[mediaIndex];

    try {
      update(mediaIndex, {
        ...media,
        uploadStatus: "uploading",
        uploadProgress: 0,
      });
      toast.loading(`Iniciando upload de ${media.title}...`, {
        id: `upload-${mediaIndex}`,
      });

      const signedUrl = await getSignedUploadUrl(media.file, media.s3Key || "");
      update(mediaIndex, { ...media, uploadUrl: signedUrl });

      await uploadFile(media.file, signedUrl, (progress) => {
        const snap = fields[mediaIndex];
        update(mediaIndex, { ...snap, uploadProgress: progress });
        toast.loading(`Enviando ${media.title}... ${progress}%`, {
          id: `upload-${mediaIndex}`,
        });
      });

      const finalSnap = fields[mediaIndex];
      update(mediaIndex, {
        ...finalSnap,
        uploadStatus: "completed",
        uploadProgress: 100,
      });
      toast.success(`${media.title} foi enviado com sucesso!`, {
        id: `upload-${mediaIndex}`,
      });
    } catch {
      const snap = fields[mediaIndex];
      update(mediaIndex, { ...snap, uploadStatus: "error", uploadProgress: 0 });
      toast.error(`Falha ao enviar ${media.title}. Tente novamente.`, {
        id: `upload-${mediaIndex}`,
      });
    }
  };

  const uploadAllMedias = async () => {
    const pending = fields
      .map((m, i) => ({ m, i }))
      .filter(({ m }) => m.uploadStatus === "pending");

    if (pending.length === 0) {
      toast.info("Não há mídias pendentes para upload.");
      return;
    }

    toast.info(`Iniciando upload de ${pending.length} mídia(s)...`);
    for (const { i } of pending) {
      await uploadMedia(i);
    }
    toast.success("Todos os uploads foram concluídos!");
  };

  const onSubmit = async (data: ContentLinkFormInput) => {
    setIsSubmitting(true);
    try {
      const normalized = contentLinkSchema.parse(data);
      const pending = normalized.medias.filter(
        (m) => m.uploadStatus !== "completed"
      );
      if (pending.length > 0) {
        toast.error(
          "Todas as mídias devem ser enviadas antes de salvar o link."
        );
        return;
      }

      toast.loading("Salvando link de conteúdo...");
      // TODO: chame sua API real aqui
      // await fetch("/api/content-links", { method: "POST", body: JSON.stringify(normalized) });
      await new Promise((r) => setTimeout(r, 1200));

      toast.success("Link de conteúdo criado com sucesso!");
      form.reset();
      setTagDrafts({});
      setAttrDrafts({});
    } catch {
      toast.error("Ocorreu um erro ao salvar o link de conteúdo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // form
    form,
    fields,
    append,
    remove,
    update,

    // estados
    isSubmitting,

    // drafts por mídia
    tagDrafts,
    setTagDraft,
    attrDrafts,
    setAttrDraft,

    // actions
    handleFileSelect,
    addTag,
    removeTag,
    addCustomAttribute,
    removeCustomAttribute,
    uploadMedia,
    uploadAllMedias,
    onSubmit,
  };
}
