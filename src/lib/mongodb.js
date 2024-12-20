
// MONGODB_URI=mongodb://admin:admin@fstudiocluster.tmihq.mongodb.net/FrameStudioData?retryWrites=true&w=majority&appName=FSTUDIOCLUSTER
// MONGODB_DB_NAME=FrameStudioData




import { MongoClient } from "mongodb";

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  console.log("Initializing MongoDB Client...");
  try {
    client = new MongoClient(process.env.MONGODB_URI, {
      useUnifiedTopology: true,
    });
    clientPromise = client.connect();
    global._mongoClientPromise = clientPromise;
  } catch (error) {
    console.error("MongoDB Initialization Error:", error);
  }
} else {
  clientPromise = global._mongoClientPromise;
}

export async function connectToDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME);
    console.log("Successfully connected to MongoDB.");
    return { db, client };
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}
