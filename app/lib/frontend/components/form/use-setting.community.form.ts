import { updateOneCommunityAction } from "@/app/lib/backend/action/community.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const communitySchema = z.object({
  id: z.string(),
  owner_id: z.string().optional(),
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome muito longo")
    .optional(),
  slug: z
    .string()
    .min(2, "Slug deve ter pelo menos 2 caracteres")
    .max(50, "Slug muito longo")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug deve conter apenas letras minúsculas, números e hífens"
    )
    .optional(),
  description: z.string().max(500, "Descrição muito longa").optional(),
  status: z.enum(["active", "paused", "archived"]).optional(),
  visibility: z.enum(["private", "public"]).optional(),
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
  language: z.string().optional(),
  timezone: z.string().optional(),
  enable_notifications: z.boolean().optional(),
});

type SettingCommunityFormSchema = z.infer<typeof communitySchema>;

interface Props {
  defaultValues: SettingCommunityFormSchema;
}
export const useSettingCommunityForm = (props: Props) => {
  const { defaultValues } = props;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<SettingCommunityFormSchema>({
    resolver: zodResolver(
      communitySchema
    ) as Resolver<SettingCommunityFormSchema>,
    defaultValues,
  });

  const onSubmit = async (data: SettingCommunityFormSchema) => {
    try {
      setIsSubmitting(true);
      toast.loading("Atualizando comunidade...");
      await updateOneCommunityAction(defaultValues.id, data);
      toast.success(`A comunidade "${data.name}" foi atualizada com sucesso.`);
    } catch (error) {
      toast.error("Ocorreu um erro ao atualizar a comunidade.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { form, isSubmitting, onSubmit };
};
