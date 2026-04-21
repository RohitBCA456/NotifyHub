import { describe, it, mock } from "node:test";
import assert from "assert";
import { deleteProject } from "../../../controllers/user.controller.js";
import { App } from "../../../models/app.model.js";
import { Notification } from "../../../models/notification.model.js";
import { UserPreference } from "../../../models/userPreference.model.js";

const VALID_ID = "65d62d98f1a2b3c4d5e6f7a8";

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

describe("Delete Project Controller", () => {
  it("should return 400 if projectId is missing", async () => {
    const req = { body: { projectId: "" } };
    const res = createRes();

    await deleteProject(req, res);

    assert.strictEqual(res.getStatus(), 400);
    assert.deepStrictEqual(res.getJson(), {
      message: "ProjectId is required.",
    });
  });

  it("should return 404 if project not found for deletion", async () => {
    const req = { body: { projectId: VALID_ID } };
    const res = createRes();

    mock.method(App, "findByIdAndDelete", async () => null);

    await deleteProject(req, res);

    assert.strictEqual(res.getStatus(), 404);
    assert.deepStrictEqual(res.getJson(), {
      message: "Project not found.",
    });

    mock.restoreAll();
  });

  it("should return 200 and trigger associated deletions", async () => {
    const req = { body: { projectId: VALID_ID } };
    const res = createRes();

    const findAndDeleteMock = mock.method(App, "findByIdAndDelete", async () => ({ _id: VALID_ID }));
    const deleteNotificationsMock = mock.method(Notification, "deleteMany", async () => ({ deletedCount: 5 }));
    const deletePrefsMock = mock.method(UserPreference, "deleteOne", async () => ({ deletedCount: 1 }));

    await deleteProject(req, res);

    assert.strictEqual(res.getStatus(), 200);
    assert.strictEqual(findAndDeleteMock.mock.callCount(), 1);
    assert.strictEqual(deleteNotificationsMock.mock.callCount(), 1);
    assert.strictEqual(deletePrefsMock.mock.callCount(), 1);
    
    assert.deepStrictEqual(deleteNotificationsMock.mock.calls[0].arguments[0], { appId: VALID_ID });
    assert.deepStrictEqual(res.getJson(), {
      message: "Project and all associated notifications deleted successfully.",
    });

    mock.restoreAll();
  });

  it("should return 500 if internal server error occurs", async () => {
    const req = { body: { projectId: VALID_ID } };
    const res = createRes();

    mock.method(App, "findByIdAndDelete", async () => {
      throw new Error("Database Error");
    });

    await deleteProject(req, res);

    assert.strictEqual(res.getStatus(), 500);
    assert.deepStrictEqual(res.getJson(), {
      message: "Internal server error",
    });

    mock.restoreAll();
  });
});