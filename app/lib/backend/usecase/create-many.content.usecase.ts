import { Omit } from "../../decorator/omit";
import { Content } from "../domain/entity/content.entity";
import { IDocumentRepository } from "../domain/repository/document.repository";
import { IObjectRepository } from "../domain/repository/object.repository";

export class CreateManyContentUsecase {
  constructor(
    private readonly documentRepository: IDocumentRepository<Content>,
    private readonly objectRepository: IObjectRepository
  ) {}

  /**
   * Cria múltiplos conteúdos e, para cada mídia, gera URL pré-assinada de GET.
   * Retorna os conteúdos já enriquecidos com `storage.url` e `storage.expires_at`.
   */
  @Omit(["_id"])
  async execute(input: Content[]): Promise<Content[]> {
    if (!Array.isArray(input)) {
      throw new Error("Parâmetro inválido: esperado um array de Content.");
    }
    if (input.length === 0) {
      return [];
    }

    const ttl = Math.max(1, 604800); // default 7 dias

    // Clona/normaliza e gera URLs pré-assinadas
    const enriched: Content[] = await Promise.all(
      input.map(async (content) => {
        const medias = Array.isArray(content.medias) ? content.medias : [];

        const newMedias = await Promise.all(
          medias.map(async (m) => {
            // Garantir estrutura de storage
            const storage = m.storage;
            if (!storage.key || typeof storage.key !== "string") {
              // Sem key => devolve mídia inalterada
              return { ...m, storage };
            }

            // Gera URL de GET para visualização/baixa
            const url = await this.objectRepository.generateSignedGetUrl({
              key: storage.key,
              expiresInSeconds: ttl,
            });

            const expiresAtMs = Date.now() + ttl * 1000;

            return {
              ...m,
              storage: {
                ...storage,
                url,
                expires_at: expiresAtMs,
              },
            };
          })
        );

        return {
          ...content,
          medias: newMedias,
        };
      })
    );

    // Persiste no repositório de documentos
    const created = await this.documentRepository.insertMany(enriched);
    return created;
  }
}
