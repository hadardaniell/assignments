import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo: MongoMemoryServer;

describe('Auth Integration Tests', () => {
    const testUser = {
        name: "Test User",
        email: `test-${Date.now()}@example.com`,
        password: "Password123!",
        language: "en",
        avatarUrl: "https://example.com/avatar.png"
    };

    beforeAll(async () => {
        // Fix for 'Missing JWT secret' error
        process.env.JWT_SECRET = 'test-secret-key-123';

        mongo = await MongoMemoryServer.create();
        const uri = mongo.getUri();
        await mongoose.connect(uri);
    });

    afterAll(async () => {
        await mongoose.connection.close();
        await mongo.stop();
    });

    it('should register a new user successfully', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);

        if (res.status === 500) {
            console.error("\n--- REGISTRATION 500 ERROR ---", res.body);
        }

        expect([200, 201]).toContain(res.status);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user.email).toBe(testUser.email);
    });

    it('should return 401 for wrong login credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: "WrongPassword123"
            });

        // Corrected expectation: 401 is the standard for bad credentials
        expect(res.status).toBe(401);
    });

    it('should return 401 for non-existent email', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: "missing@example.com",
                password: "password"
            });

        // Corrected expectation: 401 is the standard for non-existent users
        expect(res.status).toBe(401);
    });

    describe('Auth Controller – Extra Coverage Tests', () => {
        let accessToken: string;
        let refreshToken: string;

        it('should fail to register with missing required fields', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'bad@example.com'
                });

            expect(res.status).toBeGreaterThanOrEqual(400);
        });

        it('should login successfully with correct credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');

            accessToken = res.body.token;
            refreshToken = res.body.refreshToken;
        });

        it('should return 400 when login body is empty', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({});

            expect(res.status).toBeGreaterThanOrEqual(400);
        });

        it('should return 401 when accessing /me without token', async () => {
            const res = await request(app)
                .get('/api/auth/me');

            expect(res.status).toBe(401);
        });

        it('should return 401 when logout is blocked by bearerAuth', async () => {
            const res = await request(app)
                .post('/api/auth/logout')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(res.status).toBe(401);
        });
        
        it('should fail refresh without refreshToken', async () => {
            const res = await request(app)
                .post('/api/auth/refresh')
                .send({});

            expect(res.status).toBe(400);
        });

        it('should fail refresh with invalid refreshToken', async () => {
            const res = await request(app)
                .post('/api/auth/refresh')
                .send({
                    refreshToken: 'invalid-token'
                });

            expect(res.status).toBeGreaterThanOrEqual(401);
        });
    });
});