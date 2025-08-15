export type LinkStatus = "Ativo" | "Pausado" | "Expirado";

export interface Content {
  id: string;
  community_id: string;
  title: string;
  description?: string;
  url: string;
  media_ids?: string[];
  status: LinkStatus;
  tags?: string[];
}
