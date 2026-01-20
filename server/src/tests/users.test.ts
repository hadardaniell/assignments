import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app.js';
import { UserModel } from '../modules/users/user.model.js';

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

    describe('Users Controller – Extra Coverage Tests', () => {
        let createdUserId: string;
        let uploadedFileMock = {
            filename: 'avatar.png',
            originalname: 'avatar.png',
            buffer: Buffer.from('fake image content')
        } as unknown as Express.Multer.File;

        it('should fail to create user with missing email', async () => {
            const res = await request(app)
                .post('/api/users/createUser')
                .send({ name: "No Email User", password: "pass123" });

            expect(res.status).toBeGreaterThanOrEqual(400);
            expect(res.body.message).toBeDefined();
        });

        it('should fail to get user by invalid Id', async () => {
            const res = await request(app).get('/api/users/getUserById/invalidid123');
            expect(res.status).toBeGreaterThanOrEqual(400);
            expect(res.body.message).toBeDefined();
        });
    });
});