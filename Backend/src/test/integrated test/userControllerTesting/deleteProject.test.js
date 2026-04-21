import { test, describe, before, beforeEach, after } from "node:test";
import request from "supertest";
import { connectDB, clearDB, closeDB } from "../../../config/db.js";
import { closeRabbitMQ } from "../../../config/rabbitmq.js";
import mongoose from "mongoose";
import { app } from "../../../../app.js";
import assert from "assert";
import jwt from "jsonwebtoken";
import { clearRedis, closeRedis, connectRedis } from "../../../config/redis.js";
import dotenv from "dotenv";
import { generateApiKey } from "../../../utils/generateApiKey.js";
import { App } from "../../../models/app.model.js";
import sinon from "sinon";

dotenv.config();

const VALID_ID = new mongoose.Types.ObjectId().toString();
const SECRET = process.env.JWT_SECRET;

describe("DELETE /delete-project", () => {
  before(async () => {
    await connectDB();
    await connectRedis();
  });

  beforeEach(async () => {
    await clearDB();
    await clearRedis();
  });

  after(async () => {
    await closeDB();
    await closeRedis();
    await closeRabbitMQ();
  });

  test("should return 401 if the user is unathorized", async () => {
    const response = await request(app).delete("/api/users/delete-project");

    assert.strictEqual(response.status, 401);
    assert.strictEqual(
      response.body.message,
      "Authentication token is missing.",
    );
  });

  test("should return 400 if projectId is missing", async () => {
    const payLoad = {
      projectId: "",
    };

    const token = jwt.sign({ id: VALID_ID }, SECRET);

    const response = await request(app)
      .delete("/api/users/delete-project")
      .set("Cookie", `webToken=${token}`)
      .send(payLoad);

    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.message, "ProjectId is required.");
  });

  test("should return 404 if project is not found in DB", async () => {
    const payLoad = {
      projectId: new mongoose.Types.ObjectId().toString(),
    };

    const token = jwt.sign({ id: VALID_ID }, SECRET);

    const response = await request(app)
      .delete("/api/users/delete-project")
      .set("Cookie", `webToken=${token}`)
      .send(payLoad);

    assert.strictEqual(response.status, 404);
    assert.strictEqual(response.body.message, "Project not found.");
  });

  test("should return 200 if project is deleted successfully", async () => {
    const payLoad = {
      name: "service Provider",
      userId: new mongoose.Types.ObjectId().toString(),
      apiKey: generateApiKey(),
    };

    const existingProject = await App.create(payLoad);

    const projectId = existingProject._id;

    const token = jwt.sign({ id: VALID_ID }, SECRET);

    const response = await request(app)
      .delete("/api/users/delete-project")
      .set("Cookie", `webToken=${token}`)
      .send({ projectId: projectId.toString() });

    console.log(`Response body: ${response.body}`);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(
      response.body.message,
      "Project and all associated notifications deleted successfully.",
    );
  });

  test("should return 500 if error occurs", async () => {
    const token = jwt.sign({ id: VALID_ID }, SECRET);

    const payLoad = {
      projectId: new mongoose.Types.ObjectId().toString(),
    };

    const stub = sinon
      .stub(App, "findByIdAndDelete")
      .throws(new Error("Database error"));

    const response = await request(app)
      .delete("/api/users/delete-project")
      .set("Cookie", `webToken=${token}`)
      .send(payLoad);

    assert.strictEqual(response.status, 500);
    assert.strictEqual(response.body.message, "Internal server error");

    stub.restore();
  });
});
