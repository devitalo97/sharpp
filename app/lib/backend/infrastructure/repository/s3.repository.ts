// src/lib/s3-repository.ts
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { Readable } from "stream";
import {
  DownloadParams,
  GenerateSignedUrlParams,
  IObjectRepository,
  UploadParams,
} from "../../domain/repository/object.repository";

export class S3Repository implements IObjectRepository {
  constructor(
    private readonly client: S3Client,
    private readonly bucket: string
  ) {}

  public async upload({ key, contentType, body }: UploadParams): Promise<void> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      })
    );
  }

  public generateSignedUrl({
    key,
    expiresInSeconds = 300,
  }: GenerateSignedUrlParams): Promise<string> {
    const cmd = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    return getSignedUrl(this.client, cmd, {
      expiresIn: expiresInSeconds,
    });
  }

  public async download({ key }: DownloadParams): Promise<Readable> {
    const { Body } = await this.client.send(
      new GetObjectCommand({ Bucket: this.bucket, Key: key })
    );
    return Body as Readable;
  }

  public getPublicUrl(key: string): string {
    return `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }
}
