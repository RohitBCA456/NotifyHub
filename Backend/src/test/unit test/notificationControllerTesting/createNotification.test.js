import { describe, it, mock } from "node:test";
import assert from "assert";
import esmock from "esmock";
import { createNotification } from "../../../controllers/notification.controller.js";
const { App } = await import("../../../models/app.model.js");
const { UserPreference } = await import("../../../models/userPreference.model.js");
const { Notification } = await import("../../../models/notification.model.js");

function createRes() {
  let statusCode = null;
  let jsonData = null;

  return {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      jsonData = data;
      return this;
    },
    getStatus: () => statusCode,
    getJson: () => jsonData,
  };
}

describe("Create Notification Controller", () => {
  it("should return 201 if notification is published successfully", async () => {
    const publishMockFn = mock.fn(async () => Promise.resolve(true));

    const { createNotification } = await esmock(
      "../../../controllers/notification.controller.js",
      {
        "../../../config/rabbitmq.js": {
          publishToQueue: publishMockFn,
          connect: async () => {},
        },
      },
    );

    const req = {
      body: {
        appId: "app_123",
        channels: ["email"],
        targets: { email: "test@test.com" },
      },
      headers: { "x-api-key": "actual-valid-key" },
      userId: "user_123",
    };

    const res = createRes();

    mock.method(App, "findById", () => ({
      select: () => ({ apiKey: "actual-valid-key" }),
    }));

    mock.method(UserPreference, "findOne", async () => ({
      preferences: { email: true },
    }));

    mock.method(Notification, "create", async () => ({ id: "123" }));

    await createNotification(req, res);

    assert.strictEqual(res.getStatus(), 201);
    assert.strictEqual(publishMockFn.mock.callCount(), 1);

    mock.restoreAll();
  });

  it("should return 403 for invalid API KEY or AppId", async () => {
    const req = {
      body: {
        appId: "app_123",
        channels: ["email"],
        targets: { email: "test@test.com" },
      },
      headers: { "x-api-key": "actual-valid-key" },
      userId: "user_123",
    };

    const res = createRes();

    mock.method(App, "findById", () => ({
      select: () => ({ apiKey: "Invalid-Key" }),
    }));

    await createNotification(req, res);

    assert.strictEqual(res.getStatus(), 403);
    assert.deepStrictEqual(res.getJson(), {
      message: "Invalid API key or app ID.",
    });

    mock.restoreAll();
  });

  it("should return 400 if the user has not opted the channel", async () => {
    const req = {
      body: {
        appId: "app_123",
        channels: ["email"],
        targets: { email: "test@test.com" },
      },
      headers: { "x-api-key": "actual-valid-key" },
      userId: "user_123",
    };

    const res = createRes();

    mock.method(App, "findById", () => ({
      select: () => ({ apiKey: "actual-valid-key" }),
    }));

    mock.method(UserPreference, "findOne", () => ({
      preferences: {
        email: false,
        sms: true,
      },
    }));

    await createNotification(req, res);

    assert.strictEqual(res.getStatus(), 400);
    assert.deepStrictEqual(res.getJson(), {
          message: "User has opted out of email notifications."
    })

    mock.restoreAll();
  });
});
