import { describe, it, expect, afterAll, beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo: MongoMemoryServer;

describe('API Integration Tests', () => {
  // Real IDs from your request.rest
  const USER_ID = "693041739a28b3e672ca7192";
  const RECIPE_BOOK_ID = "693042979a28b3e672ca719e";
  const FALLBACK_RECIPE_ID = "6930442a9a28b3e672ca71b6";
  
  let createdRecipeId: string;
  let createdCommentId: string;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test_secret_key_123';
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongo.stop();
  });

  describe('Recipes Module', () => {
    it('should create a new recipe', async () => {
      const recipePayload = {
        recipeBookId: RECIPE_BOOK_ID,
        createdBy: USER_ID,
        title: "פסטה שמנת ניסיון הדר",
        description: "מתכון מהיר וטעים",
        categories: ["פסטה", "איטלקי"],
        prepTimeMinutes: 10,
        cookTimeMinutes: 15,
        totalTimeMinutes: 25,
        difficulty: "easy",
        ingredients: [
          { name: "פסטה", quantity: 2, unit: "חתיכות", notes: null }
        ],
        steps: [
          { index: 1, instruction: "לחמם חמאה", durationMinutes: 2 }
        ],
        sourceType: "manual",
        status: "published"
      };

      const res = await request(app).post('/api/recipes/createRecipe').send(recipePayload);
      expect(res.status).toBe(201);
      createdRecipeId = res.body.Id || res.body._id || res.body.id;
    });

    it('should get all recipes', async () => {
        const res = await request(app).get('/api/recipes/getRecipes');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('Comments Module', () => {
    // 1. CREATE
    it('should add a comment to the recipe', async () => {
      const res = await request(app)
        .post('/api/comments/create')
        .send({
          recipeId: createdRecipeId || FALLBACK_RECIPE_ID,
          content: "סתם הערה חדשה",
          createdBy: USER_ID
        });
      
      expect(res.status).toBe(201);
      createdCommentId = res.body.Id || res.body._id || res.body.id;
    });

    // 2. READ (List for Recipe)
    it('should get all comments for a specific recipe', async () => {
      const targetRecipe = createdRecipeId || FALLBACK_RECIPE_ID;
      // PATH: /api/comments/recipe/getCommentsByRecipe/{id}
      const res = await request(app).get(`/api/comments/recipe/getCommentsByRecipe/${targetRecipe}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    // 3. READ (Single Comment)
    it('should get a single comment by ID', async () => {
      // PATH: /api/comments/getCommentById/{id}
      const res = await request(app).get(`/api/comments/getCommentById/${createdCommentId}`);
      
      expect(res.status).toBe(200);
      expect(res.body.content).toBe("סתם הערה חדשה");
    });

    // 4. UPDATE
    it('should update a comment', async () => {
      // PATH: /api/comments/update/{id}
      const res = await request(app)
        .put(`/api/comments/update/${createdCommentId}`)
        .send({
          content: "bla bla bla"
        });
      
      expect(res.status).toBe(200);
      expect(res.body.content).toBe("bla bla bla");
    });

    // 5. DELETE
    it('should delete a comment', async () => {
      // PATH: /api/comments/delete/{id}
      const res = await request(app).delete(`/api/comments/delete/${createdCommentId}`);
      
      expect([200, 204]).toContain(res.status);

      // Final Check: verify it's gone
      const check = await request(app).get(`/api/comments/getCommentById/${createdCommentId}`);
      expect(check.status).toBe(404);
    });
  });
});