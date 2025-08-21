export type MemberRole = "admin" | "member" | "moderator";
export type MemberStatus =
  | "active"
  | "inactive"
  | "invited"
  | "removed"
  | "blocked";
export interface Member {
  id: string;
  community_id: string;
  user_id?: string; // undefined até aceitar convite

  name: string;
  role: MemberRole;
  status: MemberStatus;
  email?: string;
  phone?: string;
  bio?: string;

  invite?: {
    token_hash: string; // hash do token de convite
    expires_at: Date;
  };

  deleted: boolean;
  archived: boolean;

  deleted_at?: Date;
  archived_at?: Date;
  invited_at?: Date;
  joined_at?: Date;
}
