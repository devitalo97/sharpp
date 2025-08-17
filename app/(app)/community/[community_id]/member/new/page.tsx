import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { CreateMemberForm } from "@/app/lib/frontend/components/form/create.member.form";
import { findOneByIdCommunityAction } from "@/app/lib/backend/action/community.action";

interface PageProps {
  params: {
    community_id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { community_id } = await params;

  // Mock community data - replace with actual data fetching
  const community = await findOneByIdCommunityAction(community_id);

  if (!community) {
    notFound();
  }

  const breadcrumbs = [
    { label: "Comunidades", href: "/community" },
    { label: community.name, href: `/community/${community_id}` },
    { label: "Membros", href: `/community/${community_id}/member` },
    { label: "Novo Membro", href: `/community/${community_id}/member/new` },
  ];

  return (
    <div className="grid gap-4">
      <PageHeader
        title="Novo Membro"
        description="Adicione um novo membro à comunidade"
        breadcrumbs={breadcrumbs}
      />

      <CreateMemberForm community_id={community_id} />
    </div>
  );
}
