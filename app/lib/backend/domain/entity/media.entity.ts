export interface Media {
  id: string;
  community_id: string;
  content_id: string;
  name: string;
  description?: string;
  type: string; // ex: image/png, video/mp4, application/pdf
  ext: string; // ex: .ts, .tsx, .png
  size: number;
  metadata?: {
    width?: number;
    height?: number;
    format?: string;
  };
  tags?: string[];
  custom_attributes?: Record<string, string>;
  storage: {
    key: string; // Caminho do arquivo no storage object
    url?: string; // URL de acesso temporario
    expires_at?: number; // Data de expiração do URL
    checksum?: string; // Hash do arquivo para verificação de integridade
  };
}
