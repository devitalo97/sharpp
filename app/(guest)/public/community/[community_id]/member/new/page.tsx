// ===== file: src/app/(guest)/public/community/[community_id]/members/new/page.tsx =====
import { UpsertMemberForm } from "@/app/lib/frontend/components/form/upsert.member.form";
import { Button } from "@/app/lib/frontend/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// This is a Server Component file by default (Next.js App Router)
// It renders a client form component inside.

export default async function Page({
  params,
}: {
  params: Promise<{ community_id: string }>;
}) {
  const { community_id } = await params;

  // TODO: enforce guest auth + access to community_id here
  // e.g., await assertGuestCanManageMembers(community_id)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/public/community/${community_id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para comunidade
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Faça seu cadastro
          </h1>
          <p className="text-muted-foreground">
            Explore todos os conteúdos disponíveis nesta comunidade após o
            cadastro.
          </p>
        </div>

        <UpsertMemberForm community_id={community_id} />
      </div>
    </div>
  );
}
