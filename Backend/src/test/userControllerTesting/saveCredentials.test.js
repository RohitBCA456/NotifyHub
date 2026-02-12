import { describe, it, beforeEach } from "node:test";
import { User } from "../../models/user.model.js";
import assert from "assert";
import { saveCredentials } from "../../controllers/user.controller.js";

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
  beforeEach(() => {
    User.findOne = async () => null;
    User.create = async () => null;
  });

  it("should return statusCode 201 and save userData in the DB", async () => {
    const fakeUser = {
      username: "testUser",
      imageUrl: "test.png",
      email: "test@example.com",
      sessionId: "test#sessionId123$",
      generateWebToken: async () => "8c7r89rufe232e3dn",
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

    User.findOne = async () => null;
    User.create = async () => fakeUser;

    const res = createRes();

    await saveCredentials(req, res);

    assert.strictEqual(res.getStatus(), 201);

    assert.deepStrictEqual(res.getJson(), {
      message: "User credentials saved successfully.",
      user: fakeUser,
    });

    const cookies = res.getCookies();

    assert.strictEqual(cookies.length, 1);
    assert.strictEqual(cookies[0].name, "webToken");
    assert.strictEqual(cookies[0].value, "8c7r89rufe232e3dn");
    assert.deepStrictEqual(cookies[0].options, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "none",
    });
  });

  it("should update sessionId for existing user", async () => {
    const existingUser = {
      username: "testUser",
      imageUrl: "test.png",
      email: "test@example.com",
      sessionId: "OLD_SESSION",
      generateWebToken: async () => "8c7r89rufe232e3dn",
      save: async () => {},
    };

    const req = {
      body: {
        username: "testUser",
        imageUrl: "test.png",
        email: "test@example.com",
        sessionId: "NEW_SESSION",
      },
    };

    User.findOne = async () => existingUser;

    const res = createRes();

    await saveCredentials(req, res);

    assert.strictEqual(existingUser.sessionId, "NEW_SESSION");

    assert.strictEqual(res.getStatus(), 201);

    const cookies = res.getCookies();
    assert.strictEqual(cookies.length, 1);
  });

  it("should return statusCode 400 for missing fields", async () => {
    const req = {
      body: {
        username: "testUser",
        imageUrl: "test.png",
        email: "",
        sessionId: "test#sessionId123$",
      },
    };

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

    User.findOne = async () => {
      throw new Error("Database Crashed");
    }

    const res = createRes();

    await saveCredentials(req, res);

    assert.strictEqual(res.getStatus(), 500);
    assert.deepStrictEqual(res.getJson(), {
      message: "Internal server error.",
      error: "Database Crashed",
    });
  });
});
