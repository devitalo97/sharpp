import { Omit } from "../../decorator/omit";
import { Member } from "../domain/entity/member.entity";
import { IDocumentRepository } from "../domain/repository/document.repository";

export class CreateOneMemberUsecase {
  constructor(
    private readonly documentRepository: IDocumentRepository<Member>
  ) {}

  /**
   * Criar membro em uma comunidade.
   */
  @Omit(["_id"])
  async execute(input: Member): Promise<Member> {
    const created = await this.documentRepository.insertOne(input);

    return created;
  }
}
