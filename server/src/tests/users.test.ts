import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app.js";
import { UserModel } from "../modules/users/user.model.js";

let mongo: MongoMemoryServer;

let seededUserId: string;
let createdUserId: string;

describe("Users Integration Tests", () => {
    beforeAll(async () => {
        mongo = await MongoMemoryServer.create();
        await mongoose.connect(mongo.getUri());

        // Pre-seed a user
        const seeded = await UserModel.create({
            email: "admin@test.com",
            passwordHash: "dummy_hash",
            name: "Admin",
            role: "admin",
        });

        seededUserId = seeded._id.toString();
    });

    afterAll(async () => {
        await mongoose.connection.close();
        await mongo.stop();
    });

    it("should fetch all users via TSOA route", async () => {
        const res = await request(app).get("/api/users/getUsers");

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0].email).toBe("admin@test.com");
    });

    describe("Users Controller – Extra Coverage Tests", () => {
        it("should fail to create user with missing email", async () => {
            const res = await request(app).post("/api/users/createUser").send({
                name: "No Email User",
                password: "pass123",
            });

            expect(res.status).toBeGreaterThanOrEqual(400);
            expect(res.body.message).toBeDefined();
        });

        it("should fail to get user by invalid Id", async () => {
            const res = await request(app).get("/api/users/getUserById/invalidid123");
            expect(res.status).toBeGreaterThanOrEqual(400);
            expect(res.body.message).toBeDefined();
        });
    });

    it("sanity: can create user directly in DB", async () => {
        const u = await UserModel.create({
            email: `direct-${Date.now()}@test.com`,
            passwordHash: "dummy_hash",
            name: "Direct",
            role: "user",
        });

        expect(u._id).toBeTruthy();
    });

    it("should create user successfully (201) and return SafeUser", async () => {
        const payload = {
            email: `u-${Date.now()}@test.com`,
            passwordHash: "dummy_hash",
            name: "New User",
        };

        const res = await request(app).post("/api/users/createUser").send(payload);

        if (res.status !== 201) {
            console.log("CREATE USER STATUS:", res.status);
            console.log("CREATE USER BODY:", JSON.stringify(res.body, null, 2));
        }

        expect(res.status).toBe(201);
        expect(res.body.email).toBe(payload.email);
        expect(res.body.passwordHash).toBeUndefined();
        expect(res.body.role).toBe("user");

        createdUserId = res.body._id || res.body.id;
        expect(createdUserId).toBeTruthy();
    });




    it("should get user by id successfully (200)", async () => {
        const id = createdUserId || seededUserId;
        expect(id).toBeTruthy();

        const res = await request(app).get(`/api/users/getUserById/${id}`);

        expect(res.status).toBe(200);
        expect(res.body).toBeTruthy();
        expect(res.body.email).toBeDefined();
        expect(res.body.password).toBeUndefined();
        expect(res.body.passwordHash).toBeUndefined();
    });

    it("should fail getUserById with valid ObjectId format but non-existent user (404/400)", async () => {
        const missingId = new mongoose.Types.ObjectId().toString();
        const res = await request(app).get(`/api/users/getUserById/${missingId}`);

        expect(res.status).toBeGreaterThanOrEqual(400);
        expect([400, 404, 500]).toContain(res.status);
        expect(res.body.message).toBeDefined();
    });

    it("should update user via PUT (200) - change name", async () => {
        const id = createdUserId || seededUserId;
        expect(id).toBeTruthy();

        const res = await request(app).put(`/api/users/updateUser/${id}`).send({
            name: "Updated Name",
        });

        expect(res.status).toBe(200);
        expect(res.body).toBeTruthy();
        expect(res.body.name).toBe("Updated Name");
        expect(res.body.passwordHash).toBeUndefined();
    });

    it("should fail update user via PUT with invalid id (400+)", async () => {
        const res = await request(app).put("/api/users/updateUser/not-an-id").send({
            name: "X",
        });

        expect(res.status).toBeGreaterThanOrEqual(400);
        expect(res.body.message).toBeDefined();
    });

    it("should update profile via PATCH (200) - change name", async () => {
        const id = createdUserId || seededUserId;
        expect(id).toBeTruthy();

        const res = await request(app).patch(`/api/users/updateProfile/${id}`).send({
            name: "Patched Name",
        });

        expect(res.status).toBe(200);
        expect(res.body.name).toBe("Patched Name");
    });

    it("should fail updateProfile when body is empty (400/200 depending on service)", async () => {
        const id = createdUserId || seededUserId;
        expect(id).toBeTruthy();

        const res = await request(app).patch(`/api/users/updateProfile/${id}`).send({});

        expect([200, 400]).toContain(res.status);
    });

    it("should delete user (204) then getUserById should fail", async () => {
        const u = await UserModel.create({
            email: `del-${Date.now()}@test.com`,
            passwordHash: "dummy_hash",
            name: "To Delete",
            role: "user",
        });
        const delId = u._id.toString();
        
        const before = await request(app).get(`/api/users/getUserById/${delId}`);
        console.log("GET before delete:", before.status, before.body);
        expect(before.status).toBe(200);

        const delRes = await request(app).delete(`/api/users/deleteUser/${delId}`);
        expect(delRes.status).toBe(204);

        const getRes = await request(app).get(`/api/users/getUserById/${delId}`);
        expect(getRes.status).toBeGreaterThanOrEqual(400);
    });

    it("should fail delete with invalid id (400+)", async () => {
        const res = await request(app).delete("/api/users/deleteUser/invalidid123");
        expect(res.status).toBeGreaterThanOrEqual(400);
        expect(res.body.message ?? res.body.error ?? res.text).toBeTruthy();
    });
});
