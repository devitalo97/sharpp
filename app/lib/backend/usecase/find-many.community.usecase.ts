import { Community } from "../domain/entity/community.entity";
import type { IDocumentRepository } from "../domain/repository/document.repository";

/**
 * Caso de uso para buscar múltiplas comunidades.
 */
export class FindManyCommunityUsecase {
  constructor(
    private readonly documentRepository: IDocumentRepository<Community>
  ) {}

  /**
   * Executa a busca de todos os artifacts, ordenando do mais recente ao mais antigo.
   * @returns Array de Community
   */
  public async execute(input: Partial<Community>): Promise<Community[]> {
    const docs = await this.documentRepository.findMany(input);
    return docs;
  }
}
