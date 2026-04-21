import {
  test,
  describe,
  before,
  after,
  beforeEach,
  afterEach,
} from "node:test";
import request from "supertest";
import assert from "assert";
import mongoose from "mongoose";
import { clearDB, closeDB, connectDB } from "../../../config/db.js";
import { clearRedis, closeRedis, connectRedis } from "../../../config/redis.js";
import { closeRabbitMQ } from "../../../config/rabbitmq.js";
import { client } from "../../../../src/config/redis.js";
import { app } from "../../../../app.js";

describe("GET /project-cache/:projectId", () => {
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

  test("should return 400 if projectId is missing", async () => {
    const response = await request(app).get(
      "/api/analytics/project-cache/undefined",
    );

    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.message, "Project ID is required");
  });

  test("should return 404 if cache miss", async () => {
    const projectId = new mongoose.Types.ObjectId().toString();

    const response = await request(app).get(
      `/api/analytics/project-cache/${projectId}`,
    );

    assert.strictEqual(response.status, 404);
    assert.strictEqual(response.body.message, "Cache miss");
  });

  test("should return 200 if cache hit", async () => {
    const projectId = new mongoose.Types.ObjectId().toString();
    const key = `PStats:${projectId}`;

    await client.hSet(key, {
      total: "1500",
      successRate: "95.6",
    });

    const response = await request(app).get(
      `/api/analytics/project-cache/${projectId}`,
    );

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.total, "1500");
    assert.strictEqual(response.body.successRate, "95.6");
  });
});