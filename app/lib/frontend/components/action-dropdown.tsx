"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal } from "lucide-react";

export interface ActionItem {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "destructive";
  confirm?: {
    title: string;
    description: string;
    confirmLabel?: string;
  };
}

interface ActionDropdownProps {
  actions: ActionItem[];
  trigger?: React.ReactNode;
}

export function ActionDropdown({ actions, trigger }: ActionDropdownProps) {
  const defaultTrigger = (
    <Button size="icon" variant="ghost">
      <MoreHorizontal className="size-4" />
    </Button>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger || defaultTrigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((action, index) => {
          const content = (
            <DropdownMenuItem
              key={index}
              className={
                action.variant === "destructive" ? "text-red-600" : undefined
              }
              onSelect={action.confirm ? undefined : action.onClick}
            >
              {action.icon && <action.icon className="mr-2 size-4" />}
              {action.label}
            </DropdownMenuItem>
          );

          if (action.confirm) {
            return (
              <AlertDialog key={index}>
                <AlertDialogTrigger asChild>{content}</AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{action.confirm.title}</AlertDialogTitle>
                  </AlertDialogHeader>
                  <p className="px-6 text-sm text-muted-foreground">
                    {action.confirm.description}
                  </p>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      className={
                        action.variant === "destructive"
                          ? "bg-red-600 hover:bg-red-700"
                          : undefined
                      }
                      onClick={action.onClick}
                    >
                      {action.confirm.confirmLabel || "Confirmar"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            );
          }

          return content;
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
