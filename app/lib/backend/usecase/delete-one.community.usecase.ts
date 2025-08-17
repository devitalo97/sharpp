import { Omit } from "../../decorator/omit";
import { Community } from "../domain/entity/community.entity";
import { IDocumentRepository } from "../domain/repository/document.repository";

export class DeleteOneByIdCommunityUsecase {
  constructor(
    private readonly documentRepository: IDocumentRepository<Community>
  ) {}

  /**
   * Deletar uma comunidade
   */
  @Omit(["_id"])
  async execute(id: string): Promise<void> {
    await this.documentRepository.updateOne(
      { id },
      { $set: { deleted_at: new Date(), deleted: true } }
    );
  }
}
