export interface Media {
  id: string;
  community_id: string;
  filename: string;
  mime_type: string; // ex: image/png, video/mp4, application/pdf
  metadata: {
    width?: number;
    height?: number;
    format?: string;
    size_bytes?: number;
  };
  tags?: string[];
}
