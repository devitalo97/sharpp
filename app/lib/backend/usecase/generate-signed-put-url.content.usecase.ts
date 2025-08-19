import { IObjectRepository } from "../domain/repository/object.repository";

export interface GenerateSignedPutUrlInput {
  key: string;
  contentType: string;
  expiresInSeconds?: number;
}

export class GenerateSignedPutUrlUseCase {
  constructor(private readonly objectRepository: IObjectRepository) {}

  async execute(input: GenerateSignedPutUrlInput): Promise<string> {
    // Passa os dados para a gateway gerar a URL assinada para upload
    const signedUrl = await this.objectRepository.generateSignedPutUrl({
      key: input.key,
      contentType: input.contentType,
      expiresInSeconds: input.expiresInSeconds,
    });

    return signedUrl;
  }
}
