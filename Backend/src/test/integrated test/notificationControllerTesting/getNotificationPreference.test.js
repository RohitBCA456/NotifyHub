import { test, describe, before, after, beforeEach } from "node:test";
import request from "supertest";
import assert from "assert";
import { clearDB, closeDB, connectDB } from "../../../config/db.js";
import { clearRedis, closeRedis, connectRedis } from "../../../config/redis.js";
import { closeRabbitMQ } from "../../../config/rabbitmq.js";
import { app } from "../../../../app.js";
import mongoose from "mongoose";
import { UserPreference } from "../../../models/userPreference.model.js";
import sinon from "sinon";

describe("GET /get-preference/:appId", () => {
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
    const appId = "not_a_valid_id";

    const response = await request(app).get(
      `/api/notifications/get-preferences/${appId}`,
    );

    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.message, "AppId is required");
  });

  test("should return 404 if preference not found in DB", async () => {
    const appId = new mongoose.Types.ObjectId().toString();

    const response = await request(app).get(
      `/api/notifications/get-preferences/${appId}`,
    );

    assert.strictEqual(response.status, 404);
    assert.deepStrictEqual(response.body.preferences, {
      email: false,
      sms: false,
      inapp: false,
    });
  });

  test("should return 200 if preference found in DB", async () => {
    const appId = new mongoose.Types.ObjectId().toString();

    const existingUserPref = await UserPreference.create({
      appId,
      preferences: {
        email: true,
        sms: true,
        inapp: false,
      },
      quietHours: {
        enabled: true,
        start: "22:00",
        end: "3:00",
      },
    });

    const response = await request(app).get(
      `/api/notifications/get-preferences/${appId}`,
    );

    const isExist = await UserPreference.findOne({ appId });

    assert.strictEqual(response.status, 200);

    assert.strictEqual(response.body.preferences.email, true);
    assert.strictEqual(response.body.preferences.sms, true);
    assert.strictEqual(response.body.appId, appId);
  });

  test("should return 500 if error occurs", async () => {
    const appId = new mongoose.Types.ObjectId().toString();

    const existingUserPref = await UserPreference.create({
      appId,
      preferences: {
        email: true,
        sms: true,
        inapp: false,
      },
      quietHours: {
        enabled: true,
        start: "22:00",
        end: "3:00",
      },
    });

    const stub = sinon
      .stub(UserPreference, "findOne")
      .throws(new Error("Database Error"));

    const response = await request(app).get(
      `/api/notifications/get-preferences/${appId}`,
    );

    assert.strictEqual(response.status, 500);
    assert.strictEqual(response.body.message, "Internal server error");
  });
});
