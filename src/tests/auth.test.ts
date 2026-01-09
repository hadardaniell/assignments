import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo: MongoMemoryServer;

describe('Auth Integration Tests', () => {
    // Exact schema matching your Swagger input
    const testUser = {
        name: "Test User",
        email: `test-${Date.now()}@example.com`,
        password: "Password123!",
        language: "en",
        avatarUrl: "https://example.com/avatar.png"
    };

    beforeAll(async () => {
        mongo = await MongoMemoryServer.create();
        await mongoose.connect(mongo.getUri());
    });

    afterAll(async () => {
        await mongoose.connection.close();
        await mongo.stop();
    });

    it('should register a new user successfully', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);

        // --- THE TRUTH LOG ---
        if (res.status === 404) {
            console.warn("\n--- REGISTRATION 404 DIAGNOSTIC ---");
            console.log("1. Request URL: POST /api/auth/register");
            console.log("2. Request Body Keys:", Object.keys(testUser));
            console.log("3. Response Body:", JSON.stringify(res.body, null, 2));
            console.warn("-----------------------------------\n");
        }

        expect([200, 201]).toContain(res.status);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user.email).toBe(testUser.email);
    });

    it('should return 404 for wrong login credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: "WrongPassword123"
            });
        
        // This confirms your custom logic that fails should result in 404
        expect(res.status).toBe(404);
    });

    it('should return 404 for non-existent email', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: "missing@example.com",
                password: "password"
            });
        
        expect(res.status).toBe(404);
    });
});