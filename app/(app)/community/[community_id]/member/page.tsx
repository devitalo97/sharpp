import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  UserPlus,
  Shield,
  UserX,
  Users,
  Crown,
  User,
  Activity,
} from "lucide-react";
import { findOneByIdCommunityAction } from "@/app/lib/backend/action/community.action";
import Link from "next/link";
import { MemberTable } from "@/app/lib/frontend/components/table/member.table";
import { SearchMemberForm } from "@/app/lib/frontend/components/form/search.member.form";
import { findManyMemberAction } from "@/app/lib/backend/action/member.action";

const mockStats = {
  total: 1247,
  active: 1156,
  inactive: 91,
  admins: 3,
  moderators: 8,
  members: 1236,
};

interface PageProps {
  params: {
    community_id: string;
  };
}

export default async function CommunityMembersPage({ params }: PageProps) {
  const { community_id } = await params;

  // Mock community data - replace with actual data fetching
  const community = await findOneByIdCommunityAction(community_id);

  if (!community) {
    notFound();
  }

  const members = await findManyMemberAction({});
  const _members = members.map((m) => ({
    ...m,
    joinedAt: "2023-06-15T10:30:00Z",
    lastActivity: "2024-01-16T14:20:00Z",
    contentCount: 25,
    commentsCount: 89,
    likesReceived: 234,
    avatar: "/placeholder.svg?height=40&width=40",
  }));

  const breadcrumbs = [
    { label: "Comunidades", href: "/community" },
    { label: community.name, href: `/community/${community_id}` },
    { label: "Membros", href: `/community/${community_id}/member` },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Membros"
        description="Gerencie todos os membros da comunidade"
        breadcrumbs={breadcrumbs}
        actions={
          <div className="flex items-center gap-2">
            <Link href={`/community/${community_id}/member/new`}>
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Convidar Membro
              </Button>
            </Link>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.total}</div>
            <p className="text-xs text-muted-foreground">membros totais</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockStats.active}
            </div>
            <p className="text-xs text-muted-foreground">últimos 30 dias</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inativos</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {mockStats.inactive}
            </div>
            <p className="text-xs text-muted-foreground">sem atividade</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {mockStats.admins}
            </div>
            <p className="text-xs text-muted-foreground">administradores</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moderadores</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {mockStats.moderators}
            </div>
            <p className="text-xs text-muted-foreground">moderadores</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membros</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {mockStats.members}
            </div>
            <p className="text-xs text-muted-foreground">membros comuns</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <SearchMemberForm />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <MemberTable members={_members} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
