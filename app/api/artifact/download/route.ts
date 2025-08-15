// app/api/artifact/download/route.ts
import { Artifact } from "@/app/lib/backend/domain/entity/artifact.entity";
import { mongoDbClient } from "@/app/lib/backend/infrastructure/client/mongo.client";
import { s3Client } from "@/app/lib/backend/infrastructure/client/s3.client";
import { MongoRepository } from "@/app/lib/backend/infrastructure/repository/mongo.repository";
import { S3Repository } from "@/app/lib/backend/infrastructure/repository/s3.repository";
import { DownloadArtifactUseCase } from "@/app/lib/backend/usecase/download.artifact.usecase";
import { NextRequest, NextResponse } from "next/server";

// instâncias dos repositórios
const artifactRepo = new MongoRepository<Artifact>(
  mongoDbClient,
  process.env.MONGODB_DB_NAME!,
  "artifact"
);
const s3Repo = new S3Repository(s3Client, process.env.S3_BUCKET_NAME!);
const downloadUseCase = new DownloadArtifactUseCase(artifactRepo, s3Repo);

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!key) {
    return NextResponse.json({ error: "Missing 'key'" }, { status: 400 });
  }

  try {
    const { stream, filename, contentType } = await downloadUseCase.execute(
      key
    );
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
