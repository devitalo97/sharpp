// src/lib/object-repository.ts
import type { Readable } from "stream";

export interface UploadParams {
  key: string;
  contentType: string;
  body: Buffer | Readable | ReadableStream<Uint8Array>;
}

export interface GenerateSignedGetUrlParams {
  key: string;
  /** Tempo de expiração em segundos (padrão: 300) */
  expiresInSeconds?: number;
}

export interface GenerateSignedPutUrlParams {
  key: string;
  contentType: string;
  expiresInSeconds?: number;
}

export interface DownloadParams {
  key: string;
}

export interface DownloadResult {
  stream: Readable;
  contentType?: string;
  contentLength?: number;
}

// supondo que seu domínio ainda não tenha:
export type GenerateSignedDownloadUrlParams = {
  key: string;
  filename: string;
  contentType?: string;
  expiresInSeconds?: number;
};

export interface IObjectRepository {
  /**
   * Faz o upload direto do objeto (servidor para S3)
   */
  upload(params: UploadParams): Promise<void>;

  /**
   * Gera uma URL assinada para visualização (GET)
   */
  generateSignedGetUrl(params: GenerateSignedGetUrlParams): Promise<string>;

  /**
   * Gera uma URL assinada para upload (PUT)
   */
  generateSignedPutUrl(params: GenerateSignedPutUrlParams): Promise<string>;

  /**
   * Gera uma URL assinada para download (GET)
   */
  generateSignedDownloadUrl(
    params: GenerateSignedDownloadUrlParams
  ): Promise<string>;

  /**
   * Retorna um Readable stream para o objeto e seus metadados básicos
   */
  download(params: DownloadParams): Promise<DownloadResult>;

  /**
   * Retorna a URL pública (sem assinatura) para acesso direto
   */
  getPublicUrl(key: string): string;
}
