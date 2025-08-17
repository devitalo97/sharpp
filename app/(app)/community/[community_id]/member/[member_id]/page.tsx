import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Crown,
  Shield,
  User,
  Mail,
  Activity,
  Clock,
  UserCheck,
  Archive,
  Trash2,
  Edit,
  MessageSquare,
  Heart,
  FileText,
  AlertTriangle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { findOneByIdCommunityAction } from "@/app/lib/backend/action/community.action";
import { findOneByIdMemberAction } from "@/app/lib/backend/action/member.action";

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
    case "invited":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "removed":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "blocked":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "active":
      return "Ativo";
    case "inactive":
      return "Inativo";
    case "invited":
      return "Convidado";
    case "removed":
      return "Removido";
    case "blocked":
      return "Bloqueado";
    default:
      return status;
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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
    member_id: string;
  };
}

export default async function MemberManagementPage({ params }: PageProps) {
  const { community_id, member_id } = await params;

  // Mock community data - replace with actual data fetching
  const community = await findOneByIdCommunityAction(community_id);
  const _member = await findOneByIdMemberAction(member_id);

  if (!community || !_member) {
    notFound();
  }

  const member = {
    ..._member,
    token_hash: null,
    expires_at: null,
    contentCount: 25,
    commentsCount: 89,
    likesReceived: 234,
    lastActivity: "2024-01-16T14:20:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
  };

  const breadcrumbs = [
    { label: "Comunidades", href: "/community" },
    { label: community.name, href: `/community/${community_id}` },
    { label: "Membros", href: `/community/${community_id}/member` },
    {
      label: member.name,
      href: `/community/${community_id}/member/${member_id}`,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={member.name}
        description="Gerencie as informações e permissões do membro"
        breadcrumbs={breadcrumbs}
        actions={
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Ações
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Shield className="h-4 w-4 mr-2" />
                  Alterar Função
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Alterar Status
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Archive className="h-4 w-4 mr-2" />
                  Arquivar Membro
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir Membro
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Member Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Membro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={member.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-lg">
                    {member.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-xl font-semibold">{member.name}</h2>
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
                        {getStatusLabel(member.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-3">
                      <Mail className="h-4 w-4" />
                      <span>{member.email}</span>
                    </div>
                    {member.bio && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {member.bio}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas de Atividade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{member.contentCount}</p>
                    <p className="text-sm text-muted-foreground">Conteúdos</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <MessageSquare className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{member.commentsCount}</p>
                    <p className="text-sm text-muted-foreground">Comentários</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                    <Heart className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{member.likesReceived}</p>
                    <p className="text-sm text-muted-foreground">Curtidas</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico do Membro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {member.joined_at && (
                  <div className="flex items-center gap-3 p-3 border-l-2 border-green-500 bg-green-50 dark:bg-green-950">
                    <UserCheck className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="font-medium">Membro aceito na comunidade</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(member.joined_at.toLocaleDateString())}
                      </p>
                    </div>
                  </div>
                )}
                {member.invited_at && (
                  <div className="flex items-center gap-3 p-3 border-l-2 border-blue-500 bg-blue-50 dark:bg-blue-950">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="font-medium">Convite enviado</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(member.invited_at.toLocaleDateString())}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 border-l-2 border-gray-300 bg-gray-50 dark:bg-gray-950">
                  <Activity className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="font-medium">Última atividade</p>
                    <p className="text-sm text-muted-foreground">
                      {getRelativeTime(member.lastActivity)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
              >
                <Shield className="h-4 w-4 mr-2" />
                Alterar Função
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Alterar Status
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
              >
                <Mail className="h-4 w-4 mr-2" />
                Reenviar Convite
              </Button>
              <Separator />
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
              >
                <Archive className="h-4 w-4 mr-2" />
                Arquivar Membro
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-destructive hover:text-destructive bg-transparent"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir Membro
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir Membro</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. O membro será
                      permanentemente removido da comunidade e todos os seus
                      dados serão excluídos.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>

          {/* Member Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes Técnicos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">ID do Membro:</span>
                <span className="font-mono">{member.id}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">ID do Usuário:</span>
                <span className="font-mono">{member.user_id || "N/A"}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Arquivado:</span>
                <span>{member.archived ? "Sim" : "Não"}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Excluído:</span>
                <span>{member.deleted ? "Sim" : "Não"}</span>
              </div>
            </CardContent>
          </Card>

          {/* Invite Status */}
          {member.status === "invited" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Status do Convite
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Convite pendente</span>
                </div>
                {member.expires_at && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Expira em:</span>
                    <br />
                    <span className="font-medium">
                      {formatDate(member.expires_at)}
                    </span>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Reenviar Convite
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
