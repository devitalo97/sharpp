import { Omit } from "../../decorator/omit";
import { Member } from "../domain/entity/member.entity";
import { IDocumentRepository } from "../domain/repository/document.repository";

export class DeleteOneByIdMemberUsecase {
  constructor(
    private readonly documentRepository: IDocumentRepository<Member>
  ) {}

  /**
   * Deletar uma comunidade
   */
  @Omit(["_id"])
  async execute(id: string): Promise<boolean> {
    return await this.documentRepository.updateOne(
      { id },
      { $set: { deleted_at: new Date(), deleted: true, status: "removed" } }
    );
  }
}
