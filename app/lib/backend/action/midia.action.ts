"use server";

import { s3Client } from "../infrastructure/client/s3.client";
import { S3Repository } from "../infrastructure/repository/s3.repository";
import { GenerateSignedPutUrlUseCase } from "../usecase/generate-signed-put-url.usecase";

const s3Repository = new S3Repository(s3Client, {
  region: process.env.S3_REGION!,
  bucket: process.env.S3_BUCKET_NAME!,
});

const useCase = new GenerateSignedPutUrlUseCase(s3Repository);

export async function generateSignedPutUrl() {
  const signedPutUrl = await useCase.execute({
    key: "uploads/meuarquivo.jpg",
    contentType: "image/jpeg",
    contentLength: 123456,
    expiresInSeconds: 600, // opcional
    metadata: { usuario: "123" },
  });
}
