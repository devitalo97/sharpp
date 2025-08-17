// utils/file-mime.ts
import {
  contentType as guessFromName,
  extension as extFromMime,
} from "mime-types";

const CUSTOM_MIME_BY_EXT: Record<string, string> = {
  ".ts": "application/typescript",
  ".tsx": "application/typescript",
  ".md": "text/markdown; charset=utf-8",
  ".jsonl": "application/x-ndjson",
  ".sql": "text/plain; charset=utf-8",
  ".env": "text/plain; charset=utf-8",
};

const CUSTOM_EXT_BY_MIME: Record<string, string> = {
  "application/typescript": "ts", // se vier desse MIME, padronize para .ts (ajuste se quiser .tsx)
  "text/markdown": "md",
  "application/x-ndjson": "jsonl",
};

function getDotExt(name: string): string | undefined {
  // Pega a última ocorrência de ponto, ignora nomes ocultos tipo ".gitignore"
  const m = /(?:^|\/)([^\/]+)$/.exec(name)?.[1]?.toLowerCase(); // só o basename
  if (!m) return;
  const i = m.lastIndexOf(".");
  if (i <= 0 || i === m.length - 1) return; // sem extensão (ou termina com ponto)
  return m.slice(i); // ex: ".tsx"
}

export async function resolveMimeAndExt(
  file: File
): Promise<{ type: string; ext: string }> {
  const name = file.name.toLowerCase();
  const dotExt = getDotExt(name); // ex: ".tsx"

  // 1) MIME vindo do navegador (pode ser vazio/ruim p/ .ts/.tsx)
  let type = file.type && file.type !== "video/mp2t" ? file.type : "";

  // 2) Se vazio ou problemático, tente por nome com mime-types
  if (!type) {
    const byName = guessFromName(name); // pode ser string ou false
    if (byName) type = byName;
  }

  // 3) Overrides por extensão para casos comuns que o browser/lib não resolvem bem
  if (dotExt && CUSTOM_MIME_BY_EXT[dotExt]) {
    type = CUSTOM_MIME_BY_EXT[dotExt];
  }

  // 4) Heurística leve: caso continue vazio, tente detectar se é texto/código (opcional)
  if (
    !type &&
    dotExt &&
    [".ts", ".tsx", ".md", ".json", ".jsonl", ".txt", ".env", ".sql"].includes(
      dotExt
    )
  ) {
    try {
      const head = await file.slice(0, 512).text();
      const looksText = /[\x09\x0A\x0D\x20-\x7E]/.test(head); // ASCII imprimível
      if (looksText) {
        type = CUSTOM_MIME_BY_EXT[dotExt] || "text/plain; charset=utf-8";
      }
    } catch {
      /* ignore */
    }
  }

  // 5) Fallback final
  if (!type) type = "application/octet-stream";

  // 6) Extensão preferencial a partir do MIME
  let ext = extFromMime(type) || "";
  // Ajustes manuais (quando mime-types não souber mapear)
  if (!ext && CUSTOM_EXT_BY_MIME[type]) ext = CUSTOM_EXT_BY_MIME[type];

  // 7) Se ainda não temos extensão pelo MIME, use a do nome (sem ponto)
  if (!ext && dotExt) ext = dotExt.slice(1);

  // 8) Fallback definitivo
  if (!ext) ext = "bin";

  return { type, ext };
}
