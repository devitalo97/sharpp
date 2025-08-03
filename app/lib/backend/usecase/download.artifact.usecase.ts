// src/domain/usecases/download-artifact.usecase.ts
import { Readable } from "stream";
import path from "path";
import { IDocumentRepository } from "../domain/repository/document.repository";
import { Artifact } from "../domain/artifact.entity";
import { IObjectRepository } from "../domain/repository/object.repository";

export interface DownloadArtifactOutput {
  /** Web ReadableStream para uso em NextResponse */
  stream: ReadableStream;
  /** MIME type do arquivo para Content-Type */
  contentType: string;
  /** Nome do arquivo para Content-Disposition */
  filename: string;
}

export class DownloadArtifactUseCase {
  constructor(
    private artifactRepository: IDocumentRepository<Artifact>,
    private s3Repository: IObjectRepository
  ) {}

  /**
   * Busca o artifact pelo key no MongoDB e retorna um stream preparado para download.
   * @param key Identificador único do artifact (caminho no bucket S3)
   */
  public async execute(key: string): Promise<DownloadArtifactOutput> {
    // 1) Busca metadata do artifact no repositório Mongo
    const artifact = await this.artifactRepository.findOne({ key });
    if (!artifact) {
      throw new Error(`Artifact with key "${key}" not found`);
    }

    // 2) Faz o download do object do S3 retornando Node.js Readable
    const nodeStream = await this.s3Repository.download({ key: artifact.key });

    // 3) Converte Node Readable para Web ReadableStream
    const webStream = Readable.toWeb(nodeStream) as unknown as ReadableStream;

    // 4) Deriva extensão do arquivo e garante que a filename preserve a extensão
    const ext = path.extname(artifact.key) || "";
    const rawName = artifact.title
      ? artifact.title
      : path.basename(artifact.key);
    const filename = rawName.endsWith(ext) ? rawName : `${rawName}${ext}`;

    // 5) Define o content type (fallback octet-stream)
    const contentType = artifact.metadata.content_type;

    return { stream: webStream, filename, contentType };
  }
}
