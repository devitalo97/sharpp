// src/infrastructure/client/mongo.client.ts
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = { appName: "devrel.template.nextjs" };

let mongoDbClient: MongoClient;

if (process.env.NODE_ENV === "development") {
  // Em dev, manter o mesmo client no HMR
  const globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient;
  };

  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options);
    // Conecta imediatamente
    globalWithMongo._mongoClient.connect().catch((err) => {
      console.error("MongoDB connection error:", err);
    });
  }
  mongoDbClient = globalWithMongo._mongoClient;
} else {
  // Em produção, cria e conecta uma vez
  mongoDbClient = new MongoClient(uri, options);
  mongoDbClient.connect().catch((err) => {
    console.error("MongoDB connection error:", err);
  });
}

export { mongoDbClient };
