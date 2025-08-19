import { Omit } from "../../decorator/omit";
import { Content } from "../domain/entity/content.entity";
import { IDocumentRepository } from "../domain/repository/document.repository";
import { IObjectRepository } from "../domain/repository/object.repository";

export class UpdateOneContentUsecase {
  constructor(
    private readonly documentRepository: IDocumentRepository<Content>,
    private readonly objectRepository: IObjectRepository
  ) {}

  /**
   * Atualiza um conteúdo e, para cada mídia, só gera URL pré-assinada de GET
   * se não houver URL anterior ou se a existente estiver expirada.
   * Retorna o conteúdo enriquecido com `storage.url` e `storage.expires_at` quando necessário.
   */
  @Omit(["_id"])
  async execute(
    id: string,
    input: Partial<Content>
  ): Promise<Partial<Content>> {
    if (!input) {
      throw new Error("Parâmetro inválido: esperado um objeto de Content.");
    }

    // TTL padrão: 7 dias (em segundos)
    const ttl = Math.max(1, 604800);

    const now = Date.now();
    const medias = Array.isArray(input.medias) ? input.medias : [];

    const newMedias = await Promise.all(
      medias.map(async (m) => {
        const storage = m?.storage || {};

        // Sem key válida => não há como gerar URL
        if (!storage.key || typeof storage.key !== "string") {
          return { ...m, storage };
        }

        // Verifica se devemos renovar a URL
        const hasUrl =
          typeof storage.url === "string" && storage.url.length > 0;
        const expired =
          typeof storage.expires_at !== "number" || storage.expires_at <= now;

        if (!hasUrl || expired) {
          const url = await this.objectRepository.generateSignedDownloadUrl({
            key: storage.key,
            filename: `${m.name}.${m.ext}`,
            contentType: m.type,
            expiresInSeconds: ttl,
          });

          return {
            ...m,
            storage: {
              ...storage,
              url,
              expires_at: now + ttl * 1000,
            },
          };
        }

        // URL existente e ainda válida => mantém como está
        return { ...m, storage };
      })
    );

    const enriched = {
      ...input,
      medias: newMedias,
    };

    await this.documentRepository.updateOne({ id }, { $set: enriched });

    return enriched;
  }
}
