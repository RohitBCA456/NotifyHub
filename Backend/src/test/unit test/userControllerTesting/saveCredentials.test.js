import { describe, it, mock } from "node:test";
import assert from "node:assert";
import { saveCredentials } from "../../../controllers/user.controller.js";
import { User } from "../../../models/user.model.js";
import { client } from "../../../config/redis.js";

const VALID_USER_ID = "65d62d98f1a2b3c4d5e6f7a8";

function createRes() {
  let statusCode = null;
  let jsonData = null;
  let cookies = [];
  let clearedCookies = [];

  return {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      jsonData = data;
      return this;
    },
    cookie(name, value, options) {
      cookies.push({ name, value, options });
      return this;
    },
    clearCookie(name, options) {
      clearedCookies.push({ name, options });
      return this;
    },
    getStatus: () => statusCode,
    getJson: () => jsonData,
    getCookies: () => cookies,
    getClearedCookies: () => clearedCookies,
  };
}

describe("saveCredentials Controller", () => {
  it("should return statusCode 201 and save new user in the DB", async () => {
    const fakeUser = {
      _id: VALID_USER_ID,
      username: "testUser",
      imageUrl: "test.png",
      email: "test@example.com",
      sessionId: "test#sessionId123$",
      webToken: null,
      generateWebToken: async () => "mocked_jwt_token",
    };

    const updatedUser = { ...fakeUser, webToken: "mocked_jwt_token" };

    const req = {
      body: {
        username: "testUser",
        imageUrl: "test.png",
        email: "test@example.com",
        sessionId: "test#sessionId123$",
      },
    };

    const findOneMock = mock.method(User, "findOne", async () => null);
    const createMock = mock.method(User, "create", async () => fakeUser);
    const findByIdAndUpdateMock = mock.method(
      User,
      "findByIdAndUpdate",
      async () => updatedUser,
    );
    const redisHIncrByMock = mock.method(client, "hIncrBy", async () => 1);
    const redisHSetMock = mock.method(client, "hSet", async () => ({}));
    const redisExpireMock = mock.method(client, "expire", async () => ({}));

    const res = createRes();
    await saveCredentials(req, res);

    assert.strictEqual(res.getStatus(), 201);
    assert.strictEqual(findOneMock.mock.callCount(), 1);
    assert.strictEqual(createMock.mock.callCount(), 1);
    assert.strictEqual(findByIdAndUpdateMock.mock.callCount(), 1);
    assert.strictEqual(redisHIncrByMock.mock.callCount(), 1);
    assert.strictEqual(redisHSetMock.mock.callCount(), 1);
    assert.strictEqual(redisExpireMock.mock.callCount(), 1);

    const cookies = res.getCookies();
    assert.strictEqual(cookies.length, 1);
    assert.strictEqual(cookies[0].name, "webToken");
    assert.strictEqual(cookies[0].value, "mocked_jwt_token");

    assert.strictEqual(
      res.getJson().message,
      "User credentials saved successfully.",
    );

    mock.restoreAll();
  });

  it("should update sessionId for existing user and return 201", async () => {
    const existingUser = {
      _id: VALID_USER_ID,
      username: "testUser",
      email: "test@example.com",
      sessionId: "OLD_SESSION",
      save: async () => {
        return this;
      },
      generateWebToken: async () => "new_token",
    };

    const updatedUser = { ...existingUser, webToken: "new_token" };

    const req = {
      body: {
        username: "testUser",
        imageUrl: "test.png",
        email: "test@example.com",
        sessionId: "NEW_SESSION",
      },
    };

    mock.method(User, "findOne", async () => existingUser);
    mock.method(User, "findByIdAndUpdate", async () => updatedUser);
    const redisHIncrByMock = mock.method(client, "hIncrBy", async () => 1);
    mock.method(client, "hSet", async () => ({}));
    mock.method(client, "expire", async () => ({}));

    const res = createRes();
    await saveCredentials(req, res);

    assert.strictEqual(existingUser.sessionId, "NEW_SESSION");
    assert.strictEqual(res.getStatus(), 201);
    assert.strictEqual(redisHIncrByMock.mock.callCount(), 0);

    mock.restoreAll();
  });

  it("should return 400 for missing required fields", async () => {
    const req = { body: { username: "testUser", email: "" } };
    const res = createRes();

    await saveCredentials(req, res);

    assert.strictEqual(res.getStatus(), 400);
    assert.deepStrictEqual(res.getJson(), {
      message: "Username, email, and sessionId are required.",
    });
  });

  it("should return 500 on internal server error", async () => {
    const req = {
      body: {
        username: "testUser",
        email: "test@example.com",
        sessionId: "test-sessionId",
        imageUrl: "test.png",
      },
    };

    mock.method(User, "findOne", async () => {
      throw new Error("Database Crashed");
    });

    const res = createRes();
    await saveCredentials(req, res);

    assert.strictEqual(res.getStatus(), 500);
    assert.deepStrictEqual(res.getJson(), {
      message: "Internal server error.",
      error: "Database Crashed",
    });

    mock.restoreAll();
  });
});
