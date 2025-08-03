// src/lib/mongo-repository.ts
import {
  MongoClient,
  Collection,
  Filter,
  UpdateFilter,
  WithId,
  OptionalUnlessRequiredId,
} from "mongodb";
import { IDocumentRepository } from "../../domain/repository/document.repository";

export class MongoRepository<T extends object>
  implements IDocumentRepository<T>
{
  public readonly collection: Collection<T>;

  constructor(
    client: MongoClient,
    private readonly dbName: string,
    private readonly collectionName: string
  ) {
    this.collection = client.db(this.dbName).collection<T>(this.collectionName);
  }

  /**
   * Remove o `_id` interno antes de devolver a entidade genérica T
   */
  private stripId(doc: WithId<T>): T {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...rest } = doc;
    return rest as unknown as T;
  }

  /** Insere o item (sem `_id`) e devolve o próprio modelo. */
  public async create(item: T): Promise<T> {
    // OptionalUnlessRequiredId<TSchema> = TModel | TSchema
    const doc = item as OptionalUnlessRequiredId<T>;
    await this.collection.insertOne(doc);
    return item;
  }
  public async findOne(filter: Filter<T>): Promise<T | null> {
    const doc = await this.collection.findOne(filter);
    return doc === null ? null : this.stripId(doc);
  }

  public async findMany(filter: Filter<T>): Promise<T[]> {
    const docs = await this.collection.find(filter).toArray();
    return docs.map((d) => this.stripId(d));
  }

  public async updateOne(
    filter: Filter<T>,
    update: UpdateFilter<T>
  ): Promise<boolean> {
    const result = await this.collection.updateOne(filter, update);
    return result.modifiedCount > 0;
  }

  public async deleteOne(filter: Filter<T>): Promise<boolean> {
    const result = await this.collection.deleteOne(filter);
    return result.deletedCount > 0;
  }

  /**
   * Insere múltiplos itens (sem `_id`) e devolve os próprios modelos.
   */
  public async insertMany(items: T[]): Promise<T[]> {
    // Converte para o tipo aceito pelo Mongo (OptionalUnlessRequiredId<T>)
    const docs = items as OptionalUnlessRequiredId<T>[];
    await this.collection.insertMany(docs);
    return items;
  }
}
