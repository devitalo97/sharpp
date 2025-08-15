// src/usecase/find-many-artifact.usecase.ts

import type { IDocumentRepository } from "../domain/repository/document.repository";
import type { Artifact } from "../domain/entity/artifact.entity";

/**
 * Caso de uso para buscar múltiplos Artifacts.
 */
export class FindManyArtifactUsecase {
  constructor(
    private readonly documentRepository: IDocumentRepository<Artifact>
  ) {}

  /**
   * Executa a busca de todos os artifacts, ordenando do mais recente ao mais antigo.
   * @returns Array de Artifact
   */
  public async execute(): Promise<Artifact[]> {
    // Busca sem filtro (retorna todos)
    const artifacts = await this.documentRepository.findMany({});

    // Ordena por created_at decrescente
    return artifacts.sort(
      (a, b) => b.created_at.getTime() - a.created_at.getTime()
    );
  }
}
