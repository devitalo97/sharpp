export type CommunityStatus = "active" | "paused" | "archived";
export type CommunityVisibility = "private" | "public";

export interface CommunityLimits {
  members_qty?: number;
}

export interface Community {
  id: string;
  tenant_id: string;
  owner_id: string;

  name: string;
  slug: string;
  description?: string;
  language: string; //pt-BR en-US;
  timezone: string; // IANA timezone, ex: "America/Sao_Paulo" Intl.DateTimeFormat
  status: CommunityStatus; // "active" | "paused" | "archived"
  tags?: string[];
  limits?: CommunityLimits;

  visibility: CommunityVisibility;
  enable_notifications: boolean;

  deleted: boolean;
  archived: boolean;

  created_at: Date;
  updated_at?: Date;
  archived_at?: Date | null;
  deleted_at?: Date | null;
}
