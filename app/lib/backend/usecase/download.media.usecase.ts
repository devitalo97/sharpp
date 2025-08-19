import { Readable } from "stream";
import { IDocumentRepository } from "../domain/repository/document.repository";
import { IObjectRepository } from "../domain/repository/object.repository";
import { Content } from "../domain/entity/content.entity";

interface Input {
  content_id: string;
  media_id: string;
}

interface Output {
  /** Web ReadableStream para uso em NextResponse */
  stream: ReadableStream;
  /** MIME type do arquivo para Content-Type */
  contentType: string;
  /** Nome do arquivo para Content-Disposition */
  filename: string;
}

export class DownloadOneMediaUseCase {
  constructor(
    private documentRepository: IDocumentRepository<Content>,
    private objectRepository: IObjectRepository
  ) {}

  /**
   * Busca o media pelo key no MongoDB e retorna um stream preparado para download.
   * @param key Identificador único do media (caminho no bucket S3)
   */
  public async execute(input: Input): Promise<Output> {
    const { content_id, media_id } = input;

    const content = await this.documentRepository.findOne({ id: content_id });
    if (!content) {
      throw new Error(`Content with id "${content_id}" not found`);
    }

    const media = content.medias.find((m) => m.id === media_id);
    if (!media) {
      throw new Error(`Media with id "${content_id}" not found`);
    }

    const { stream: nodeStream } = await this.objectRepository.download({
      key: media.storage.key,
    });

    const webStream = Readable.toWeb(nodeStream) as unknown as ReadableStream;

    const filename = `${media.name}.${media.ext}`;

    const contentType = media.type;

    return { stream: webStream, filename, contentType };
  }
}
