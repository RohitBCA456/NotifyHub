import { describe, it, mock } from "node:test";
import assert from "node:assert";
import { logoutUser } from "../../controllers/user.controller.js";
import { User } from "../../models/user.model.js";

const VALID_USER_ID = "65d62d98f1a2b3c4d5e6f7a8";

function createRes() {
  let statusCode = null;
  let jsonData = null;
  let clearCookies = [];

  return {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      jsonData = data;
      return this;
    },
    clearCookie(name, options) {
      clearCookies.push({ name, options });
      return this;
    },
    getStatus: () => statusCode,
    getJson: () => jsonData,
    getCookies: () => clearCookies,
  };
}

describe("logout controller", () => {
  it("should return 400 if userId is missing", async () => {
    const req = { userId: "" };
    const res = createRes();

    await logoutUser(req, res);

    assert.strictEqual(res.getStatus(), 400);
    assert.deepStrictEqual(res.getJson(), {
      message: "userId is missing",
    });
  });

  it("should logout a user and return statusCode 200", async () => {
    const req = { userId: VALID_USER_ID };
    const res = createRes();
    const fakeUser = { _id: VALID_USER_ID, webToken: null, sessionId: null };

    const updateMock = mock.method(User, "findByIdAndUpdate", async () => fakeUser);

    await logoutUser(req, res);

    assert.strictEqual(res.getStatus(), 200);
    assert.strictEqual(updateMock.mock.callCount(), 1);
    
    const cookies = res.getCookies();
    assert.strictEqual(cookies.length, 1);
    assert.strictEqual(cookies[0].name, "webToken");

    assert.deepStrictEqual(res.getJson(), {
      message: "User logged out successfully.",
    });

    mock.restoreAll();
  });

  it("should return 404 if user is not found in the DB", async () => {
    const req = { userId: VALID_USER_ID };
    const res = createRes();

    mock.method(User, "findByIdAndUpdate", async () => null);

    await logoutUser(req, res);

    assert.strictEqual(res.getStatus(), 404);
    assert.deepStrictEqual(res.getJson(), {
      message: "User not found in DB",
    });

    mock.restoreAll();
  });

  it("should return 500 if database update fails", async () => {
    const req = { userId: VALID_USER_ID };
    const res = createRes();

    mock.method(User, "findByIdAndUpdate", async () => {
      throw new Error("DB Connection Error");
    });

    await logoutUser(req, res);

    assert.strictEqual(res.getStatus(), 500);
    assert.deepStrictEqual(res.getJson(), {
      message: "Internal server error",
      error: "DB Connection Error"
    });

    mock.restoreAll();
  });
});