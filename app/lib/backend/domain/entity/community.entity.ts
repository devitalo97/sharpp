export type CommunityStatus = "active" | "paused" | "archived";
export type CommunityVisibility = "private" | "unlisted" | "public";
export type CommunityPlan = "free" | "pro" | "vip";

export interface CommunityLimits {
  members_qty?: number;
}

export interface CommunityAudit {
  created_by?: string;
  updated_by?: string;
  archived_by?: string;
  deleted_by?: string;
}

export interface Community {
  id: string;

  tenant_id: string;

  name: string;
  slug: string;
  description?: string;

  avatar_url?: string;
  cover_url?: string;

  status: CommunityStatus; // "active" | "paused" | "archived"
  visibility: CommunityVisibility; // "private" | "unlisted" | "public"

  tags?: string[];

  limits?: CommunityLimits;

  owner_id: string;

  created_at: Date;
  updated_at: Date;
  archived_at?: Date | null;
  deleted_at?: Date | null;

  audit?: CommunityAudit;
}
