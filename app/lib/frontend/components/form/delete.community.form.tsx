"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { AlertTriangle, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { deleteOneByIdCommunityAction } from "@/app/lib/backend/action/community.action";

interface Props {
  community_id: string;
}

export function DeleteCommunityForm({ community_id }: Props) {
  // binda o id na server action
  const action = deleteOneByIdCommunityAction.bind(null, community_id);

  const [state, formAction, isPending] = useActionState<
    boolean | null,
    FormData
  >(action, null);

  // controla toasts a nível do form
  const loadingIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    if (isPending) {
      loadingIdRef.current = toast.loading("Excluindo comunidade…");
      return;
    }
    // terminou: fecha loading e mostra sucesso/erro
    if (loadingIdRef.current) {
      toast.dismiss(loadingIdRef.current);
      loadingIdRef.current = null;
    }
    if (state) {
      toast.success("Comunidade excluída com sucesso!");
      // opcional: router.refresh() ou navegação se a action não redirecionar
    } else if (!state) {
      toast.error("Erro ao deletar a comunidade.");
    }
  }, [isPending, state]);

  return (
    <form action={formAction}>
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Zona de Perigo
          </CardTitle>
          <CardDescription>
            Ações irreversíveis que afetam permanentemente a comunidade
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <fieldset disabled={isPending} aria-busy={isPending}>
            <Button
              variant="destructive"
              disabled={isPending}
              className="w-full"
              type="submit"
            >
              {isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-foreground border-t-transparent mr-2" />
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir Comunidade
                </>
              )}
            </Button>
          </fieldset>

          <p className="text-xs text-muted-foreground">
            Esta ação não pode ser desfeita. Todos os dados serão perdidos
            permanentemente.
          </p>
        </CardContent>
      </Card>
    </form>
  );
}
