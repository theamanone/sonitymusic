import { MongoClient, Db, ObjectId } from "mongodb";

const VELIESSA_MONGODB_URI = process.env.MONGODB_URI_VLSA || "";

if (!VELIESSA_MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached: { conn: MongoClient | null; db: Db | null } = { conn: null, db: null };

export async function connectToVeliessaDb(): Promise<Db> {
  if (cached.db) return cached.db;
  if (!cached.conn) {
    cached.conn = await MongoClient.connect(VELIESSA_MONGODB_URI, {});
  }
  cached.db = cached.conn.db(); // default DB from URI
  return cached.db;
}

export async function getVeliessaUserById(userId: string) {
  const db = await connectToVeliessaDb();
  // Only select fields you want to expose
  return db.collection("users").findOne(
    { _id: new ObjectId(userId) },
    { projection: { name: 1, email: 1, image: 1, role: 1 } }
  );
} 