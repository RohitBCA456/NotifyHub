import { describe, test, before, after, beforeEach } from "node:test";
import assert from "assert";
import { clearDB, closeDB, connectDB } from "../../../config/db.js";
import { clearRedis, closeRedis, connectRedis } from "../../../config/redis.js";
import { closeRabbitMQ } from "../../../config/rabbitmq.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import request from "supertest";
import { app } from "../../../../app.js";
import jwt from "jsonwebtoken";
import { client } from "../../../config/redis.js";
import sinon from "sinon";

dotenv.config();

const VALID_ID = new mongoose.Types.ObjectId().toString();
const SECRET = process.env.JWT_SECRET;

describe("POST /cache-profile", () => {
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

  test("should return 404 if data not found in cache", async () => {
    const token = jwt.sign({ id: VALID_ID }, SECRET);

    const response = await request(app)
      .post("/api/users/cache-profile")
      .set("Cookie", `webToken=${token}`)
      .send({ userId: VALID_ID });

    //       console.log(response);

    assert.strictEqual(response.status, 404);
    assert.strictEqual(response.body.message, "Cache Miss");
  });

  test("should return 200 if cache hit", async () => {
    const token = jwt.sign({ id: VALID_ID }, SECRET);

    const key = `profile:${VALID_ID}`;
    await client.hSet(key, {
      id: VALID_ID,
      name: "John Doe",
      email: "john@example.com",
      imageUrl: "test.png",
    });

    const response = await request(app)
      .post("/api/users/cache-profile")
      .set("Cookie", `webToken=${token}`)
      .send({ userId: VALID_ID });

    console.log(`Response body: ${response.body}`);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.message, "Cache Hit");
    assert.ok(response.body.user);
    assert.strictEqual(response.body.user.name, "John Doe");
    assert.strictEqual(response.body.user.email, "john@example.com");
  });

  test("should return 500 if error occurs", async () => {
    const token = jwt.sign({ id: VALID_ID }, SECRET);

    const key = `profile:${VALID_ID}`;
    await client.hSet(key, {
      id: VALID_ID,
      name: "John Doe",
      email: "john@example.com",
      imageUrl: "test.png",
    });

    const stub = sinon.stub(client, "hGetAll").rejects(new Error("Redis Error"));

    const response = await request(app)
      .post("/api/users/cache-profile")
      .set("Cookie", `webToken=${token}`)
      .send({ userId: VALID_ID });

    assert.strictEqual(response.status, 500);
    assert.strictEqual(response.body.message, "Internal Server Error");
    assert.strictEqual(response.body.err, "Redis Error");

    stub.restore();
  });
});
