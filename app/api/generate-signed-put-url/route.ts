import { type NextRequest, NextResponse } from "next/server";
import { S3Repository } from "@/app/lib/backend/infrastructure/repository/s3.repository";
import { s3Client } from "@/app/lib/backend/infrastructure/client/s3.client";
import { GenerateSignedPutUrlUseCase } from "@/app/lib/backend/usecase/generate-signed-put-url.content.usecase";

const objectRepository = new S3Repository(s3Client, {
  region: process.env.S3_REGION!,
  bucket: process.env.S3_BUCKET_NAME!,
  defaultPutExpirySec: 900, // 15 minutos
});

const generateSignedPutUrlUseCase = new GenerateSignedPutUrlUseCase(
  objectRepository
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, contentType } = body;

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
