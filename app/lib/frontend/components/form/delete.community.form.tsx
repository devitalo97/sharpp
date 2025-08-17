"use client";

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
import { useActionState } from "react";

interface Props {
  community_id: string;
}
export function DeleteCommunityForm(props: Props) {
  const { community_id } = props;
  const binded = deleteOneByIdCommunityAction.bind(null, community_id);
  const [, formAction, isPending] = useActionState(binded, null);

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
          <Button
            variant="destructive"
            disabled={isPending}
            className="w-full"
            type="submit"
          >
            {isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />
                Exluindo...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir Comunidade
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground">
            Esta ação não pode ser desfeita. Todos os dados serão perdidos
            permanentemente.
          </p>
        </CardContent>
      </Card>
    </form>
  );
}
