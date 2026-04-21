import { test, describe, before, after, beforeEach } from "node:test";
import assert from "assert";
import request from "supertest";
import { clearDB, closeDB, connectDB } from "../../../config/db.js";
import { clearRedis, closeRedis, connectRedis } from "../../../config/redis.js";
import { closeRabbitMQ } from "../../../config/rabbitmq.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { app } from "../../../../app.js";
import { UserPreference } from "../../../models/userPreference.model.js";
import { client } from "../../../config/redis.js";
import sinon from "sinon";

dotenv.config();

const VALID_ID = new mongoose.Types.ObjectId().toString();
const SECRET = process.env.JWT_SECRET;

describe("POST /update-preference", () => {
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

  test("should return 400 if appId or preferences are missing", async () => {
    const token = jwt.sign({ id: VALID_ID }, SECRET);

    const payLoad = {
      appId: new mongoose.Types.ObjectId().toString(),
      preferences: null,
    };

    const response = await request(app)
      .post("/api/notifications/update-preferences")
      .set("Cookie", [`webToken=${token}`])
      .send(payLoad);

    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.message, "Fields are missing.");
  });

  test("should return 200 if preference is updated successfully", async () => {
    const token = jwt.sign({ id: VALID_ID }, SECRET);
    const appId = new mongoose.Types.ObjectId().toString();

    const payLoad = {
      appId,
      preferences: {
        email: true,
        sms: false,
        inapp: false,
        quietHours: {
          enabled: true,
          start: "22:00",
          end: "3:00",
        },
      },
    };

    const response = await request(app)
      .post("/api/notifications/update-preferences")
      .set("Cookie", [`webToken=${token}`])
      .send(payLoad);

    const savedPref = await UserPreference.findOne({ appId });

    assert.ok(savedPref, "Record should exist in DB");
    assert.strictEqual(savedPref.preferences.email, true);
    assert.strictEqual(savedPref.quietHours.start, "22:00");

    const cacheKey = `pref:${appId}`;
    const cachedData = await client.hGetAll(cacheKey);

    assert.ok(cachedData.preferences, "Preferences should be in Redis");
    const parsedPrefs = JSON.parse(cachedData.preferences);
    assert.strictEqual(parsedPrefs.email, true);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(
      response.body.message,
      "Updated Preference successfully",
    );
  });

  test("should return 500 if error occurs", async () => {
    const token = jwt.sign({ id: VALID_ID }, SECRET);
    const appId = new mongoose.Types.ObjectId().toString();

    const payLoad = {
      appId,
      preferences: {
        email: true,
        sms: false,
        inapp: false,
        quietHours: {
          enabled: true,
          start: "22:00",
          end: "3:00",
        },
      },
    };

    const stub = sinon
      .stub(UserPreference, "findOneAndUpdate")
      .throws(new Error("Database error"));

    const response = await request(app)
      .post("/api/notifications/update-preferences")
      .set("Cookie", [`webToken=${token}`])
      .send(payLoad);

    assert.strictEqual(response.status, 500);
    assert.strictEqual(response.body.message, "Internal server error");

    stub.restore();
  });
});
