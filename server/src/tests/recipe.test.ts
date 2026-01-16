import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import '../modules/recipes/recpies.model.js'; 

let mongo: MongoMemoryServer;

describe('Recipes Module Integration Tests', () => {
    const USER_ID = "693041739a28b3e672ca7192";
    const RECIPE_BOOK_ID = "693042979a28b3e672ca719e";
    let createdRecipeId: string;

    beforeAll(async () => {
        process.env.JWT_SECRET = 'test_secret_key_123';
        mongo = await MongoMemoryServer.create();
        await mongoose.connect(mongo.getUri());
    });

    afterAll(async () => {
        await mongoose.connection.close();
        await mongo.stop();
    });

    it('should create a new recipe', async () => {
        const payload = {
            recipeBookId: RECIPE_BOOK_ID,
            createdBy: USER_ID,
            title: "פסטה שמנת בדיקה",
            difficulty: "easy",
            ingredients: [{ name: "פסטה", quantity: 2 }],
            steps: [{ instruction: "לבשל פסטה", index: 1 }],
            sourceType: "manual",
            status: "published"
        };

        const res = await request(app).post('/api/recipes/createRecipe').send(payload);

        expect([200, 201]).toContain(res.status);
        createdRecipeId = res.body.Id; 
        expect(createdRecipeId).toBeDefined();
    });

    it('should get recipe by Id', async () => {
        const res = await request(app).get(`/api/recipes/getRecipeById/${createdRecipeId}`);
        expect(res.status).toBe(200);
        expect(res.body.Id).toBe(createdRecipeId);
    });

    it('should update recipe', async () => {
        const res = await request(app)
            .put(`/api/recipes/updateRecipe/${createdRecipeId}`)
            .send({ 
                title: "מעודכן", 
                createdBy: USER_ID,
                recipeBookId: RECIPE_BOOK_ID 
            });
        
        expect(res.status).toBe(200);
        expect(res.body.title).toBe("מעודכן");
    });

    it('should delete recipe', async () => {
        const res = await request(app).delete(`/api/recipes/deleteRecipe/${createdRecipeId}`);
        expect(res.status).toBe(204);

        const check = await request(app).get(`/api/recipes/getRecipeById/${createdRecipeId}`);
        expect(check.status).toBe(404);
    });
});