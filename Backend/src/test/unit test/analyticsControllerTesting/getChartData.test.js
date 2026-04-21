import { it, describe, mock } from "node:test";
import assert from "assert";
import { getChartData } from "../../../controllers/analytics.controller.js";
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

describe("Get Chart Data Controller", () => {
  it("should return 400 if projectId is missing", async () => {
    const req = {
      params: {
        projectId: "",
      },
    };

    const res = createRes();

    await getChartData(req, res);

    assert.strictEqual(res.getStatus(), 400);
    assert.deepStrictEqual(res.getJson(), {
      message: "Project ID is required",
    });
  });

  it("should return chart data successfully", async () => {
    const req = {
      params: {
        projectId: "project_123",
      },
    };

    const res = createRes();

    const data = [
      {
        hourlyVolume: [
          { hour: "2024-01-01T00:00:00Z", count: 10 },
          { hour: "2024-01-01T01:00:00Z", count: 15 },
        ],
        channelMix: [
          { channel: "email", count: 20 },
          { channel: "sms", count: 5 },
        ],
      },
    ];

    const getNotificationStatsMock = mock.fn(async () => {
      return data;
    });

    const { getChartData } = await esmock(
      "../../../controllers/analytics.controller.js",
      {
        "../../../services/stats.service.js": {
          getNotificationStats: getNotificationStatsMock,
        },
      },
    );

    await getChartData(req, res);

    assert.strictEqual(res.getStatus(), 200);
    assert.deepStrictEqual(res.getJson(), data[0]);
  });

  it("should return 500 if there is an error during data retrieval", async () => {
    const req = {
      params: {
        projectId: "project_123",
      },
    };

    const res = createRes();

    const getNotificationStatsMock = mock.fn(async () => {
      throw new Error("Database error");
    });

    const { getChartData } = await esmock(
      "../../../controllers/analytics.controller.js",
      {
        "../../../services/stats.service.js": {
          getNotificationStats: getNotificationStatsMock,
        },
      },
    );

    await getChartData(req, res);

    assert.strictEqual(res.getStatus(), 500);
    assert.deepStrictEqual(res.getJson(), {
      error: "Database error",
    });
  });
});
