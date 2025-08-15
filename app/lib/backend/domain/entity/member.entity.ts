export type MemberRole = "admin" | "editor" | "author" | "reader";
export type MemberStatus = "invited" | "active" | "removed" | "blocked";

export interface Member {
  id: string;
  community_id: string;
  user_id?: string; // undefined até aceitar convite
  email: string; // snapshot do momento do convite
  display_name?: string; // snapshot do nome no momento do convite
  role: MemberRole;
  status: MemberStatus;
  invited_at?: Date;
  joined_at?: Date;
  last_activity_at?: Date;

  invite?: {
    token_hash?: string; // hash do token de convite
    expires_at?: Date;
  };
}
