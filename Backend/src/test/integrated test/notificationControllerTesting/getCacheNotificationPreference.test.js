import { test, describe, before, after, beforeEach } from "node:test";
import request from "supertest";
import assert from "assert";
import { clearDB, closeDB, connectDB } from "../../../config/db.js";
import {
  clearRedis,
  client,
  closeRedis,
  connectRedis,
} from "../../../config/redis.js";
import { closeRabbitMQ } from "../../../config/rabbitmq.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { app } from "../../../../app.js";
import sinon from "sinon";

dotenv.config();

const VALID_ID = new mongoose.Types.ObjectId().toString();
const SECRET = process.env.JWT_SECRET;

describe("POST /cache-preferences", () => {
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

  test("should return 400 if appId is missing", async () => {
    const token = jwt.sign({ id: VALID_ID }, SECRET);

    const response = await request(app)
      .post("/api/notifications/cache-preferences")
      .set("Cookie", [`webToken=${token}`])
      .send({ appId: "not_a_valid_appId" });

    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.message, "appId is required");
  });

  test("should return 404 if preference not found in Cache (cache miss)", async () => {
    const payLoad = { appId: new mongoose.Types.ObjectId().toString() };

    const token = jwt.sign({ id: VALID_ID }, SECRET);

    const response = await request(app)
      .post("/api/notifications/cache-preferences")
      .set("Cookie", [`webToken=${token}`])
      .send(payLoad);

    assert.strictEqual(response.status, 404);
    assert.strictEqual(response.body.message, "Preference not found on cache");
  });

  test("should return 200 if data is found in Cache (cache hit)", async () => {
    const payLoad = {
      appId: new mongoose.Types.ObjectId().toString(),
    };

    const token = jwt.sign({ id: VALID_ID }, SECRET);

    await client.hSet(`pref:${payLoad.appId}`, {
      preferences: JSON.stringify({
        email: true,
        sms: true,
        inapp: false,
      }),
      quietHours: JSON.stringify({
        enabled: true,
        start: "22:00",
        end: "2:00",
      }),
    });

    const response = await request(app)
      .post("/api/notifications/cache-preferences")
      .set("Cookie", [`webToken=${token}`])
      .send(payLoad);

    const expectedString = JSON.stringify({
      email: true,
      sms: true,
      inapp: false,
    });

    assert.strictEqual(response.status, 200);

    assert.strictEqual(response.body.preferences, expectedString);

    const parsedPreferences = JSON.parse(response.body.preferences);
    assert.strictEqual(parsedPreferences.inapp, false);
  });

  test("should return 500 if an error occurs", async () => {
    const payLoad = {
      appId: new mongoose.Types.ObjectId().toString(),
    };

    const token = jwt.sign({ id: VALID_ID }, SECRET);

    const stub = sinon
      .stub(client, "hGetAll")
      .rejects(new Error("Redis connection failed"));

    const response = await request(app)
      .post("/api/notifications/cache-preferences")
      .set("Cookie", [`webToken=${token}`])
      .send(payLoad);

    assert.strictEqual(response.status, 500);
    assert.strictEqual(response.body.message, "Internal Server Error");
    assert.strictEqual(response.body.err, "Redis connection failed");

    stub.restore();
  });
});
