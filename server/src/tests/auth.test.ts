import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { AppError } from "../common";
import { AuthController } from "../controllers/auth.tsoa";

let mongo: MongoMemoryServer;

describe("Auth Integration Tests", () => {
  let controller: AuthController;

  const testUser = {
    name: "Test User",
    email: `test-${Date.now()}@example.com`,
    password: "Password123!",
    language: "en",
    avatarUrl: "https://example.com/avatar.png",
  };

  beforeAll(async () => {
    controller = new AuthController();
    (controller as any).setStatus = jest.fn();

    process.env.JWT_SECRET = "test-secret-key-123";

    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongo.stop();
  });

  it("should register a new user successfully", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);

    if (res.status === 500) {
      console.error("\n--- REGISTRATION 500 ERROR ---", res.body);
    }

    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe(testUser.email);
  });

  it("should return 401 for wrong login credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: "WrongPassword123",
    });

    expect(res.status).toBe(401);
  });

  it("should return 401 for non-existent email", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "missing@example.com",
      password: "password",
    });

    expect(res.status).toBe(401);
  });

  describe("Auth Controller – Extra Coverage Tests", () => {
    let accessToken: string;
    let refreshToken: string;

    it("should fail to register with missing required fields", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: "bad@example.com",
      });

      expect(res.status).toBeGreaterThanOrEqual(400);
    });

    it("should login successfully with correct credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");

      accessToken = res.body.token;
      refreshToken = res.body.refreshToken;
    });

    it("should return 400 when login body is empty", async () => {
      const res = await request(app).post("/api/auth/login").send({});

      expect(res.status).toBeGreaterThanOrEqual(400);
    });

    it("should return 401 when accessing /me without token", async () => {
      const res = await request(app).get("/api/auth/me");
      expect(res.status).toBe(401);
    });

    it("should return 200 when calling logout with valid JWT (Bearer token)", async () => {
      const res = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${accessToken}`);

      // אחרי התיקון, עם טוקן תקין מצפים הצלחה
      expect([200, 204]).toContain(res.status);
    });

    it("should fail refresh without refreshToken", async () => {
      const res = await request(app).post("/api/auth/refresh").send({});
      expect(res.status).toBe(400);
    });

    it("should fail refresh with invalid refreshToken", async () => {
      const res = await request(app).post("/api/auth/refresh").send({
        refreshToken: "invalid-token",
      });

      expect(res.status).toBeGreaterThanOrEqual(401);
    });
  });

  it("register: sets 201 on success", async () => {
    (controller as any).service = {
      register: jest.fn().mockResolvedValue({
        token: "t",
        refreshToken: "r",
        user: { email: "a@a.com" },
      }),
    };

    const res = await controller.register({
      name: "A",
      email: "a@a.com",
      password: "Password123!",
      language: "en",
      avatarUrl: "x",
    } as any);

    expect((controller as any).setStatus).toHaveBeenCalledWith(201);
    expect(res.token).toBe("t");
  });

  it("register: when service throws AppError with statusCode -> setStatus(statusCode)", async () => {
    (controller as any).service = {
      register: jest.fn().mockRejectedValue(new AppError(409, "Email exists", "DUP")),
    };

    await expect(controller.register({} as any)).rejects.toBeInstanceOf(AppError);
    expect((controller as any).setStatus).toHaveBeenCalledWith(409);
  });

  it("login: when service throws plain error with .status -> setStatus(status)", async () => {
    const err = { status: 401, message: "nope" };
    (controller as any).service = {
      login: jest.fn().mockRejectedValue(err),
    };

    await expect(controller.login({} as any)).rejects.toEqual(err);
    expect((controller as any).setStatus).toHaveBeenCalledWith(401);
  });

  it("me: uses req.user.sub and sets 200 on success", async () => {
    (controller as any).service = {
      me: jest.fn().mockResolvedValue({ _id: "1", email: "x@y.com" }),
    };

    // JWT payload בדרך כלל שם את המשתמש ב-sub
    const req = { user: { sub: "1" } };
    const res = await controller.me(req as any);

    expect((controller as any).setStatus).toHaveBeenCalledWith(200);
    expect((controller as any).service.me).toHaveBeenCalledWith("1");
    expect(res.email).toBe("x@y.com");
  });

  it("logout: missing/invalid Authorization header -> 401", async () => {
    (controller as any).service = { logout: jest.fn() };

    const req = { headers: {} };
    await expect(controller.logout(req as any)).rejects.toBeInstanceOf(AppError);
    expect((controller as any).setStatus).toHaveBeenCalledWith(401);
    expect((controller as any).service.logout).not.toHaveBeenCalled();
  });

  it("logout: valid Bearer token -> calls service.logout(token) and sets 200", async () => {
    (controller as any).service = { logout: jest.fn().mockResolvedValue(undefined) };

    const req = { headers: { authorization: "Bearer abc123" } };
    const res = await controller.logout(req as any);

    expect((controller as any).service.logout).toHaveBeenCalledWith("abc123");
    expect((controller as any).setStatus).toHaveBeenCalledWith(200);
    expect(res).toEqual({ message: "Logged out successfully" });
  });

  it("refresh: missing refreshToken -> 400", async () => {
    (controller as any).service = { refresh: jest.fn() };

    await expect(controller.refresh({} as any)).rejects.toBeInstanceOf(AppError);
    expect((controller as any).setStatus).toHaveBeenCalledWith(400);
    expect((controller as any).service.refresh).not.toHaveBeenCalled();
  });

  it("refresh: valid refreshToken -> sets 200 and returns AuthResponse", async () => {
    (controller as any).service = {
      refresh: jest.fn().mockResolvedValue({ token: "newT", refreshToken: "newR", user: { email: "e" } }),
    };

    const res = await controller.refresh({ refreshToken: "r1" });

    expect((controller as any).service.refresh).toHaveBeenCalledWith("r1");
    expect((controller as any).setStatus).toHaveBeenCalledWith(200);
    expect(res.token).toBe("newT");
  });

  it("any method: when error has no status/statusCode -> setStatus(500)", async () => {
    (controller as any).service = { login: jest.fn().mockRejectedValue(new Error("boom")) };

    await expect(controller.login({} as any)).rejects.toBeInstanceOf(Error);
    expect((controller as any).setStatus).toHaveBeenCalledWith(500);
  });
});
