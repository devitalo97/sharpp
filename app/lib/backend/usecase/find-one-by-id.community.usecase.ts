import { Omit } from "../../decorator/omit";
import { Community } from "../domain/entity/community.entity";
import { IDocumentRepository } from "../domain/repository/document.repository";

export class FindOneByIdCommunityUsecase {
  constructor(
    private readonly documentRepository: IDocumentRepository<Community>
  ) {}

  /**
   * Pesquisa por um conteúdo a partir do id.
   */
  @Omit(["_id"])
  async execute(id: string): Promise<Community | null> {
    return await this.documentRepository.findOne({ id });
  }
}
