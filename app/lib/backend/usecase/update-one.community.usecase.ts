import { Omit } from "../../decorator/omit";
import { Community } from "../domain/entity/community.entity";
import { IDocumentRepository } from "../domain/repository/document.repository";

export class UpdateOneCommunityUsecase {
  constructor(
    private readonly documentRepository: IDocumentRepository<Community>
  ) {}

  /**
   * Atualiza uma comunidade
   */
  @Omit(["_id"])
  async execute(
    id: string,
    input: Partial<Community>
  ): Promise<Partial<Community>> {
    if (!input) {
      throw new Error("Parâmetro inválido: esperado um objeto de Community.");
    }

    await this.documentRepository.updateOne({ id }, { $set: input });

    return input;
  }
}
