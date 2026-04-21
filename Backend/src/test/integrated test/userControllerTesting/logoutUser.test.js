import { test, describe, before, beforeEach, after } from "node:test";
import assert from "assert";
import { closeDB, clearDB, connectDB } from "../../../config/db.js";
import request from "supertest";
import { app } from "../../../../app.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "../../../models/user.model.js";
import sinon from "sinon";
import { closeRabbitMQ } from "../../../config/rabbitmq.js";
import { clearRedis, closeRedis, connectRedis } from "../../../config/redis.js";

dotenv.config();

let secret = process.env.JWT_SECRET;

describe("GET /logout", () => {
  before(async () => {
    await connectDB();
    await connectRedis();
  });

  beforeEach(async () => {
    await clearDB();
    await clearRedis();
  });

  after(async () => {
    await closeDB();
    await closeRedis();
    await closeRabbitMQ();
  });

  test("should return 401 if token is missing", async () => {
    const response = await request(app).get("/api/users/logout");

    assert.strictEqual(response.status, 401);
    assert.strictEqual(
      response.body.message,
      "Authentication token is missing.",
    );
  });

  test("should return 404 if user is not found in the DB", async () => {
    const validId = new mongoose.Types.ObjectId().toString();

    const token = jwt.sign({ id: validId }, secret);

    const response = await request(app)
      .get("/api/users/logout")
      .set("Cookie", [`webToken=${token}`]);

    assert.strictEqual(response.status, 404);
    assert.strictEqual(response.body.message, "User not found in DB");
  });

  test("should return 200 after logout", async () => {
    const existingUser = {
      username: "testUser",
      imageUrl: "test.png",
      email: "test@example.com",
      sessionId: "SESSION_123",
    };

    const user = await User.create(existingUser);

    const token = await user.generateWebToken();

    const response = await request(app)
      .get("/api/users/logout")
      .set("Cookie", [`webToken=${token}`]);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.message, "User logged out successfully.");
  });

  test("should return 500 if internal server error occurs", async () => {
    const existingUser = {
      username: "testUser",
      imageUrl: "test.png",
      email: "test@example.com",
      sessionId: "SESSION_123",
    };

    const user = await User.create(existingUser);

    const token = user.generateWebToken();

    const stub = sinon
      .stub(User, "findByIdAndUpdate")
      .throws(new Error("Database Error"));

    const response = await request(app)
      .get("/api/users/logout")
      .set("Cookie", [`webToken=${token}`]);

    assert.strictEqual(response.status, 500);
    assert.strictEqual(response.body.message, "Internal server error");
    assert.strictEqual(response.body.error, "Database Error");

    stub.restore();
  });
});
