import { test, describe, before, after, beforeEach, afterEach } from "node:test";
import { clearDB, closeDB, connectDB } from "../../../config/db.js";
import { clearRedis, closeRedis, connectRedis } from "../../../config/redis.js";
import { closeRabbitMQ, connect, getChannel } from "../../../config/rabbitmq.js";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../../../app.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import assert from "assert";
import { App } from "../../../models/app.model.js";
import { generateApiKey } from "../../../utils/generateApiKey.js";
import { UserPreference } from "../../../models/userPreference.model.js";
import { Notification } from "../../../models/notification.model.js";
import sinon from "sinon";

dotenv.config();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const SECRET = process.env.JWT_SECRET;

describe("POST send-notification", () => {
  let realSendToQueue;

  before(async () => {
    await connectDB();
    await connectRedis();
    await connect();

    const ch = getChannel();
    await ch.purgeQueue("notification_queue");
    await ch.purgeQueue("notification_delay_queue");
    console.log("Queues purged");
  });

  beforeEach(async () => {
    await clearDB();
    await clearRedis();

    // Mock sendToQueue for EVERY test so no real messages ever get queued
    const ch = getChannel();
    realSendToQueue = ch.sendToQueue.bind(ch);
    ch.sendToQueue = () => {
      console.log("Mocked channel.sendToQueue — skipping RabbitMQ");
      return true;
    };
  });

  afterEach(async () => {
    // Always restore sendToQueue after every test regardless of pass/fail
    const ch = getChannel();
    if (ch && realSendToQueue) {
      ch.sendToQueue = realSendToQueue;
    }
  });

  after(async () => {
    await sleep(5000);
    await closeRabbitMQ();
    await closeDB();
    await closeRedis();
  });

  test("should return 403 if invalid apiKey or appId", async () => {
    // Fresh ID per test — no shared state
    const VALID_ID = new mongoose.Types.ObjectId().toString();
    const token = jwt.sign({ id: VALID_ID }, SECRET);

    const payLoad = {
      appId: new mongoose.Types.ObjectId().toString(),
      channels: ["sms", "email"],
      targets: ["+9169879686", `test@example.com:${Date.now()}`],
      subject: "test in process",
      message: "test in process",
    };

    const response = await request(app)
      .post("/api/notifications/send-notification")
      .set("x-api-key", "invalid_api_key")
      .set("Cookie", [`webToken=${token}`])
      .send(payLoad);

    assert.strictEqual(response.status, 403);
    assert.strictEqual(response.body.message, "Invalid API key or app ID.");
  });

  test("should return 400 if user has not opt on of the channel", async () => {
    const VALID_ID = new mongoose.Types.ObjectId().toString();
    const token = jwt.sign({ id: VALID_ID }, SECRET);

    const existingApp = await App.create({
      name: "service agent",
      userId: VALID_ID,
      apiKey: generateApiKey(),
    });

    const payLoad = {
      appId: existingApp._id.toString(),
      channels: ["email"],
      targets: { email: `test@example.com:${Date.now()}` },
      subject: "test in process",
      message: "test in process",
    };

    await UserPreference.create({
      appId: existingApp._id.toString(),
      userId: VALID_ID,
      preferences: { sms: true, email: false },
    });

    const response = await request(app)
      .post("/api/notifications/send-notification")
      .set("x-api-key", existingApp?.apiKey)
      .set("Cookie", [`webToken=${token}`])
      .send(payLoad);

    assert.strictEqual(response.status, 400);
    assert.strictEqual(
      response.body.message,
      `User has opted out of email notifications.`,
    );
  });

  test("should return 201 if notification is queued successfully", async () => {
    const VALID_ID = new mongoose.Types.ObjectId().toString();
    const token = jwt.sign({ id: VALID_ID }, SECRET);

    const existingApp = await App.create({
      name: "test agent",
      userId: VALID_ID,
      apiKey: generateApiKey(),
    });

    const payLoad = {
      appId: existingApp._id.toString(),
      channels: ["email"],
      targets: { email: `test@example.com:${Date.now()}` },
      subject: "test in process",
      message: "test in process",
    };

    await UserPreference.create({
      appId: existingApp._id.toString(),
      userId: VALID_ID,
      preferences: { sms: false, email: true },
      quietHours: { enabled: false },
    });

    const response = await request(app)
      .post("/api/notifications/send-notification")
      .set("x-api-key", existingApp.apiKey)
      .set("Cookie", [`webToken=${token}`])
      .send(payLoad);

    assert.strictEqual(response.status, 201);
    assert.strictEqual(response.body.message, "Notifications queued successfully");

    // No sleep needed — consumer never ran since sendToQueue was mocked
    const notification = await Notification.findOne({ appId: existingApp._id });
    assert.ok(notification, "Notification should exist in DB");
    assert.strictEqual(notification.status, "pending");
  });

  test("should return 500 if error occurs", async () => {
    const VALID_ID = new mongoose.Types.ObjectId().toString();
    const token = jwt.sign({ id: VALID_ID }, SECRET);

    const existingApp = await App.create({
      name: "test agent",
      userId: VALID_ID,
      apiKey: generateApiKey(),
    });

    const payLoad = {
      appId: existingApp._id.toString(),
      channels: ["email"],
      targets: { email: `test@example.com:${Date.now()}` },
      subject: "test in process",
      message: "test in process",
    };

    await UserPreference.create({
      appId: existingApp._id.toString(),
      userId: VALID_ID,
      preferences: { sms: false, email: true },
      quietHours: { enabled: true, start: "22:00", end: "3:00" },
    });

    const stub = sinon
      .stub(Notification, "create")
      .throws(new Error("Database Error"));

    try {
      const response = await request(app)
        .post("/api/notifications/send-notification")
        .set("x-api-key", existingApp.apiKey)
        .set("Cookie", [`webToken=${token}`])
        .send(payLoad);

      assert.strictEqual(response.status, 500);
      assert.strictEqual(response.body.message, "Failed to create notification.");
      assert.strictEqual(response.body.error, "Database Error");
    } finally {
      // Always restores even if assertions fail
      stub.restore();
    }
  });
});