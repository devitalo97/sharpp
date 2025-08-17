"use server";

import { Member } from "../domain/entity/member.entity";
import { mongoDbClient } from "../infrastructure/client/mongo.client";
import { MongoRepository } from "../infrastructure/repository/mongo.repository";
import { CreateOneMemberUsecase } from "../usecase/create-one.member.usecase";
import { DeleteOneByIdMemberUsecase } from "../usecase/delete-one-by-id.member.usecase";
import { FindManyMemberUsecase } from "../usecase/find-many.member.usecase";
import { FindOneByIdMemberUsecase } from "../usecase/find-one-by-id.member.usecase";
import { UpdateOneMemberUsecase } from "../usecase/update-one.member.usecase";

const mongodb = new MongoRepository<Member>(mongoDbClient, "sharp", "member");

const createOneUsecase = new CreateOneMemberUsecase(mongodb);
const findOneByIdUsecase = new FindOneByIdMemberUsecase(mongodb);
const findManyUsecase = new FindManyMemberUsecase(mongodb);
const updateOneUsecase = new UpdateOneMemberUsecase(mongodb);
const deleteByIdOneUsecase = new DeleteOneByIdMemberUsecase(mongodb);

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
