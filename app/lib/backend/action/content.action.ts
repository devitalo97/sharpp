"use server";

import { Content } from "../domain/entity/content.entity";
import { mongoDbClient } from "../infrastructure/client/mongo.client";
import { s3Client } from "../infrastructure/client/s3.client";
import { MongoRepository } from "../infrastructure/repository/mongo.repository";
import { S3Repository } from "../infrastructure/repository/s3.repository";
import { CreateManyContentUsecase } from "../usecase/create-many.content.usecase";
import { CreateOneContentUsecase } from "../usecase/create-one.content.usecase";
import { DownloadOneMediaUseCase } from "../usecase/download.media.usecase";
import { FindManyContentUsecase } from "../usecase/find-many.content.usecase";
import { FindOneByIdContentUsecase } from "../usecase/find-one-by-id.content.usecase";
import { UpdateOneContentUsecase } from "../usecase/update-one.content.usecase";

const documentRepository = new MongoRepository<Content>(
  mongoDbClient,
  process.env.MONGODB_DB_NAME!,
  "content"
);
const objectRepository = new S3Repository(s3Client, {
  region: process.env.S3_REGION!,
  bucket: process.env.S3_BUCKET_NAME!,
});

const createManyUsecase = new CreateManyContentUsecase(
  documentRepository,
  objectRepository
);
const createOneUsecase = new CreateOneContentUsecase(
  documentRepository,
  objectRepository
);
const updateOneUsecase = new UpdateOneContentUsecase(
  documentRepository,
  objectRepository
);
const findOneByIdUsecase = new FindOneByIdContentUsecase(documentRepository);
const findManyUsecase = new FindManyContentUsecase(documentRepository);
const downloadOneMediaUsecase = new DownloadOneMediaUseCase(
  documentRepository,
  objectRepository
);

export async function createManyContentAction(input: Content[]) {
  return await createManyUsecase.execute(input);
}

export async function createOneContentAction(input: Content) {
  return await createOneUsecase.execute(input);
}

export async function updateOneContentAction(
  id: string,
  input: Partial<Content>
) {
  return await updateOneUsecase.execute(id, input);
}

export async function findOneByIdContentAction(id: string) {
  return await findOneByIdUsecase.execute(id);
}

export async function findManyContentAction(input: Partial<Content>) {
  return await findManyUsecase.execute(input);
}

export async function downloadOneMediaAction(input: {
  content_id: string;
  media_id: string;
}) {
  return await downloadOneMediaUsecase.execute(input);
}
