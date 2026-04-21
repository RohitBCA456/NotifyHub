import { it, describe, mock } from "node:test";
import assert from "assert";
import esmock from "esmock";
import { getCacheNotificationPreference } from "../../../controllers/notification.controller.js";
import mongoose from "mongoose";

const APP_ID = new mongoose.Types.ObjectId().toString();

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

describe("Get Cache Notification Preference Controller", () => {
  it("should return 400 if field is missing", async () => {
    const req = {
      body: {
        appId: "",
      },
    };

    const res = createRes();

    await getCacheNotificationPreference(req, res);

    assert.strictEqual(res.getStatus(), 400);
    assert.deepStrictEqual(res.getJson(), {
      message: "appId is required",
    });
  });

  it("should return 404 if preference is not found on cache", async () => {
    const req = {
      body: {
        appId: APP_ID,
      },
    };

    const res = createRes();

    const redisMock = { hGetAll: mock.fn(async () => null) };

    const { getCacheNotificationPreference } = await esmock(
      "../../../controllers/notification.controller.js",
      {
        "../../../config/redis.js": { client: redisMock },
      },
    );

    await getCacheNotificationPreference(req, res);

    assert.strictEqual(res.getStatus(), 404);
    assert.deepStrictEqual(res.getJson(), {
      message: "Preference not found on cache",
    });
  });

  it("should return 500 if there is an error during cache retrieval", async () => {
    const req = {
      body: {
        appId: APP_ID,
      },
    };

    const res = createRes();

    const redisMock = {
      hGetAll: mock.fn(async () => {
        throw Error("Redis error");
      }),
    };

    const { getCacheNotificationPreference } = await esmock(
      "../../../controllers/notification.controller.js",
      {
        "../../../config/redis.js": { client: redisMock },
      },
    );

    await getCacheNotificationPreference(req, res);

    assert.strictEqual(res.getStatus(), 500);
    assert.deepStrictEqual(res.getJson(), {
      message: "Internal Server Error",
      err: "Redis error",
    });
  });

  it("should return 200 with preference data if found on cache", async () => {
    const req = {
      body: {
        appId: APP_ID,
      },
    };

    const res = createRes();

    const redisMock = {
      hGetAll: mock.fn(async () => ({ key1: "value1", key2: "value2" })),
    };

    const { getCacheNotificationPreference } = await esmock(
      "../../../controllers/notification.controller.js",
      {
        "../../../config/redis.js": { client: redisMock },
      },
    );

    await getCacheNotificationPreference(req, res);

    assert.strictEqual(res.getStatus(), 200);
    assert.deepStrictEqual(res.getJson(), {
      key1: "value1",
      key2: "value2",
    });
  });
});
