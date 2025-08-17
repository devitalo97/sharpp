import { Media } from "./media.entity";

export interface Content {
  id: string;
  slug: string;
  community_id: string;
  name: string;
  description?: string;
  medias: Media[];
  tags: string[];

  status: "draft" | "archived" | "published";

  scheduled_at?: Date;
  expires_at?: Date;
  created_at: Date;
}
