// src/lib/s3-repository.ts
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { Readable } from "stream";
import {
  DownloadParams,
  GenerateSignedDownloadUrlParams,
  GenerateSignedGetUrlParams,
  IObjectRepository,
  UploadParams,
} from "../../domain/repository/object.repository";

type S3RepositoryConfig = {
  bucket: string;
  region: string;
  cdnBaseUrl?: string;
  defaultGetExpirySec?: number;
  defaultPutExpirySec?: number;
  forcePublicUrl?: boolean;
};

export class S3Repository implements IObjectRepository {
  constructor(
    private readonly client: S3Client,
    private readonly cfg: S3RepositoryConfig
  ) {}

  /** Upload direto do servidor */
  public async upload({ key, contentType, body }: UploadParams): Promise<void> {
    validateS3Key(key);
    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.cfg.bucket,
          Key: key,
          Body: body,
          ContentType: contentType,
          CacheControl: "private, max-age=0, no-cache",
        })
      );
    } catch (err: unknown) {
      logS3Error("PUT", key, err);
      throw S3RepositoryError.wrap("PUT", key, err);
    }
  }

  /** URL pré-assinada para VISUALIZAÇÃO (GET) */
  public async generateSignedGetUrl({
    key,
    expiresInSeconds = this.cfg.defaultGetExpirySec ?? 300,
  }: GenerateSignedGetUrlParams): Promise<string> {
    validateS3Key(key);
    try {
      const cmd = new GetObjectCommand({ Bucket: this.cfg.bucket, Key: key });
      return await getSignedUrl(this.client, cmd, {
        expiresIn: expiresInSeconds,
      });
    } catch (err: unknown) {
      logS3Error("SIGN_GET", key, err);
      throw S3RepositoryError.wrap("SIGN_GET", key, err);
    }
  }

  /** URL pré-assinada para DOWNLOAD (GET com attachment) */
  public async generateSignedDownloadUrl({
    key,
    filename,
    contentType,
    expiresInSeconds = this.cfg.defaultGetExpirySec ?? 300,
  }: GenerateSignedDownloadUrlParams): Promise<string> {
    validateS3Key(key);

    // RFC 5987 (suporte melhor a UTF-8)
    const filenameStar = encodeURIComponent(filename);

    // Preferência: alguns browsers honram filename*, outros filename
    const contentDisposition = `attachment; filename="${filename}"; filename*=UTF-8''${filenameStar}`;

    try {
      const cmd = new GetObjectCommand({
        Bucket: this.cfg.bucket,
        Key: key,
        // Força comportamento de download no navegador
        ResponseContentDisposition: contentDisposition,
        // Opcionalmente sugere o content-type (se não passar, usa o do objeto)
        ...(contentType ? { ResponseContentType: contentType } : {}),
      });

      return await getSignedUrl(this.client, cmd, {
        expiresIn: expiresInSeconds,
      });
    } catch (err: unknown) {
      logS3Error("SIGN_GET_DOWNLOAD", key, err);
      throw S3RepositoryError.wrap("SIGN_GET_DOWNLOAD", key, err);
    }
  }

  /** URL pré-assinada para UPLOAD (PUT) */
  public async generateSignedPutUrl(input: {
    key: string;
    contentType: string;
    contentLength: number;
    expiresInSeconds?: number;
  }): Promise<string> {
    const { key, contentType, contentLength } = input;
    validateS3Key(key);
    validateContentLength(contentLength);

    const putParams: PutObjectCommandInput = {
      Bucket: this.cfg.bucket,
      Key: key,
      ContentType: contentType,
    };

    try {
      const cmd = new PutObjectCommand(putParams);
      const expiresIn =
        input.expiresInSeconds ?? this.cfg.defaultPutExpirySec ?? 900;
      return await getSignedUrl(this.client, cmd, { expiresIn });
    } catch (err: unknown) {
      logS3Error("SIGN_PUT", key, err);
      throw S3RepositoryError.wrap("SIGN_PUT", key, err);
    }
  }

  /** Download stream + metadados */
  public async download({ key }: DownloadParams): Promise<{
    stream: Readable;
    contentType?: string;
    contentLength?: number;
  }> {
    validateS3Key(key);
    try {
      const { Body, ContentType, ContentLength } = await this.client.send(
        new GetObjectCommand({ Bucket: this.cfg.bucket, Key: key })
      );
      return {
        stream: Body as Readable,
        contentType: ContentType,
        contentLength: ContentLength,
      };
    } catch (err: unknown) {
      logS3Error("GET", key, err);
      throw S3RepositoryError.wrap("GET", key, err);
    }
  }

  /** URL “pública” (somente se bucket/CDN público) */
  public getPublicUrl(key: string): string {
    validateS3Key(key);
    if (this.cfg.cdnBaseUrl) {
      if (!this.cfg.forcePublicUrl) {
        // Alerta para uso seguro
        console.warn(
          `[S3Repository] getPublicUrl chamado sem forcePublicUrl para cdnBaseUrl configurado. Garanta que seu bucket/CDN seja realmente público!`
        );
      }
      return `${this.cfg.cdnBaseUrl.replace(/\/$/, "")}/${encodeURI(key)}`;
    }
    if (!this.cfg.forcePublicUrl) {
      throw new S3RepositoryError(
        "getPublicUrl indisponível: configure cdnBaseUrl ou forcePublicUrl=true apenas para buckets públicos.",
        "PUBLIC_URL"
      );
    }
    return `https://${this.cfg.bucket}.s3.${
      this.cfg.region
    }.amazonaws.com/${encodeURI(key)}`;
  }
}

// ===== helpers =====

class S3RepositoryError extends Error {
  public readonly op: string;
  public readonly requestId?: string;

  constructor(message: string, op: string, requestId?: string) {
    super(message);
    this.op = op;
    this.requestId = requestId;
    Object.setPrototypeOf(this, S3RepositoryError.prototype);
  }

  static wrap(op: string, key: string, err: unknown) {
    if (err && typeof err === "object") {
      const e = err as {
        name?: string;
        message?: string;
        Code?: string;
        $metadata?: { requestId?: string };
      };
      const code = e.name || e.Code || "S3Error";
      const msg = e.message || String(err);
      const extra = e.$metadata
        ? ` (requestId: ${e.$metadata.requestId ?? "?"})`
        : "";
      return new S3RepositoryError(
        `[S3:${op}] key=${key} code=${code} msg=${msg}${extra}`,
        op,
        e.$metadata?.requestId
      );
    }
    return new S3RepositoryError(
      `[S3:${op}] key=${key} code=S3Error msg=${String(err)}`,
      op
    );
  }
}

function validateS3Key(key: string) {
  if (!key || key.length > 1024 || /(^\.{1,2}\/|\/\.{1,2}\/)/.test(key)) {
    throw new S3RepositoryError(`Chave S3 inválida: ${key}`, "VALIDATION");
  }
}
function validateContentLength(len: number) {
  const maxLen = 512 * 1024 * 1024; // 512MB, ajuste conforme necessidade
  if (len < 0 || len > maxLen) {
    throw new S3RepositoryError(
      `Tamanho de conteúdo inválido: ${len}`,
      "VALIDATION"
    );
  }
}
function logS3Error(op: string, key: string, err: unknown) {
  // Use logging framework da sua stack, aqui só console.error
  console.error(`[S3Repository][${op}] Erro na chave=${key}:`, err);
}
