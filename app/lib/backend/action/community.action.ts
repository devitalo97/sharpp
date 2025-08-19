"use server";

import { Community } from "../domain/entity/community.entity";
import { mongoDbClient } from "../infrastructure/client/mongo.client";
import { MongoRepository } from "../infrastructure/repository/mongo.repository";
import { CreateOneCommunityUsecase } from "../usecase/create-one.community.usecase";
import { DeleteOneByIdCommunityUsecase } from "../usecase/delete-one-by-id.community.usecase";
import { FindManyCommunityUsecase } from "../usecase/find-many.community.usecase";
import { FindOneByIdCommunityUsecase } from "../usecase/find-one-by-id.community.usecase";
import { UpdateOneCommunityUsecase } from "../usecase/update-one.community.usecase";

const documentRepository = new MongoRepository<Community>(
  mongoDbClient,
  process.env.MONGODB_DB_NAME!,
  "community"
);

const createOneUsecase = new CreateOneCommunityUsecase(documentRepository);
const findOneByIdUsecase = new FindOneByIdCommunityUsecase(documentRepository);
const findManyUsecase = new FindManyCommunityUsecase(documentRepository);
const updateOneUsecase = new UpdateOneCommunityUsecase(documentRepository);
const deleteByIdOneUsecase = new DeleteOneByIdCommunityUsecase(
  documentRepository
);
export async function createOneCommunityAction(input: Community) {
  return await createOneUsecase.execute(input);
}

export async function findOneByIdCommunityAction(id: string) {
  return await findOneByIdUsecase.execute(id);
}

export async function findManyCommunityAction(input: Partial<Community>) {
  return await findManyUsecase.execute(input);
}

export async function updateOneCommunityAction(
  id: string,
  input: Partial<Community>
) {
  return await updateOneUsecase.execute(id, input);
}

export async function deleteOneByIdCommunityAction(id: string) {
  return await deleteByIdOneUsecase.execute(id);
}
