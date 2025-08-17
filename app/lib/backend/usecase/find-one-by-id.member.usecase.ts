import { Omit } from "../../decorator/omit";
import { Member } from "../domain/entity/member.entity";
import { IDocumentRepository } from "../domain/repository/document.repository";

export class FindOneByIdMemberUsecase {
  constructor(
    private readonly documentRepository: IDocumentRepository<Member>
  ) {}

  /**
   * Pesquisa por um membro a partir do id.
   */
  @Omit(["_id"])
  async execute(id: string): Promise<Member | null> {
    return await this.documentRepository.findOne({ id });
  }
}
