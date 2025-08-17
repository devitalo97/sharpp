import { type NextRequest, NextResponse } from "next/server";
import { S3Repository } from "@/app/lib/backend/infrastructure/repository/s3.repository";
import { s3Client } from "@/app/lib/backend/infrastructure/client/s3.client";
import { GenerateSignedPutUrlUseCase } from "@/app/lib/backend/usecase/generate-signed-put-url.content.usecase";

const s3Repository = new S3Repository(s3Client, {
  bucket: process.env.S3_BUCKET_NAME!,
  region: process.env.AWS_REGION || "us-east-1",
  defaultPutExpirySec: 900, // 15 minutos
});

const generateSignedPutUrlUseCase = new GenerateSignedPutUrlUseCase(
  s3Repository
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, contentType, metadata } = body;

    // Validações básicas
    if (!key || !contentType) {
      return NextResponse.json(
        { error: "Parâmetros obrigatórios: key, contentType" },
        { status: 400 }
      );
    }

    // Gerar URL pré-assinada
    const signedUrl = await generateSignedPutUrlUseCase.execute({
      key,
      contentType,
      metadata,
      expiresInSeconds: 900, // 15 minutos
    });

    return NextResponse.json({
      signedUrl,
      key,
      expiresIn: 900,
    });
  } catch (error) {
    console.error("Erro ao gerar URL pré-assinada:", error);

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
