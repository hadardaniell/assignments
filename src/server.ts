// src/server.ts
import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import { connectToMongo } from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("API is alive (TS + Mongoose)");
});

async function startServer() {
  await connectToMongo();

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
