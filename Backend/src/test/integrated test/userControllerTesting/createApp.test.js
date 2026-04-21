import { test, describe, before, beforeEach, after } from "node:test";
import request from "supertest";
import assert from "assert";
import { clearDB, closeDB, connectDB } from "../../../config/db.js";
import {
  clearRedis,
  client,
  closeRedis,
  connectRedis,
} from "../../../config/redis.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { app } from "../../../../app.js";
import dotenv from "dotenv";
import sinon from "sinon";
import { App } from "../../../models/app.model.js";
import { closeRabbitMQ } from "../../../config/rabbitmq.js";

dotenv.config();

const VALID_ID = new mongoose.Types.ObjectId().toString();
const SECRET = process.env.JWT_SECRET;

describe("POST /create-app", () => {
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

  test("should return 400 if any field is missing", async () => {
    const token = jwt.sign({ id: VALID_ID }, SECRET);

    const payLoad = {
      name: "",
      channel: ["email", "sms"],
      quietHours: {
        enabled: true,
        start: "2:00",
        end: "12:00",
      },
    };

    const response = await request(app)
      .post("/api/users/create-app")
      .set("Cookie", `webToken=${token}`)
      .send(payLoad);

    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.message, "App name is required.");
  });

  test("should create an app and return 201", async () => {
    const payLoad = {
      name: "ServiceAgent",
      channel: ["email", "sms"],
      quietHours: {
        enabled: true,
        start: "2:00",
        end: "12:00",
      },
    };

    const token = jwt.sign({ id: VALID_ID }, SECRET);

    const response = await request(app)
      .post("/api/users/create-app")
      .set("Cookie", `webToken=${token}`)
      .send(payLoad);

    assert.strictEqual(response.status, 201);
    assert.strictEqual(response.body.message, "App created successfully.");

    const createdApp = response.body.app;

    assert.ok(createdApp._id, "should have _id");
    assert.strictEqual(createdApp.name, payLoad.name);
    assert.ok(createdApp.apiKey, "should have apiKey");

    assert.ok(Array.isArray(createdApp.channel));
    assert.strictEqual(createdApp.channel.length, 2);
    assert.ok(createdApp.channel.includes("email"));

    const key = `pref:${createdApp._id}`;
    const cachedPref = await client.hGetAll(key);

    // console.log("cachedPref:", cachedPref);

    const parsedPreferences = JSON.parse(cachedPref.preferences);
    const parsedQuietHours = JSON.parse(cachedPref.quietHours);

    assert.strictEqual(parsedPreferences.email, true);
    assert.strictEqual(parsedPreferences.sms, true);
    assert.strictEqual(parsedPreferences.inapp, false);

    assert.deepStrictEqual(parsedQuietHours, payLoad.quietHours);
  });

  test("should 500 if error occurs", async () => {
    const payLoad = {
      name: "ServiceAgent",
      channel: ["email", "sms"],
      quietHours: {
        enabled: true,
        start: "2:00",
        end: "12:00",
      },
    };

    const token = jwt.sign({ id: VALID_ID }, SECRET);

    const stub = sinon.stub(App, "create").throws(new Error("Database Error"));

    const response = await request(app)
      .post("/api/users/create-app")
      .set("Cookie", `webToken=${token}`)
      .send(payLoad);

    assert.strictEqual(response.status, 500);
    assert.strictEqual(response.body.message, "Internal server error.");
    assert.strictEqual(response.body.error, "Database Error");

    stub.restore();
  });
});
