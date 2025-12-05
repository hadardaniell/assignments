import express, { type Request, type Response } from "express";
import mongoose from "mongoose";
import Post, { RecipeModel } from "../models/recpies.model.js";

const router = express.Router();

// POST a new recipe
router.post('/', async (req, res) => {
  try {
    const recipe = new RecipeModel(req.body);
    await recipe.save();
    res.status(201).json(recipe);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: errorMessage });
    console.error("Error creating recipe:", err);
  }
});


export default router;
