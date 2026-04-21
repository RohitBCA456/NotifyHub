import { describe, it, mock } from "node:test";
import { getCacheProfile } from "../../../controllers/user.controller.js";
import { client } from "../../../config/redis.js";
import assert from "assert";

const VALID_ID = "65d62d98f1a2b3c4d5e6f7a8";

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

describe("Get Cache Profile Controller", () => {
  it("should return 404 if Cache Miss", async () => {
    const redishGetAllMock = mock.method(client, "hGetAll", async () => ({}));

    const req = {
      body: {
        userId: VALID_ID,
      },
    };

    const res = createRes();

    await getCacheProfile(req, res);

    assert.strictEqual(res.getStatus(), 404);
    assert.strictEqual(redishGetAllMock.mock.calls.length, 1);

    assert.deepStrictEqual(res.getJson(), {
      message: "Cache Miss",
    });

    mock.restoreAll();
  });

  it("should return 200 if Cache Hit", async () => {
    const fakeCacheUser = {
      username: "testUser",
      email: "test@example.com",
      imageUrl: "test.png",
    };

    const redishGetAllMock = mock.method(
      client,
      "hGetAll",
      async () => fakeCacheUser,
    );

    const req = {
      body: {
        userId: VALID_ID,
      },
    };

    const res = createRes();

    await getCacheProfile(req, res);

    assert.strictEqual(res.getStatus(), 200);
    assert.strictEqual(redishGetAllMock.mock.calls.length, 1);

    assert.deepStrictEqual(res.getJson(), {
      message: "Cache Hit",
      user: fakeCacheUser,
    });

    mock.restoreAll();
  });

  it("should return 500 if internal server error occurs", async () => {
    const fakeCacheUser = {
      username: "testUser",
      email: "test@example.com",
      imageUrl: "test.png",
    };

    const redishGetAllMock = mock.method(client, "hGetAll", async () => {
      throw new Error("Redis Error");
    });

    const req = {
      body: {
        userId: VALID_ID,
      },
    };

    const res = createRes();

    await getCacheProfile(req, res);

    assert.strictEqual(res.getStatus(), 500);
    assert.deepStrictEqual(res.getJson(), {
      message: "Internal Server Error",
      err: "Redis Error",
    });

    mock.restoreAll();
  });
});
