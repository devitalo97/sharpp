import { Omit } from "../../decorator/omit";
import { Content } from "../domain/entity/content.entity";
import { IDocumentRepository } from "../domain/repository/document.repository";

export class FindOneByIdContentUsecase {
  constructor(
    private readonly documentRepository: IDocumentRepository<Content>
  ) {}

  /**
   * Pesquisa por um conteúdo a partir do id.
   */
  @Omit(["_id"])
  async execute(id: string): Promise<Content | null> {
    return await this.documentRepository.findOne({ id });
  }
}
