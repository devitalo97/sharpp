import { Member } from "../domain/entity/member.entity";
import type { IDocumentRepository } from "../domain/repository/document.repository";

/**
 * Caso de uso para buscar múltiplos membros.
 */
export class FindManyMemberUsecase {
  constructor(
    private readonly documentRepository: IDocumentRepository<Member>
  ) {}

  /**
   * Executa a busca de todos os membros
   * @returns Array de Member
   */
  public async execute(input: Partial<Member>): Promise<Member[]> {
    const docs = await this.documentRepository.findMany(input);
    return docs;
  }
}
