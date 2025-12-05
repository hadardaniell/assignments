// src/db.ts
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI ?? '';

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in .env");
}

export async function connectToMongo() {
  try {
    await mongoose.connect(MONGO_URI); // בלי אופציות ישנות
    console.log("Connected to MongoDB");

    mongoose.connection.once("open", () => {
      console.log("MongoDB connection is open ✅");
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error", err);
    });

  } catch (err) {
    console.error("MongoDB connection failed:", err);
    throw err;
  }
}
