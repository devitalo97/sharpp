"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod/v3";

export const ContentTypeEnum = z.enum([
  "Imagem",
  "Video",
  "Documento",
  "Texto",
]);
export const LinkStatusEnum = z.enum(["Ativo", "Pausado", "Expirado"]);

const ContentSchema = z.object({
  titulo: z.string().min(2, "Informe um título"),
  descricao: z.string().max(2000).optional(),
  // .default torna o INPUT opcional; o OUTPUT vira obrigatório com valor padrão
  tipo: ContentTypeEnum.default("Documento"),
  status: LinkStatusEnum.default("Ativo"),
  labels: z.array(z.string()).optional(),
});

// Tipos úteis
export type ContentFormSchema = z.input<typeof ContentSchema>; // antes da validação (tipo/status opcionais)

export function useContentForm(defaultValues?: Partial<ContentFormSchema>) {
  return useForm<ContentFormSchema>({
    resolver: zodResolver(ContentSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      tipo: "Documento",
      status: "Ativo",
      labels: [],
      ...defaultValues,
    },
  });
}
