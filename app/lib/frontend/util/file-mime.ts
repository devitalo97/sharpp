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
): Promise<{ type: string; ext: string; name: string }> {
  const originalName = file.name; // mantém o case para exibição
  const lowerName = originalName.toLowerCase();
  const dotExt = getDotExt(lowerName); // ex.: ".tsx"

  // 1) MIME do navegador (ignora o "video/mp2t" problemático)
  let type = file.type && file.type !== "video/mp2t" ? file.type : "";

  // 2) Se vazio, tenta pelo nome
  if (!type) {
    const byName = guessFromName(lowerName);
    if (byName) type = byName;
  }

  // 3) Overrides por extensão conhecida
  if (dotExt && CUSTOM_MIME_BY_EXT[dotExt]) {
    type = CUSTOM_MIME_BY_EXT[dotExt];
  }

  // 4) Heurística leve para arquivos de texto/código
  if (
    !type &&
    dotExt &&
    [".ts", ".tsx", ".md", ".json", ".jsonl", ".txt", ".env", ".sql"].includes(
      dotExt
    )
  ) {
    try {
      const head = await file.slice(0, 512).text();
      const looksText = /[\x09\x0A\x0D\x20-\x7E]/.test(head);
      if (looksText) {
        type = CUSTOM_MIME_BY_EXT[dotExt] || "text/plain; charset=utf-8";
      }
    } catch {
      /* ignore */
    }
  }

  // 5) Fallback MIME
  if (!type) type = "application/octet-stream";

  // 6) Ext preferencial pelo MIME
  let ext = extFromMime(type) || "";
  if (!ext && CUSTOM_EXT_BY_MIME[type]) ext = CUSTOM_EXT_BY_MIME[type];

  // 7) Se ainda não, usa a do nome (sem ponto)
  if (!ext && dotExt) ext = dotExt.slice(1);

  // 8) Fallback definitivo
  if (!ext) ext = "bin";

  // 9) baseName (remove apenas a ÚLTIMA extensão)
  //    trata dotfiles como ".env" (vira "env" em vez de string vazia)
  const withoutLast = originalName.replace(/\.[^/.]+$/, "");
  const baseName =
    withoutLast.length === 0 && originalName.startsWith(".")
      ? originalName.slice(1)
      : withoutLast;

  return { type, ext, name: baseName };
}
