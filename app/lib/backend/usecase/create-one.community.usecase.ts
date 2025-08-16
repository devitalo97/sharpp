import { Omit } from "../../decorator/omit";
import { Community } from "../domain/entity/community.entity";
import { IDocumentRepository } from "../domain/repository/document.repository";

export class CreateOneCommunityUsecase {
  constructor(
    private readonly documentRepository: IDocumentRepository<Community>
  ) {}

  /**
   * Cria múltiplos conteúdos e, para cada mídia, gera URL pré-assinada de GET.
   * Retorna os conteúdos já enriquecidos com `storage.url` e `storage.expires_at`.
   */
  @Omit(["_id"])
  async execute(input: Community): Promise<Community> {
    if (!input) {
      throw new Error("Parâmetro inválido: esperado um objeto de Community.");
    }
    // Persiste no repositório de documentos
    const created = await this.documentRepository.insertOne(input);

    return created;
  }
}
