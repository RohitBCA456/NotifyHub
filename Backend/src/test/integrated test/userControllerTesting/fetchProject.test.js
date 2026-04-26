import { test, describe, before, beforeEach, after } from "node:test";
import request from "supertest";
import { connectDB, clearDB, closeDB } from "../../../config/db.js";
import mongoose from "mongoose";
import sinon from "sinon";
import { app } from "../../../../app.js";
import assert from "assert";
import dotenv from "dotenv";
import { User } from "../../../models/user.model.js";
import { generateApiKey } from "../../../utils/generateApiKey.js";
import { App } from "../../../models/app.model.js";
import { closeRabbitMQ } from "../../../config/rabbitmq.js";
import { clearRedis, closeRedis, connectRedis } from "../../../config/redis.js";

dotenv.config();

describe("GET /fetch-projects", () => {
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

  test("should return 401 if user is unauthorized", async () => {
    const response = await request(app).get("/api/users/fetch-projects");

    assert.strictEqual(response.status, 401);
    assert.strictEqual(
      response.body.message,
      "Authentication token is missing.",
    );
  });

  test("should return 200 with fetched projects", async () => {
    // Create user and generate token from their actual _id
    const createdUser = await User.create({
      username: "testUser",
      imageUrl: "test.png",
      email: "test@example.com",
      sessionId: "session_123",
    });

    const token = createdUser.generateWebToken();

    // Create app with the user's actual _id
    const createdProject = await App.create({
      name: "serviceProvider",
      userId: createdUser._id,
      apiKey: generateApiKey(),
    });

    const response = await request(app)
      .get("/api/users/fetch-projects")
      .set("Cookie", `webToken=${token}`);

    assert.strictEqual(response.status, 200);

    const fetchedApps = response.body.apps;

    assert.ok(Array.isArray(fetchedApps), "Response body should contain an apps array");
    assert.strictEqual(fetchedApps.length, 1);
    assert.strictEqual(fetchedApps[0].name, createdProject.name);
    assert.strictEqual(fetchedApps[0].apiKey, createdProject.apiKey);
  });

  test("should return 500 if error occurs", async () => {
    const createdUser = await User.create({
      username: "testUser",
      imageUrl: "test.png",
      email: "test@example.com",
      sessionId: "session_123",
    });

    const token = createdUser.generateWebToken();

    const stub = sinon
      .stub(App, "aggregate")
      .throws(new Error("Database Error"));

    try {
      const response = await request(app)
        .get("/api/users/fetch-projects")
        .set("Cookie", `webToken=${token}`);

      assert.strictEqual(response.status, 500);
      assert.strictEqual(response.body.message, "Internal server error");
    } finally {
      stub.restore();
    }
  });
});
