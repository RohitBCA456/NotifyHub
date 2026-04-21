import { describe, it, mock } from "node:test";
import assert from "assert";
import { fetchProjects } from "../../../controllers/user.controller.js";
import { App } from "../../../models/app.model.js";

const VALID_USER_ID = "65d62d98f1a2b3c4d5e6f7a8";

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

describe("Fetch Projects Controller", () => {
  it("should return 400 if userId is missing", async () => {
    const req = { userId: "" };
    const res = createRes();

    await fetchProjects(req, res);

    assert.strictEqual(res.getStatus(), 400);
    assert.deepStrictEqual(res.getJson(), {
      message: "UserId is missing",
    });
  });

  it("should return 200 and return an array of projects", async () => {
    const fakeApps = [
      {
        name: "Test App",
        lastActive: new Date(),
        totalRequest: 4,
        status: "Active",
      }
    ];

    const req = { userId: VALID_USER_ID };
    const res = createRes();

    const aggregateMock = mock.method(App, "aggregate", async () => fakeApps);

    await fetchProjects(req, res);

    assert.strictEqual(res.getStatus(), 200);
    assert.strictEqual(aggregateMock.mock.callCount(), 1);
    
    const responseJson = res.getJson();
    assert.ok(Array.isArray(responseJson.apps));
    assert.strictEqual(responseJson.apps.length, 1);
    assert.deepStrictEqual(responseJson.apps, fakeApps);

    mock.restoreAll();
  });

  it("should return 500 if the database operation fails", async () => {
    const req = { userId: VALID_USER_ID };
    const res = createRes();

    mock.method(App, "aggregate", async () => {
      throw new Error("Database connection failed");
    });

    await fetchProjects(req, res);

    assert.strictEqual(res.getStatus(), 500);
    assert.deepStrictEqual(res.getJson(), {
      message: "Internal server error",
    });

    mock.restoreAll();
  });
});