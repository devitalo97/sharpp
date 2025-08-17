import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserPlus,
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Shield,
  UserX,
  Users,
  Crown,
  User,
  Calendar,
  Activity,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data - replace with actual data fetching
const mockMembers = [
  {
    id: "1",
    name: "João Silva",
    email: "joao.silva@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "admin",
    status: "active",
    joinedAt: "2023-06-15T10:30:00Z",
    lastActivity: "2024-01-16T14:20:00Z",
    contentCount: 25,
    commentsCount: 89,
    likesReceived: 234,
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria.santos@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "moderator",
    status: "active",
    joinedAt: "2023-08-22T09:15:00Z",
    lastActivity: "2024-01-15T16:45:00Z",
    contentCount: 18,
    commentsCount: 156,
    likesReceived: 189,
  },
  {
    id: "3",
    name: "Pedro Costa",
    email: "pedro.costa@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "member",
    status: "active",
    joinedAt: "2023-09-10T11:20:00Z",
    lastActivity: "2024-01-14T08:30:00Z",
    contentCount: 12,
    commentsCount: 67,
    likesReceived: 145,
  },
  {
    id: "4",
    name: "Ana Oliveira",
    email: "ana.oliveira@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "member",
    status: "inactive",
    joinedAt: "2023-11-05T14:45:00Z",
    lastActivity: "2023-12-20T10:15:00Z",
    contentCount: 3,
    commentsCount: 12,
    likesReceived: 28,
  },
];

const mockStats = {
  total: 1247,
  active: 1156,
  inactive: 91,
  admins: 3,
  moderators: 8,
  members: 1236,
};

function getRoleIcon(role: string) {
  switch (role) {
    case "admin":
      return <Crown className="h-4 w-4" />;
    case "moderator":
      return <Shield className="h-4 w-4" />;
    default:
      return <User className="h-4 w-4" />;
  }
}

function getRoleColor(role: string) {
  switch (role) {
    case "admin":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "moderator":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "inactive":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "banned":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 24) {
    return `${diffInHours}h atrás`;
  } else if (diffInHours < 24 * 7) {
    return `${Math.floor(diffInHours / 24)}d atrás`;
  } else {
    return formatDate(dateString);
  }
}

interface PageProps {
  params: {
    community_id: string;
  };
}

export default async function CommunityMembersPage({ params }: PageProps) {
  const { community_id } = await params;

  // Mock community data - replace with actual data fetching
  const community = {
    id: community_id,
    name: "Comunidade de Desenvolvedores",
    slug: "dev-community",
  };

  if (!community) {
    notFound();
  }

  const breadcrumbs = [
    { label: "Comunidades", href: "/communities" },
    { label: community.name, href: `/community/${community_id}` },
    { label: "Membros", href: `/community/${community_id}/members` },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Membros"
        description="Gerencie todos os membros da comunidade"
        breadcrumbs={breadcrumbs}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Convidar Membro
            </Button>
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
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar membros..." className="pl-10" />
              </div>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                  <SelectItem value="banned">Banidos</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                  <SelectItem value="moderator">Moderadores</SelectItem>
                  <SelectItem value="member">Membros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{member.name}</h3>
                      <Badge
                        variant="secondary"
                        className={getRoleColor(member.role)}
                      >
                        <div className="flex items-center gap-1">
                          {getRoleIcon(member.role)}
                          <span className="capitalize">{member.role}</span>
                        </div>
                      </Badge>
                      <Badge
                        variant="outline"
                        className={getStatusColor(member.status)}
                      >
                        {member.status === "active"
                          ? "Ativo"
                          : member.status === "inactive"
                          ? "Inativo"
                          : "Banido"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {member.email}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Membro desde {formatDate(member.joinedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        <span>
                          Ativo {getRelativeTime(member.lastActivity)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <span>{member.contentCount} conteúdos</span>
                      <span>{member.commentsCount} comentários</span>
                      <span>{member.likesReceived} curtidas recebidas</span>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar Mensagem
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Shield className="h-4 w-4 mr-2" />
                      Alterar Função
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <UserX className="h-4 w-4 mr-2" />
                      Remover Membro
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
