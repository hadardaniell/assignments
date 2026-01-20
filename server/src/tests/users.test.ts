import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from 'app.js';
import { UserModel } from 'modules/users/user.model';

let mongo: MongoMemoryServer;

describe('Users Integration Tests', () => {
    beforeAll(async () => {
        mongo = await MongoMemoryServer.create();
        await mongoose.connect(mongo.getUri());

        // Pre-seed a user
        await UserModel.create({
            email: "admin@test.com",
            passwordHash: "dummy_hash",
            name: "Admin",
            role: "admin"
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
        await mongo.stop();
    });

    it('should fetch all users via TSOA route', async () => {
        const res = await request(app).get('/api/users/getUsers');
        
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0].email).toBe("admin@test.com");
    });
});