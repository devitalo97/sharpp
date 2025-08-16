import { Media } from "./media.entity";

export interface Content {
  id: string;
  slug: string;
  community_id: string;
  name: string;
  description?: string;
  medias?: Media[];
  tags?: string[];
}
