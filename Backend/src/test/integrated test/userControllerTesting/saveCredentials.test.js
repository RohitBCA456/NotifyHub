import { describe, test, beforeEach, after, before } from "node:test";
import assert from "assert";
import { closeDB, connectDB, clearDB } from "../../../config/db.js";
import request from "supertest";
import { app } from "../../../../app.js";
import {
  clearRedis,
  client,
  closeRedis,
  connectRedis,
} from "../../../config/redis.js";
import { User } from "../../../models/user.model.js";
import bcrypt from "bcrypt";
import sinon from "sinon";
import { closeRabbitMQ } from "../../../config/rabbitmq.js";
import dotenv from "dotenv";

dotenv.config();

describe("POST /save-credentials", () => {
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

  test("should return 400 if any field is missing", async () => {
    const req = {
      body: {
        username: "testUser",
        imageUrl: "test.png",
        email: "test@example.com",
        sessionId: "",
      },
    };

    const response = await request(app)
      .post("/api/users/save-credentials")
      .send(req.body);

    assert.strictEqual(response.status, 400);
    assert.deepStrictEqual(response.body, {
      message: "Username, email, and sessionId are required.",
    });
  });

  test("should return 201 and save credentials for new user", async () => {
    const validPayload = {
      username: "jdoe",
      imageUrl: "https://photo.jpg",
      email: "jdoe@example.com",
      sessionId: "session_123",
    };

    const response = await request(app)
      .post("/api/users/save-credentials")
      .send(validPayload);

    // console.log(response);

    assert.strictEqual(response.status, 201);
    assert.strictEqual(
      response.body.message,
      "User credentials saved successfully.",
    );

    const savedUser = await User.findOne({ email: "jdoe@example.com" });

    assert.ok(savedUser);
    assert.strictEqual(savedUser.username, "jdoe");

    const totalMembers = await client.hGet("GStats", "totalMembers");
    assert.strictEqual(totalMembers, "1");

    const key = `profile:${savedUser._id}`;
    const cachedProfile = await client.hGetAll(key);

    assert.strictEqual(cachedProfile.username, "jdoe");
    assert.strictEqual(cachedProfile.email, "jdoe@example.com");

    const cookies = response.headers["set-cookie"][0];

    assert.ok(cookies.includes("webToken"));
  });

  test("should update sessionId for existing user and return 201", async () => {
    const uniqueEmail = "update_test@example.com";
    const uniqueUsername = "updateUser123";

    const existingUser = {
      username: uniqueUsername,
      imageUrl: "test.png",
      email: uniqueEmail,
      sessionId: "OLD_SESSION",
    };

    const updatedUser = {
      username: uniqueUsername,
      imageUrl: "test.png",
      email: uniqueEmail,
      sessionId: "NEW_SESSION",
    };

    await User.create(existingUser);

    const response = await request(app)
      .post("/api/users/save-credentials")
      .send(updatedUser);

    console.log("response body:", response.body);

    assert.strictEqual(response.status, 201);
    assert.strictEqual(
      response.body.message,
      "User credentials saved successfully.",
    );

    const userInDb = await User.findOne({ email: "update_test@example.com" });
    console.log(userInDb);

    assert.ok(userInDb);

    const cookies = response.headers["set-cookie"][0];
    assert.ok(cookies.includes("webToken"));
  });

  test("should return 500 if database save fails", async () => {
    const validPayLoad = {
      username: "testUser",
      imageUrl: "test.png",
      email: "test@example.com",
      sessionId: "session_123",
    };

    const stub = sinon
      .stub(User, "findOne")
      .throws(new Error("Database error"));

    const response = await request(app)
      .post("/api/users/save-credentials")
      .send(validPayLoad);

    assert.strictEqual(response.status, 500);
    assert.strictEqual(response.body.message, "Internal server error.");
    assert.strictEqual(response.body.error, "Database error");

    stub.restore();
  });
});
