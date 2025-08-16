"use server";

import { Community } from "../domain/entity/community.entity";
import { mongoDbClient } from "../infrastructure/client/mongo.client";
import { MongoRepository } from "../infrastructure/repository/mongo.repository";
import { CreateOneCommunityUsecase } from "../usecase/create-one.community.usecase";
import { FindManyCommunityUsecase } from "../usecase/find-many.community.usecase";
import { FindOneByIdCommunityUsecase } from "../usecase/find-one-by-id.community.usecase";

const mongodb = new MongoRepository<Community>(
  mongoDbClient,
  "sharp",
  "community"
);

const createOneUsecase = new CreateOneCommunityUsecase(mongodb);
const findOneByIdUsecase = new FindOneByIdCommunityUsecase(mongodb);
const findManyUsecase = new FindManyCommunityUsecase(mongodb);

export async function createOneCommunityAction(input: Community) {
  return await createOneUsecase.execute(input);
}

export async function findOneByIdCommunityAction(id: string) {
  return await findOneByIdUsecase.execute(id);
}

export async function findManyCommunityAction(input: Partial<Community>) {
  return await findManyUsecase.execute(input);
}
