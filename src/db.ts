// src/db.ts
import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI as string;
const dbName = process.env.DB_NAME;

if (!uri) {
  throw new Error("MONGODB_URI is not defined in .env");
}

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToMongo(): Promise<Db> {
  if (db) return db;

  client = new MongoClient(uri);
  await client.connect();
  console.log("Connected to MongoDB");

  db = client.db(dbName);
  return db;
}

export function getDb(): Db {
  if (!db) {
    throw new Error("DB not initialized! Call connectToMongo() first.");
  }
  return db;
}
