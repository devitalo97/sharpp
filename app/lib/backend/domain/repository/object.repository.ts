// src/lib/object-repository.ts
import type { Readable } from "stream";

export interface UploadParams {
  key: string;
  contentType: string;
  body: Buffer | Readable | ReadableStream<Uint8Array>;
}

export interface GenerateSignedUrlParams {
  key: string;
  /** Tempo de expiração em segundos (padrão: 300) */
  expiresInSeconds?: number;
}

export interface DownloadParams {
  key: string;
}

export interface IObjectRepository {
  /**
   * Faz o upload de um objeto
   */
  upload(params: UploadParams): Promise<void>;

  /**
   * Gera uma URL assinada para download
   */
  generateSignedUrl(params: GenerateSignedUrlParams): Promise<string>;

  /**
   * Retorna um Readable stream para o objeto
   */
  download(params: DownloadParams): Promise<Readable>;

  /**
   * Retorna a URL pública (sem assinatura) para acesso direto
   */
  getPublicUrl(key: string): string;
}
