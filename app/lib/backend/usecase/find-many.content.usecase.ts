import { Content } from "../domain/entity/content.entity";
import type { IDocumentRepository } from "../domain/repository/document.repository";

/**
 * Caso de uso para buscar múltiplos membros.
 */
export class FindManyContentUsecase {
  constructor(
    private readonly documentRepository: IDocumentRepository<Content>
  ) {}

  /**
   * Executa a busca de todos os membros
   * @returns Array de Content
   */
  public async execute(input: Partial<Content>): Promise<Content[]> {
    const docs = await this.documentRepository.findMany(input);
    return docs;
  }
}
