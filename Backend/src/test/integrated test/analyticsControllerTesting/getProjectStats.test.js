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

describe("GET /project-stats/:projectId", () => {
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

  test("should return 400 if projectId is missing", async () => {
    const response = await request(app).get("/api/analytics/project-stats/undefined");

    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.message, "Project ID is required");
  });

  test("should return 200 and formatted stats on success", async () => {
    const projectId = new mongoose.Types.ObjectId().toString();

    const getProjectStatStub = sinon.stub().resolves([
      { total: 1500, successRate: 95.6 }
    ]);

    const { getProjectStats } = await esmock(
      "../../../../src/controllers/analytics.controller.js",
      {
        "../../../../src/services/projectStats.service.js": {
          getProjectStat: getProjectStatStub,
        },
      }
    );

    const { default: express } = await import("express");
    const testApp = express();
    testApp.use(express.json());
    testApp.get("/api/analytics/project-stats/:projectId", getProjectStats);

    const response = await request(testApp).get(
      `/api/analytics/project-stats/${projectId}`
    );

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.totalSent, "1,500");
    assert.strictEqual(response.body.successRate, "95.6%");
  });

  test("should return 500 if an error occurs", async () => {
    const projectId = new mongoose.Types.ObjectId().toString();

    const getProjectStatStub = sinon.stub().rejects(new Error("Database Failure"));

    const { getProjectStats } = await esmock(
      "../../../../src/controllers/analytics.controller.js",
      {
        "../../../../src/services/projectStats.service.js": {
          getProjectStat: getProjectStatStub,
        },
      }
    );

    const { default: express } = await import("express");
    const testApp = express();
    testApp.use(express.json());
    testApp.get("/api/analytics/project-stats/:projectId", getProjectStats);

    const response = await request(testApp).get(
      `/api/analytics/project-stats/${projectId}`
    );

    assert.strictEqual(response.status, 500);
    assert.strictEqual(response.body.message, "Error fetching stats");
  });
});
