import { test, describe, before, after, beforeEach } from "node:test";
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

let sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const VALID_ID = new mongoose.Types.ObjectId().toString();
const SECRET = process.env.JWT_SECRET;

describe("POST send-notification", () => {
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
  });

  after(async () => {
    await sleep(5000);
    await closeRabbitMQ();
    await closeDB();
    await closeRedis();
  });

  test("should return 403 if invalid apiKey or appId", async () => {
    const payLoad = {
      appId: new mongoose.Types.ObjectId().toString(),
      channels: ["sms", "email"],
      targets: ["+919365251448", "rohit7120yadav@gmail.com"],
      subject: "test in process",
      message: "test in process",
    };

    const token = jwt.sign({ id: VALID_ID }, SECRET);

    const response = await request(app)
      .post("/api/notifications/send-notification")
      .set("x-api-key", "invalid_api_key")
      .set("Cookie", [`webToken=${token}`])
      .send(payLoad);

    assert.strictEqual(response.status, 403);
    assert.strictEqual(response.body.message, "Invalid API key or app ID.");
  });

  test("should return 400 if user has not opt on of the channel", async () => {
    const token = jwt.sign({ id: VALID_ID }, SECRET);

    const existingApp = await App.create({
      name: "serviceProvider",
      userId: VALID_ID,
      apiKey: generateApiKey(),
    });

    const payLoad = {
      appId: existingApp._id.toString(),
      channels: ["email"],
      targets: { email: "rohit7120yadav@gmail.com" },
      subject: "test in process",
      message: "test in process",
    };

    await UserPreference.create({
      appId: existingApp._id,
      userId: VALID_ID,
      preferences: {
        sms: true,
        email: false,
      },
    });

    const response = await request(app)
      .post("/api/notifications/send-notification")
      .set("x-api-key", existingApp?.apiKey)
      .set("Cookie", [`webToken=${token}`])
      .send(payLoad);

    console.log(`response body: ${response.body}`);

    assert.strictEqual(response.status, 400);
    assert.strictEqual(
      response.body.message,
      `User has opted out of email notifications.`,
    );
  });

  test("should return 201 if notification is queued successfully", async () => {
    const ch = getChannel();

    const realSendToQueue = ch.sendToQueue.bind(ch);
    ch.sendToQueue = () => {
      console.log("Mocked channel.sendToQueue — skipping RabbitMQ");
      return true;
    };

    const token = jwt.sign({ id: VALID_ID }, SECRET);

    const existingApp = await App.create({
      name: "serviceProvider",
      userId: VALID_ID,
      apiKey: generateApiKey(),
    });

    const payLoad = {
      appId: existingApp._id.toString(),
      channels: ["email"],
      targets: { email: "rohit7120yadav@gmail.com" },
      subject: "test in process",
      message: "test in process",
    };

    await UserPreference.create({
      appId: existingApp._id,
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

    const notification = await Notification.findOne({ appId: existingApp._id });
    assert.ok(notification, "Notification should exist in DB");
    assert.strictEqual(notification.status, "pending"); 

    ch.sendToQueue = realSendToQueue;
  });

  test("should return 500 if error occurs", async () => {
    const token = jwt.sign({ id: VALID_ID }, SECRET);

    const existingApp = await App.create({
      name: "serviceProvider",
      userId: VALID_ID,
      apiKey: generateApiKey(),
    });

    const payLoad = {
      appId: existingApp._id.toString(),
      channels: ["email"],
      targets: { email: "rohit7120yadav@gmail.com" },
      subject: "test in process",
      message: "test in process",
    };

    await UserPreference.create({
      appId: existingApp._id,
      userId: VALID_ID,
      preferences: {
        sms: false,
        email: true,
      },
      quietHours: {
        enabled: true,
        start: "22:00",
        end: "3:00",
      },
    });

    const stub = sinon
      .stub(Notification, "create")
      .throws(new Error("Database Error"));

    const response = await request(app)
      .post("/api/notifications/send-notification")
      .set("x-api-key", existingApp.apiKey)
      .set("Cookie", [`webToken=${token}`])
      .send(payLoad);

    assert.strictEqual(response.status, 500);
    assert.strictEqual(response.body.message, "Failed to create notification.");
    assert.strictEqual(response.body.error, "Database Error");

    stub.restore();
  });
});