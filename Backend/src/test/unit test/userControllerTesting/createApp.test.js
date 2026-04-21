import { describe, it, mock } from "node:test";
import assert from "node:assert";
import { createApp } from "../../../controllers/user.controller.js";
import { App } from "../../../models/app.model.js";
import { UserPreference } from "../../../models/userPreference.model.js";
import { client } from "../../../config/redis.js";

const VALID_USER_ID = "65d62d98f1a2b3c4d5e6f7a8";

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

describe("create App controller", () => {
  it("should return 400 if fields are missing", async () => {
    const req = {
      body: { name: "", channel: ["sms"] },
    };
    const res = createRes();

    await createApp(req, res);

    assert.strictEqual(res.getStatus(), 400);
    assert.deepStrictEqual(res.getJson(), {
      message: "App name is required.",
    });
  });

  it("should create app successfully and verify Redis/Database calls", async () => {
    const req = {
      body: { name: "testApp", channel: ["email"] },
      userId: VALID_USER_ID,
    };
    const res = createRes();

    const fakeApp = {
      _id: "65d62d98f1a2b3c4d5e6f7b9",
      name: "testApp",
      channel: ["email"],
      userId: VALID_USER_ID,
      apiKey: "fx9errif993",
    };

    const appCreateMock = mock.method(App, "create", async () => fakeApp);
    const prefMock = mock.method(UserPreference, "findOneAndUpdate", async () => ({}));
    const redisHSetMock = mock.method(client, "hSet", async () => ({}));
    const redisExpireMock = mock.method(client, "expire", async () => ({}));

    await createApp(req, res);

    assert.strictEqual(res.getStatus(), 201);
    assert.strictEqual(appCreateMock.mock.callCount(), 1);
    assert.strictEqual(prefMock.mock.callCount(), 1);
    assert.strictEqual(redisHSetMock.mock.callCount(), 1);

    assert.deepStrictEqual(res.getJson(), {
      message: "App created successfully.",
      app: fakeApp,
    });

    mock.restoreAll();
  });

  it("should return 201 and normalize channel if it is a string or missing", async () => {
    const req = {
      body: { name: "testApp", channel: "email" },
      userId: VALID_USER_ID,
    };
    const res = createRes();

    const fakeApp = {
      _id: "65d62d98f1a2b3c4d5e6f7b9",
      name: "testApp",
      channel: [],
      userId: VALID_USER_ID,
      apiKey: "fx9errif993",
    };

    mock.method(App, "create", async () => fakeApp);
    mock.method(UserPreference, "findOneAndUpdate", async () => ({}));
    mock.method(client, "hSet", async () => ({}));
    mock.method(client, "expire", async () => ({}));

    await createApp(req, res);

    assert.strictEqual(res.getStatus(), 201);
    assert.deepStrictEqual(res.getJson().app.channel, []);

    mock.restoreAll();
  });

  it("should return 500 if an internal error occurs during creation", async () => {
    const req = {
      body: { name: "testApp" },
      userId: VALID_USER_ID,
    };
    const res = createRes();

    mock.method(App, "create", async () => {
      throw new Error("DB Failure");
    });

    await createApp(req, res);

    assert.strictEqual(res.getStatus(), 500);
    assert.deepStrictEqual(res.getJson(), {
      message: "Internal server error.",
      error: "DB Failure"
    });

    mock.restoreAll();
  });
});