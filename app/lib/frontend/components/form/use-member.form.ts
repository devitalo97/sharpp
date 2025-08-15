"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod/v3";

// Membro
export const RoleEnum = z.enum(["Admin", "Editor", "Leitor"]);

export const MemberSchema = z.object({
  nome: z.string().min(2, "Nome muito curto"),
  email: z.string().email("Email inválido"),
  papel: RoleEnum.default("Leitor"),
});
export type MemberFormSchema = z.input<typeof MemberSchema>;

export function useMemberForm(defaultValues?: Partial<MemberFormSchema>) {
  return useForm<MemberFormSchema>({
    resolver: zodResolver(MemberSchema),
    defaultValues: {
      nome: "",
      email: "",
      papel: "Leitor",
      ...defaultValues,
    },
  });
}
