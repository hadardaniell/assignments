// src/server.ts
import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import { connectToMongo } from "./db.js";

import recipesRouter from "./routes/recpies.routes.js"; // תקן את הנתיב אם צריך

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// קודם רישום ה-router
app.use("/recipes", recipesRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("API is alive (TS + Mongoose)");
});

async function startServer() {
  await connectToMongo(); // ודאי שהחיבור פעיל לפני האזנה

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
