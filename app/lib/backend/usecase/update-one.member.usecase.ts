import { Omit } from "../../decorator/omit";
import { Member } from "../domain/entity/member.entity";
import { IDocumentRepository } from "../domain/repository/document.repository";

export class UpdateOneMemberUsecase {
  constructor(
    private readonly documentRepository: IDocumentRepository<Member>
  ) {}

  /**
   * Atualiza um membro da comunidade
   */
  @Omit(["_id"])
  async execute(id: string, input: Partial<Member>): Promise<Partial<Member>> {
    await this.documentRepository.updateOne({ id }, { $set: input });

    return input;
  }
}
