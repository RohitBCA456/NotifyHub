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
import sinon from "sinon";
import { app } from "../../../../app.js";
import { clearDB, closeDB, connectDB } from "../../../config/db.js";
import {
  clearRedis,
  client,
  closeRedis,
  connectRedis,
} from "../../../config/redis.js";
import { closeRabbitMQ } from "../../../config/rabbitmq.js";
import { User } from "../../../models/user.model.js";
import { Notification } from "../../../models/notification.model.js";
import { App } from "../../../models/app.model.js";
import { generateApiKey } from "../../../utils/generateApiKey.js";

describe("GET /stats", () => {
  before(async () => {
    await connectDB();
    await connectRedis();
  });

  beforeEach(async () => {
    await clearDB();
    await clearRedis();
  });

  afterEach(() => {
    sinon.restore();
  });

  after(async () => {
    await closeDB();
    await closeRedis();
    await closeRabbitMQ();
  });

  test("should return data from DB (cache miss)", async () => {
    const user = await User.create({
      username: "test_user",
      imageUrl: "test.png",
      email: "test@example.com",
      sessionId: "TEST_SESSION_ID",
      webToken: "test_token",
    });

    const testApp = await App.create({
      name: "service provider",
      userId: user._id,
      channel: ["email", "sms"],
      apiKey: generateApiKey(),
    });

    await Notification.create({
      userId: user?._id,
      appId: testApp?._id,
      channel: "email",
      status: "sent",
    });

    const response = await request(app).get("/api/analytics/stats");

    console.log(
      `response body: ${(response.body?.totalMembers, response.body?.totalNotifications)}`,
    );

    assert.strictEqual(response?.status, 200);
    assert.strictEqual(response.body?.totalMembers, 1);
    assert.strictEqual(response.body?.totalNotifications, 1);
  });

  test("should return data from cache (cache hit)", async () => {
    await client.hSet(`GStats`, {
      totalMembers: "5",
      totalNotifications: "10",
    });

    const response = await request(app).get("/api/analytics/stats");

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body?.totalMembers, 5);
    assert.strictEqual(response.body?.totalNotifications, 10);
  });

  test("should return 500 if an error occurs", async () => {
    sinon.stub(client, "hGetAll").rejects(new Error("Redis failure"));

    const response = await request(app).get("/api/analytics/stats");

    assert.strictEqual(response.status, 500);
    assert.strictEqual(response.body.message, "Internal server error");
  });
});
