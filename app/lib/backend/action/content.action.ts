"use server";

import { Content } from "../domain/entity/content.entity";
import { mongoDbClient } from "../infrastructure/client/mongo.client";
import { s3Client } from "../infrastructure/client/s3.client";
import { MongoRepository } from "../infrastructure/repository/mongo.repository";
import { S3Repository } from "../infrastructure/repository/s3.repository";
import { CreateManyContentUsecase } from "../usecase/create-many.content.usecase";

const mongodb = new MongoRepository<Content>(mongoDbClient, "sharp", "content");
const s3Repository = new S3Repository(s3Client, {
  region: process.env.S3_REGION!,
  bucket: process.env.S3_BUCKET_NAME!,
});

const useCase = new CreateManyContentUsecase(mongodb, s3Repository);

export async function createManyContentAction(input: Content[]) {
  return await useCase.execute(input);
}
