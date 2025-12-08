import express, { Request, Response } from "express";
import Post, { RecipeModel } from "../models/recpies.model.js";

const router = express.Router();

/* ============================================================
   1️⃣ Create a New Recipe
   POST /recipes
============================================================ */
router.post("/", async (req: Request, res: Response) => {
  try {
    const recipe = new RecipeModel(req.body);
    await recipe.save();
    console.log("got here");
    res.status(201).json(recipe);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Error creating recipe:", err);
    res.status(500).json({ error: errorMessage });
  }
});

/* ============================================================
   2️⃣ Get All Recipes
   GET /recipes
============================================================ */
router.get("/", async (req: Request, res: Response) => {
  try {
    const posts = await RecipeModel.find();
    res.json(posts);
  } catch (err) {
    console.error("Error fetching recipes:", err);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

/* ============================================================
   3️⃣ Get Recipe by ID
   GET /recipes/:id
============================================================ */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const post = await RecipeModel.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Recipe not found" });
    res.json(post);
  } catch (err) {
    console.error("Invalid ID:", err);
    res.status(400).json({ error: "Invalid ID format" });
  }
});

/* ============================================================
   4️⃣ Get Recipes by createdBy
   GET /recipes/createdBy/:createdBy
============================================================ */
router.get("/createdBy/:createdBy", async (req: Request, res: Response) => {
  try {
    const posts = await RecipeModel.find({ createdBy: req.params.createdBy });
    res.json(posts);
  } catch (err) {
    console.error("Error fetching recipes by createdBy:", err);
    res.status(500).json({ error: "Failed to fetch recipes by createdBy" });
  }
});

/* ============================================================
   5️⃣ Update a Recipe
   PUT /recipes/:id
============================================================ */
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const updatedPost = await RecipeModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPost) return res.status(404).json({ error: "Recipe not found" });
    res.json(updatedPost);
  } catch (err) {
    console.error("Update failed:", err);
    res.status(400).json({ error: "Invalid data or recipe ID" });
  }
});

export default router;
