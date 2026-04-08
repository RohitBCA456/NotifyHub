import { it, describe, mock } from "node:test";
import assert from "assert";
import { getNotificationPreference } from "../../controllers/notification.controller.js";
import { UserPreference } from "../../models/userPreference.model.js";

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

describe("Get Notification Prefernce Controller", () => {
  it("should return 400 if the field is missing", async () => {
    const req = {
      params: {
        appId: "",
      },
    };

    const res = createRes();

    await getNotificationPreference(req, res);

    assert.strictEqual(res.getStatus(), 400);
    assert.deepStrictEqual(res.getJson(), {
      message: "AppId is required",
    });
  });

  it("should return 404 if preference is not found", async () => {
    const req = {
      params: {
        appId: "nonexistentAppId",
      },
      userId: "user_123",
    };

    const res = createRes();

    mock.method(UserPreference, "findOne", async () => null);

    await getNotificationPreference(req, res);

    assert.strictEqual(res.getStatus(), 404);
    assert.deepStrictEqual(res.getJson(), {
      preferences: {
        email: false,
        sms: false,
        inapp: false,
      },
    });
  });

  it("should return 200 with preferences if found", async () => {
    const req = {
      params: {
        appId: "appID_123",
      },
      userId: "user_123",
    };

    const res = createRes();

    const mockData = {
      appId: "appID_123",
      preferences: {
        email: true,
        sms: false,
        inapp: true,
      },
      quietHours: {
        enabled: true,
        start: "22:00",
        end: "08:00",
      },
    };

    mock.method(UserPreference, "findOne", async () => mockData);

    await getNotificationPreference(req, res);

    assert.strictEqual(res.getStatus(), 200);
    assert.deepStrictEqual(res.getJson(), mockData);
  });
});
