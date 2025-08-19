// app/api/artifact/download/route.ts
import { Content } from "@/app/lib/backend/domain/entity/content.entity";
import { mongoDbClient } from "@/app/lib/backend/infrastructure/client/mongo.client";
import { s3Client } from "@/app/lib/backend/infrastructure/client/s3.client";
import { MongoRepository } from "@/app/lib/backend/infrastructure/repository/mongo.repository";
import { S3Repository } from "@/app/lib/backend/infrastructure/repository/s3.repository";
import { DownloadOneMediaUseCase } from "@/app/lib/backend/usecase/download.media.usecase";
import { NextRequest, NextResponse } from "next/server";

// instâncias dos repositórios
const documentRepository = new MongoRepository<Content>(
  mongoDbClient,
  process.env.MONGODB_DB_NAME!,
  "content"
);
const objectRepository = new S3Repository(s3Client, {
  region: process.env.S3_REGION!,
  bucket: process.env.S3_BUCKET_NAME!,
});
const downloadUseCase = new DownloadOneMediaUseCase(
  documentRepository,
  objectRepository
);

export async function GET(req: NextRequest) {
  const content_id = req.nextUrl.searchParams.get("content_id");
  const media_id = req.nextUrl.searchParams.get("media_id");
  if (!content_id) {
    return NextResponse.json(
      { error: "Missing 'content_id'" },
      { status: 400 }
    );
  }
  if (!media_id) {
    return NextResponse.json({ error: "Missing 'media_id'" }, { status: 400 });
  }

  try {
    const { stream, filename, contentType } = await downloadUseCase.execute({
      content_id,
      media_id,
    });

    return new NextResponse(stream, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename=\"${filename}\"`,
        "Content-Type": contentType,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro desconhecido" },
      { status: 404 }
    );
  }
}
