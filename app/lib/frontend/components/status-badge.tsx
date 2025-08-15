"use client";

import { Badge, badgeVariants } from "@/components/ui/badge";
import { VariantProps } from "class-variance-authority";

type BadgeProps = VariantProps<typeof badgeVariants>;

interface StatusBadgeProps extends Omit<BadgeProps, "variant"> {
  status: string;
  statusMap?: Record<string, BadgeProps["variant"]>;
}

const defaultStatusMap: Record<string, BadgeProps["variant"]> = {
  Ativo: "default",
  Pausado: "secondary",
  Expirado: "outline",
  Inativo: "secondary",
  Arquivada: "secondary",
};

export function StatusBadge({
  status,
  statusMap = defaultStatusMap,
  ...props
}: StatusBadgeProps) {
  const variant = statusMap[status] || "secondary";

  return (
    <Badge variant={variant} {...props}>
      {status}
    </Badge>
  );
}
