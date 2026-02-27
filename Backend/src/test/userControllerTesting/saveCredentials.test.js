import { describe, it, mock } from "node:test";
import assert from "node:assert";
import { saveCredentials } from "../../controllers/user.controller.js";
import { User } from "../../models/user.model.js";
import { client } from "../../config/redis.js";

const VALID_USER_ID = "65d62d98f1a2b3c4d5e6f7a8";

function createRes() {
  let statusCode = null;
  let jsonData = null;
  let cookies = [];

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
    getStatus: () => statusCode,
    getJson: () => jsonData,
    getCookies: () => cookies,
  };
}

describe("Save Credentials Controller", () => {
  it("should return statusCode 201 and save userData in the DB", async () => {
    const fakeUser = {
      _id: VALID_USER_ID,
      username: "testUser",
      imageUrl: "test.png",
      email: "test@example.com",
      sessionId: "test#sessionId123$",
      generateWebToken: async () => "mocked_jwt_token",
      save: async () => {},
    };

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
    const redisHSetMock = mock.method(client, "hSet", async () => ({}));
    const redisExpireMock = mock.method(client, "expire", async () => ({}));

    const res = createRes();

    await saveCredentials(req, res);

    assert.strictEqual(res.getStatus(), 201);
    assert.strictEqual(createMock.mock.callCount(), 1);
    assert.strictEqual(redisHSetMock.mock.callCount(), 1);

    const cookies = res.getCookies();
    assert.strictEqual(cookies.length, 1);
    assert.strictEqual(cookies[0].name, "webToken");
    assert.strictEqual(cookies[0].value, "mocked_jwt_token");

    mock.restoreAll();
  });

  it("should update sessionId for existing user", async () => {
    const existingUser = {
      _id: VALID_USER_ID,
      username: "testUser",
      email: "test@example.com",
      sessionId: "OLD_SESSION",
      generateWebToken: async () => "new_token",
      save: async () => {},
    };

    const req = {
      body: {
        username: "testUser",
        email: "test@example.com",
        sessionId: "NEW_SESSION",
        imageUrl: "test.png",
      },
    };

    mock.method(User, "findOne", async () => existingUser);
    mock.method(client, "hSet", async () => ({}));
    mock.method(client, "expire", async () => ({}));

    const res = createRes();

    await saveCredentials(req, res);

    assert.strictEqual(existingUser.sessionId, "NEW_SESSION");
    assert.strictEqual(res.getStatus(), 201);
    
    mock.restoreAll();
  });

  it("should return statusCode 400 for missing fields", async () => {
    const req = { body: { username: "testUser", email: "" } };
    const res = createRes();

    await saveCredentials(req, res);

    assert.strictEqual(res.getStatus(), 400);
    assert.deepStrictEqual(res.getJson(), {
      message: "Username, email, and sessionId are required.",
    });
  });

  it("should return statusCode 500 for internal server error", async () => {
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