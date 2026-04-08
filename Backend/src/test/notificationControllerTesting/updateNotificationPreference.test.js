import { describe, it, mock } from "node:test";
import esmock from "esmock";
import assert from "assert";
import { updateNotificationPreference } from "../../controllers/notification.controller.js";
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

describe("Update Notification Preference Controller", () => {
  it("should return 400 if required fields are missing", async () => {
    const req = {
      body: {
        appId: "",
        preferences: {
          email: true,
          sms: false,
          inapp: true,
          quietHours: {
            enabled: true,
            start: "22:00",
            end: "08:00",
          },
        },
      },
    };

    const res = createRes();

    await updateNotificationPreference(req, res);

    assert.strictEqual(res.getStatus(), 400);
    assert.deepStrictEqual(res.getJson(), {
      message: "Fields are missing.",
    });
  });

  it("should return 200 if preferences are updated successfully", async () => {
    const req = {
      body: {
        appId: "app_123",
        preferences: {
          email: true,
          sms: false,
          inapp: true,
          quietHours: {
            enabled: true,
            start: "22:00",
            end: "08:00",
          },
        },
      },
    };

    const res = createRes();

    const redisMock = {
      hSet: mock.fn(async () => {}),
      expire: mock.fn(async () => {}),
    };

    const { updateNotificationPreference } = await esmock(
      "../../controllers/notification.controller.js",
      {
        "../../config/redis.js": { client: redisMock },
      },
    );

    mock.method(
      UserPreference,
      "findOneAndUpdate",
      mock.fn(async () => ({})),
    );

    await updateNotificationPreference(req, res);

    assert.strictEqual(res.getStatus(), 200);
    assert.deepStrictEqual(res.getJson(), {
      message: "Updated Preference successfully",
    });
  });

  it("should return 500 if there is an internal server error", async () => {
    const req = {
      body: {
        appId: "app_123",
        preferences: {
          email: true,
          sms: false,
          inapp: true,
          quietHours: {
            enabled: true,
            start: "22:00",
            end: "08:00",
          },
        },
      },
    };

    const res = createRes();

    const redisMock = {
      hSet: mock.fn(async () => {}),
      expire: mock.fn(async () => {}),
    };

    const { updateNotificationPreference } = await esmock(
      "../../controllers/notification.controller.js",
      {
        "../../config/redis.js": { client: redisMock },
      },
    );

    mock.method(
      UserPreference,
      "findOneAndUpdate",
      mock.fn(async () => {
        throw new Error("Database Error");
      }),
    );

    await updateNotificationPreference(req, res);

    assert.strictEqual(res.getStatus(), 500);
    assert.deepStrictEqual(res.getJson(), {
      message: "Internal server error",
    });
  });
});
