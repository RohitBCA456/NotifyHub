import { test, describe, before, beforeEach, afterEach, after } from "node:test";
import assert from "assert";
import { closeDB, clearDB, connectDB } from "../../../config/db.js";
import request from "supertest";
import { app } from "../../../../app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "../../../models/user.model.js";
import sinon from "sinon";
import { closeRabbitMQ } from "../../../config/rabbitmq.js";
import { clearRedis, closeRedis, connectRedis } from "../../../config/redis.js";

dotenv.config();

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
    // Use a random ObjectId that doesn't exist in DB
    const validId = new mongoose.Types.ObjectId().toString();
    const token = require("jsonwebtoken").sign({ id: validId }, process.env.JWT_SECRET);

    const response = await request(app)
      .get("/api/users/logout")
      .set("Cookie", [`webToken=${token}`]);

    assert.strictEqual(response.status, 404);
    assert.strictEqual(response.body.message, "User not found in DB");
  });

  test("should return 200 after logout", async () => {
    // Create user
    const user = await User.create({
      username: "testUser",
      imageUrl: "test.png",
      email: "test@example.com",
      sessionId: "SESSION_123",
    });

    // Generate token using the user's actual _id
    const token = user.generateWebToken();

    const response = await request(app)
      .get("/api/users/logout")
      .set("Cookie", [`webToken=${token}`]);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.message, "User logged out successfully.");
  });

  test("should return 500 if internal server error occurs", async () => {
    const user = await User.create({
      username: "testUser",
      imageUrl: "test.png",
      email: "test@example.com",
      sessionId: "SESSION_123",
    });

    const token = user.generateWebToken();

    const stub = sinon
      .stub(User, "findByIdAndUpdate")
      .throws(new Error("Database Error"));

    try {
      const response = await request(app)
        .get("/api/users/logout")
        .set("Cookie", [`webToken=${token}`]);

      assert.strictEqual(response.status, 500);
      assert.strictEqual(response.body.message, "Internal server error");
      assert.strictEqual(response.body.error, "Database Error");
    } finally {
      stub.restore();
    }
  });
});
