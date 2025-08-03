export interface Artifact {
  id: string;
  key: string; // caminho no S3 (ex: uploads/user123/image.jpg)
  signed_url?: string;
  signed_url_expires_at?: Date;
  created_at: Date;
  updated_at: Date;
  type: "image" | "video" | "pdf" | "other";
  tags?: string[];
  metadata?: {
    width?: number;
    height?: number;
    format?: string;
    size_bytes?: number;
    content_type?: string; // ex: image/png
  };

  title?: string;
  description?: string;
  attributes?: ArtifactAttribute[];
}

export interface ArtifactAttribute {
  /** Nome do atributo, ex: "autor", "resolução", "cor" */
  key: string;
  /** Valor do atributo, ex: "Italo Souza", "1920x1080", "azul" */
  value: string;
}
