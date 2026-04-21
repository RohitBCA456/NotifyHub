import {
  test,
  describe,
  before,
  after,
  beforeEach,
  afterEach,
} from "node:test";
import request from "supertest";
import assert from "assert";
import mongoose from "mongoose";
import sinon from "sinon";
import esmock from "esmock";
import { clearDB, closeDB, connectDB } from "../../../config/db.js";
import { clearRedis, closeRedis, connectRedis } from "../../../config/redis.js";
import { closeRabbitMQ } from "../../../config/rabbitmq.js";
import { app } from "../../../../app.js";

describe("GET /chart-data/:projectId", () => {
  before(async () => {
    await connectDB();
    await connectRedis();
  });

  beforeEach(async () => {
    await clearDB();
    await clearRedis();
  });

  afterEach(() => {
    sinon.restore();
  });

  after(async () => {
    await closeDB();
    await closeRedis();
    await closeRabbitMQ();
  });

  test("return 400 if projectId is missing", async () => {
    const response = await request(app).get(
      "/api/analytics/chart-data/undefined",
    );

    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.message, "Project ID is required");
  });

  test("should return 200 if chart data found", async () => {
    const projectId = new mongoose.Types.ObjectId().toString();

    const mockData = [
      {
        hourlyVolume: [{ hour: "2024-01-01T00:00:00Z", count: 10 }],
        channelMix: [{ channel: "email", count: 20 }],
      },
    ];

    const getNotificationStub = sinon.stub().resolves(mockData);

    const { getChartData } = await esmock(
      "../../../../src/controllers/analytics.controller.js",
      {
        "../../../../src/services/stats.service.js": {
          getNotificationStats: getNotificationStub,
        },
      },
    );

    const { default: express } = await import("express");
    const testApp = express();
    testApp.use(express.json());
    testApp.get("/api/analytics/chart-data/:projectId", getChartData);

    const response = await request(testApp).get(
      `/api/analytics/chart-data/${projectId}`,
    );

    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.body, mockData[0]);
    assert.strictEqual(getNotificationStub.calledWith(projectId), true);
  });

  test("should return 500 if an error occurs during data fetch", async () => {
    const projectId = new mongoose.Types.ObjectId().toString();
    const errorMessage = "Internal Database Error";

    const getNotificationStub = sinon.stub().rejects(new Error(errorMessage));

    const { getChartData } = await esmock(
      "../../../../src/controllers/analytics.controller.js",
      {
        "../../../../src/services/stats.service.js": {
          getNotificationStats: getNotificationStub,
        },
      },
    );

    const { default: express } = await import("express");
    const testApp = express();
    testApp.use(express.json());
    testApp.get("/api/analytics/chart-data/:projectId", getChartData);

    const response = await request(testApp).get(
      `/api/analytics/chart-data/${projectId}`,
    );

    assert.strictEqual(response.status, 500);
    assert.strictEqual(response.body.error, errorMessage);
  });
});