import { it, describe, mock } from "node:test";
import assert from "assert";
import { getCacheProjectStats } from "../../../controllers/analytics.controller.js";
import esmock from "esmock";

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

describe("Get Project Cache Stats Controller", () => {
  it("should return 400 if projectId is missing", async () => {
    const req = {
      params: {
        projectId: "",
      },
    };

    const res = createRes();

    await getCacheProjectStats(req, res);

    assert.strictEqual(res.getStatus(), 400);
    assert.deepStrictEqual(res.getJson(), {
      message: "Project ID is required",
    });
  });

  it("should return project stats from cache successfully", async () => {
    const req = {
      params: {
        projectId: "project_123",
      },
    };

    const res = createRes();

    const data = {
      totalSent: "100",
      successRate: "80",
    };

    const redisMock = {
      hGetAll: mock.fn(async () => {
        return data;
      }),
    };

    const { getCacheProjectStats } = await esmock(
      "../../../controllers/analytics.controller.js",
      {
        "../../../config/redis.js": { client: redisMock },
      },
    );

    await getCacheProjectStats(req, res);

    assert.strictEqual(res.getStatus(), 200);
    assert.deepStrictEqual(res.getJson(), data);
  });

  it("should return 404 if cache miss occurs", async () => {
    const req = {
      params: {
        projectId: "project_123",
      },
    };

    const res = createRes();

    const redisMock = {
      hGetAll: mock.fn(async () => null),
    };

    const { getCacheProjectStats } = await esmock(
      "../../../controllers/analytics.controller.js",
      {
        "../../../config/redis.js": { client: redisMock },
      },
    );

    await getCacheProjectStats(req, res);

    assert.strictEqual(res.getStatus(), 404);
    assert.deepStrictEqual(res.getJson(), { message: "Cache miss" });
  });

  it("should return 500 if there is an error during cache retrieval", async () => {
    const req = {
      params: {
        projectId: "project_123",
      },
    };

    const res = createRes();

    const redisMock = {
      hGetAll: mock.fn(async () => {
        throw Error("Redis error");
      }),
    };

    const { getCacheProjectStats } = await esmock(
      "../../../controllers/analytics.controller.js",

      {
        "../../../config/redis.js": { client: redisMock },
      },
    );
    await getCacheProjectStats(req, res);

    assert.strictEqual(res.getStatus(), 500);
    assert.deepStrictEqual(res.getJson(), {
      message: "Internal Server Error",
    });
  });
});
