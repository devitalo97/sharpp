import { Filter, UpdateFilter } from "mongodb";

export interface IDocumentRepository<T extends object = object> {
  create(item: T): Promise<T>;
  findOne(filter: Filter<T>): Promise<T | null>;
  findMany(filter: Filter<T>): Promise<T[]>;
  updateOne(filter: Filter<T>, update: UpdateFilter<T>): Promise<boolean>;
  deleteOne(filter: Filter<T>): Promise<boolean>;
  insertMany(items: T[]): Promise<T[]>;
  insertOne(item: T): Promise<T>;
}
