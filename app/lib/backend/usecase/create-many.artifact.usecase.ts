// app/lib/usecase/create-many.artifact.usecase.ts
import { Buffer } from "buffer";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import {
  GenerateSignedUrlParams,
  IObjectRepository,
  UploadParams,
} from "../domain/repository/object.repository";
import { IDocumentRepository } from "../domain/repository/document.repository";
import { Artifact } from "../domain/artifact.entity";

export class UploadArtifactUsecase {
  constructor(
    private readonly s3Repository: IObjectRepository,
    private readonly documentRepository: IDocumentRepository<Artifact>,
    private readonly concurrency = 5
  ) {}

  /**
   * Agora recebe também um array de metadados paralelo a `files`.
   */
  public async execute(
    files: File[] | ReadonlyArray<File>,
    metadataList: {
      title: string;
      description: string;
      attributes: { key: string; value: string }[];
    }[]
  ): Promise<Artifact[]> {
    const items = Array.from(files).map((file, i) => ({
      file,
      meta: metadataList[i],
    }));
    if (items.length === 0) return [];

    const batches = this.chunk(items, this.concurrency);
    const allArtifacts: Artifact[] = [];

    for (const batch of batches) {
      const artifacts = await Promise.all(
        batch.map(({ file, meta }) => this.processFile(file, meta))
      );
      await this.documentRepository.insertMany(artifacts);
      allArtifacts.push(...artifacts);
    }

    return allArtifacts;
  }

  private chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Agora recebe também o objeto `meta` com title, description e attributes.
   */
  private async processFile(
    file: File,
    meta: {
      title: string;
      description: string;
      attributes: { key: string; value: string }[];
    }
  ): Promise<Artifact> {
    const id = uuidv4();
    const ts = Date.now();
    const key = `artifact/${ts}-${id}-${file.name}`;

    // upload no S3
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = file.type || "application/octet-stream";
    await this.s3Repository.upload({
      key,
      contentType,
      body: buffer,
    } as UploadParams);

    // metadados automáticos
    const metadata: Artifact["metadata"] = {
      size_bytes: file.size,
      content_type: contentType,
    };
    if (contentType.startsWith("image/")) {
      try {
        const info = await sharp(buffer).metadata();
        if (info.width) metadata.width = info.width;
        if (info.height) metadata.height = info.height;
        if (info.format) metadata.format = info.format;
      } catch {
        // sem problema em falhar aqui
      }
    }

    // monta objeto final
    const now = new Date();
    const artifact: Artifact & {
      title: string;
      description: string;
      attributes: { key: string; value: string }[];
    } = {
      id,
      key,
      type: this.determineType(contentType),
      metadata,
      created_at: now,
      updated_at: now,
      // campos vindos do form
      title: meta.title,
      description: meta.description,
      attributes: meta.attributes,
    };

    // gera signed URL
    const signedUrl = await this.s3Repository.generateSignedUrl({
      key,
      expiresInSeconds: 300,
    } as GenerateSignedUrlParams);
    artifact.signed_url = signedUrl;
    artifact.signed_url_expires_at = new Date(Date.now() + 300 * 1000);

    return artifact;
  }

  private determineType(contentType: string): Artifact["type"] {
    if (contentType.startsWith("image/")) return "image";
    if (contentType.startsWith("video/")) return "video";
    if (contentType === "application/pdf") return "pdf";
    return "other";
  }
}
