/** =========================== RICH TEXT ============================ */

type Color =
  | "default"
  | "gray"
  | "brown"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "red"
  | "gray_background"
  | "brown_background"
  | "orange_background"
  | "yellow_background"
  | "green_background"
  | "blue_background"
  | "purple_background"
  | "pink_background"
  | "red_background";

type Annotations = {
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  underline?: boolean;
  code?: boolean;
  color?: Color;
};

type Text = {
  text: string;
  annotations?: Annotations;
};

/** ============================ FILE =============================== */

type FileRef = {
  type: string; // ex: image/png, video/mp4, application/pdf
  ext: string; // ex: .ts, .tsx, .png
  size: number;
  metadata?: {
    width?: number;
    height?: number;
    format?: string;
  };
  storage: {
    key: string; // Caminho do arquivo no storage object
    url?: string; // URL de acesso temporario
    expires_at?: number; // Data de expiração do URL
    checksum?: string; // Hash do arquivo para verificação de integridade
  };
};

/** =========================== BLOCK TYPES ============================ */

export type BlockContentMap = {
  paragraph: Text;
  heading_1: Text;
  heading_2: Text;
  heading_3: Text;
  toggle: Text;
  quote: Text;
  image: FileRef;
  video: FileRef;
  audio: FileRef;
  file: FileRef;
  pdf: FileRef;
  link_to_page: { page_id: string };
  page: { title: string };
};

export type BlockType = keyof BlockContentMap;

/** ===================== BLOCK GENÉRICO/UNIÃO ======================== */

export type Block<T extends BlockType = BlockType> = {
  id: string; // UUID
  has_children?: boolean;

  created_at?: number;
  updated_at?: number;
  archived_at?: number;
  deleted_at?: number;
  archived?: boolean;
  deleted?: boolean;

  type: T;
  content: BlockContentMap[T]; // conteúdo tipado por tipo
  children?: AnyBlock[]; // opcional: alguns tipos suportam filhos
};

export type AnyBlock = {
  [K in BlockType]: Block<K>;
}[BlockType];

/** ============================ HELPERS ============================== */

// Type guard de narrowing por tipo
export function isBlock<T extends BlockType>(
  b: AnyBlock,
  t: T
): b is Extract<AnyBlock, { type: T }> {
  return b.type === t;
}
