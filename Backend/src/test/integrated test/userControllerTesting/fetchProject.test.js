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

const VALID_ID = new mongoose.Types.ObjectId().toString();
const SECRET = process.env.JWT_SECRET;

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
    const existingUser = {
      username: "testUser",
      imageUrl: "test.png",
      email: "test@example.com",
      sessionId: "session_123",
    };

    const createdUser = await User.create(existingUser);

    const token = createdUser.generateWebToken();

    const existingProject = {
      name: "serviceProvider",
      userId: createdUser._id,
      apiKey: generateApiKey(),
    };

   const createdProject = await App.create(existingProject);

    const response = await request(app)
      .get("/api/users/fetch-projects")
      .set("Cookie", `webToken=${token}`);

    assert.strictEqual(response.status, 200);

    const fetchedApps = response.body.apps;

    console.log(`fetched projects : ${fetchedApps[0]}`);

    assert.ok(Array.isArray(fetchedApps), "Response body should contain an apps array");
    assert.strictEqual(fetchedApps.length, 1);

    assert.strictEqual(fetchedApps[0].name, existingProject.name);
    assert.strictEqual(fetchedApps[0].apiKey, existingProject.apiKey);
  });

  test("should return 500 if error occurs", async () => {
    const existingUser = {
      username: "testUser",
      imageUrl: "test.png",
      email: "test@example.com",
      sessionId: "session_123",
    };

    const createdUser = await User.create(existingUser);

    const token = createdUser.generateWebToken();

    const existingProject = {
      name: "serviceProvider",
      userId: createdUser._id,
      apiKey: generateApiKey(),
    };

    const createdProject = await App.create(existingProject);

    const stub = sinon
      .stub(App, "aggregate")
      .throws(new Error("Database Error"));

    const response = await request(app)
      .get("/api/users/fetch-projects")
      .set("Cookie", `webToken=${token}`);

    assert.strictEqual(response.status, 500);
    assert.strictEqual(response.body.message, "Internal server error");

    stub.restore();
  });
});
