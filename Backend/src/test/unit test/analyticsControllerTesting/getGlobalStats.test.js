import { it, describe, mock } from "node:test";
import assert from "assert";
import esmock from "esmock";
import { User } from "../../../models/user.model.js";
import { Notification } from "../../../models/notification.model.js";
import { getGlobalStats } from "../../../controllers/analytics.controller.js";

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

describe("Analytics Controller", () => {
  it("should return global stats successfully on cache hit", async () => {
    const redisMock = {
      hGetAll: mock.fn(async () => ({
        totalMembers: "5",
        totalNotifications: "10",
      })),
    };

    const { getGlobalStats } = await esmock(
      "../../../controllers/analytics.controller.js",
      {
        "../../../config/redis.js": { client: redisMock },
      },
    );

    const req = {};

    const res = createRes();

    await getGlobalStats(req, res);

    assert.strictEqual(res.getStatus(), 200);
    assert.deepStrictEqual(res.getJson(), {
      totalMembers: 5,
      totalNotifications: 10,
    });
  });

  it("should return global stats successfully on cache miss", async () => {
    const redisMock = {
      hGetAll: mock.fn(async () => null),
      hSet: mock.fn(async () => {}),
      expire: mock.fn(async () => {}),
    };

    const { getGlobalStats } = await esmock(
      "../../../controllers/analytics.controller.js",
      {
        "../../../config/redis.js": { client: redisMock },
      },
    );

    const req = {};

    const res = createRes();

    mock.method(User, "countDocuments", async () => 5);
    mock.method(Notification, "countDocuments", async () => 10);

    await getGlobalStats(req, res);

    assert.strictEqual(res.getStatus(), 200);
    assert.deepStrictEqual(res.getJson(), {
      totalMembers: 5,
      totalNotifications: 10,
    });
  });

  it("should return 500 if there is an error", async () => {
    const redisMock = {
      hGetAll: mock.fn(async () => null),
      hSet: mock.fn(async () => {}),
      expire: mock.fn(async () => {}),
    };

    const { getGlobalStats } = await esmock(
      "../../../controllers/analytics.controller.js",
      {
        "../../../config/redis.js": { client: redisMock },
      },
    );

    const req = {};

    const res = createRes();

    mock.method(User, "countDocuments", async () => {
      throw Error("DB error");
    });

    await getGlobalStats(req, res);

    assert.strictEqual(res.getStatus(), 500);
    assert.deepStrictEqual(res.getJson(), {
      message: "Internal server error",
    });
  });
});
