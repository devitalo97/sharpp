"use server";

import { Member } from "../domain/entity/member.entity";
import { mongoDbClient } from "../infrastructure/client/mongo.client";
import { MongoRepository } from "../infrastructure/repository/mongo.repository";
import { CreateOneMemberUsecase } from "../usecase/create-one.member.usecase";
import { DeleteOneByIdMemberUsecase } from "../usecase/delete-one-by-id.member.usecase";
import { FindManyMemberUsecase } from "../usecase/find-many.member.usecase";
import { FindOneByIdMemberUsecase } from "../usecase/find-one-by-id.member.usecase";
import { UpdateOneMemberUsecase } from "../usecase/update-one.member.usecase";

const documentRepository = new MongoRepository<Member>(
  mongoDbClient,
  process.env.MONGODB_DB_NAME!,
  "member"
);

const createOneUsecase = new CreateOneMemberUsecase(documentRepository);
const findOneByIdUsecase = new FindOneByIdMemberUsecase(documentRepository);
const findManyUsecase = new FindManyMemberUsecase(documentRepository);
const updateOneUsecase = new UpdateOneMemberUsecase(documentRepository);
const deleteByIdOneUsecase = new DeleteOneByIdMemberUsecase(documentRepository);

export async function createOneMemberAction(input: Member) {
  return await createOneUsecase.execute(input);
}

export async function findOneByIdMemberAction(id: string) {
  return await findOneByIdUsecase.execute(id);
}

export async function findManyMemberAction(input: Partial<Member>) {
  return await findManyUsecase.execute(input);
}

export async function updateOneMemberAction(
  id: string,
  input: Partial<Member>
) {
  return await updateOneUsecase.execute(id, input);
}

export async function deleteOneByIdMemberAction(id: string) {
  return await deleteByIdOneUsecase.execute(id);
}
