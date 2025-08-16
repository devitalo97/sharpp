import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import Link from "next/link";
import { Plus } from "lucide-react";
import { findManyCommunityAction } from "@/app/lib/backend/action/community.action";
import { CommunityTable } from "@/app/lib/frontend/components/table/community.table";

export default async function Page() {
  const communities = await findManyCommunityAction({});

  return (
    <div className="grid gap-4">
      <PageHeader
        title="Minhas Comunidades"
        description="Crie, edite e gerencie suas comunidades."
        actions={
          <Button asChild className="gap-1">
            <Link href="/community/new">
              <Plus className="size-4" />
              Criar Comunidade
            </Link>
          </Button>
        }
      />

      <CommunityTable communities={communities} />
    </div>
  );
}
