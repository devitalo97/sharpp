"use server";

import { Content } from "../domain/entity/content.entity";
import { mongoDbClient } from "../infrastructure/client/mongo.client";
import { s3Client } from "../infrastructure/client/s3.client";
import { MongoRepository } from "../infrastructure/repository/mongo.repository";
import { S3Repository } from "../infrastructure/repository/s3.repository";
import { CreateManyContentUsecase } from "../usecase/create-many.content.usecase";
import { CreateOneContentUsecase } from "../usecase/create-one.content.usecase";
import { FindManyContentUsecase } from "../usecase/find-many.content.usecase";
import { FindOneByIdContentUsecase } from "../usecase/find-one-by-id.content.usecase";
import { UpdateOneContentUsecase } from "../usecase/update-one.content.usecase";

const mongodb = new MongoRepository<Content>(mongoDbClient, "sharp", "content");
const s3Repository = new S3Repository(s3Client, {
  region: process.env.S3_REGION!,
  bucket: process.env.S3_BUCKET_NAME!,
});

const createManyUsecase = new CreateManyContentUsecase(mongodb, s3Repository);
const createOneUsecase = new CreateOneContentUsecase(mongodb, s3Repository);
const updateOneUsecase = new UpdateOneContentUsecase(mongodb, s3Repository);
const findOneByIdUsecase = new FindOneByIdContentUsecase(mongodb);
const findManyUsecase = new FindManyContentUsecase(mongodb);

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
