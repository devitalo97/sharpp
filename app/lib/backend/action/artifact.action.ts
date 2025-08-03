// app/actions/uploadArtifactAction.ts
"use server";

import { Artifact } from "../domain/artifact.entity";
import { mongoDbClient } from "../infrastructure/client/mongo.client";
import { s3Client } from "../infrastructure/client/s3.client";
import { MongoRepository } from "../infrastructure/repository/mongo.repository";
import { S3Repository } from "../infrastructure/repository/s3.repository";
import { UploadArtifactUsecase } from "../usecase/create-many.artifact.usecase";
import { FindManyArtifactUsecase } from "../usecase/find-many.artifact.usecase";

////////////////////////////////////////////////////////////////////////////////
// Server Action: upload de múltiplos arquivos
////////////////////////////////////////////////////////////////////////////////
export async function uploadArtifactAction(
  formData: FormData
): Promise<Artifact[]> {
  // pega apenas os arquivos
  const files = (formData.getAll("files") as unknown as File[]).filter(
    (f): f is File => f instanceof File
  );
  if (files.length === 0) return [];

  // inicializa array de metadados com tamanho igual a files.length
  const metadataList: {
    title: string;
    description: string;
    attributes: { key: string; value: string }[];
    tags: string[];
  }[] = files.map(() => ({
    title: "",
    description: "",
    attributes: [],
    tags: [],
  }));

  // percorre todos os pares [chave, valor] do FormData
  for (const [key, value] of formData.entries()) {
    let match: RegExpExecArray | null;

    if ((match = /^titles\[(\d+)\]$/.exec(key))) {
      const idx = Number(match[1]);
      metadataList[idx].title = value as string;
    }

    if ((match = /^descriptions\[(\d+)\]$/.exec(key))) {
      const idx = Number(match[1]);
      metadataList[idx].description = value as string;
    }

    if ((match = /^attributes\[(\d+)\]$/.exec(key))) {
      const idx = Number(match[1]);
      metadataList[idx].attributes = JSON.parse(value as string);
    }

    if ((match = /^tags\[(\d+)\]$/.exec(key))) {
      const idx = Number(match[1]);
      metadataList[idx].tags = JSON.parse(value as string);
    }
  }

  // monta repositórios
  const mongoRepo = new MongoRepository<Artifact>(
    mongoDbClient,
    process.env.MONGODB_DB_NAME!,
    "artifact"
  );
  const s3Repo = new S3Repository(s3Client, process.env.S3_BUCKET_NAME!);

  const uploadUsecase = new UploadArtifactUsecase(s3Repo, mongoRepo, 5);

  // executa agora passando arquivos + metadados
  return uploadUsecase.execute(files, metadataList);
}

////////////////////////////////////////////////////////////////////////////////
// Server Action: busca todos os artifacts
////////////////////////////////////////////////////////////////////////////////
export async function findManyArtifactAction(): Promise<Artifact[]> {
  // Repositório Mongo (singleton já conectado)
  const mongoRepo = new MongoRepository<Artifact>(
    mongoDbClient,
    process.env.MONGODB_DB_NAME!,
    "artifact"
  );

  // Usecase de leitura em lote
  const findUsecase = new FindManyArtifactUsecase(mongoRepo);

  // Executa busca (já ordena internamente)
  return findUsecase.execute();
}
