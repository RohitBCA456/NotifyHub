import { it, describe, mock } from "node:test";
import assert from "assert";
import { getProjectStats } from "../../../controllers/analytics.controller.js";
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

describe("Get project stats controller", () => {
  it("should return 400 if projectId is missing", async () => {
    const req = {
      params: {
        projectId: "",
      },
    };

    const res = createRes();

    await getProjectStats(req, res);

    assert.strictEqual(res.getStatus(), 400);
    assert.deepStrictEqual(res.getJson(), {
      message: "Project ID is required",
    });
  });

  it("should return project stats successfully", async () => {
    const req = {
      params: {
        projectId: "project_123",
      },
    };

    const getProjectStatMock = mock.fn(async () => [
      {
        total: 100,
        successRate: 75,
        sentCount: 10,
      },
    ]);

    const redisMock = {
      hSet: mock.fn(async () => {}),
      expire: mock.fn(async () => {}),
    };

    const { getProjectStats } = await esmock(
      "../../../controllers/analytics.controller.js",
      {
        "../../../services/projectStats.service.js": {
          getProjectStat: getProjectStatMock,
        },

        "../../../config/redis.js": { client: redisMock },
      },
    );

    const res = createRes();

    await getProjectStats(req, res);

    assert.strictEqual(res.getStatus(), 200);
    assert.deepStrictEqual(res.getJson(), {
      totalSent: "100",
      successRate: `75.0%`,
    });
  });

  it("should return 500 if there is an error fetching stats", async () => {
    const req = {
      params: {
        projectId: "project_123",
      },
    };

    const getProjectStatMock = mock.fn(async () => {
      throw Error("Database error");
    });

    const { getProjectStats } = await esmock(
      "../../../controllers/analytics.controller.js",
      {
        "../../../services/projectStats.service.js": {
          getProjectStat: getProjectStatMock,
        },
      },
    );

    const res = createRes();

    await getProjectStats(req, res);

    assert.strictEqual(res.getStatus(), 500);
    assert.deepStrictEqual(res.getJson(), {
      message: "Error fetching stats",
    });
  });
});
