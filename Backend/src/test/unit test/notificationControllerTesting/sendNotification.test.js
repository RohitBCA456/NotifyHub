import { describe, it, mock } from "node:test";
import assert from "assert";
import esmock from "esmock";
import { Notification } from "../../../models/notification.model.js";

describe("Send Notification Controller", () => {
  const fakeNotification = {
    channel: "email",
    to: "test@example.com",
    subject: "testing",
    message: "Testing Send Notification Controller",
    userId: "45782390",
    _id: "65d62d98f1a2b3c4d5e6f7a8",
    appId: "3459868569402",
  };

  it("should successfully send notification", async () => {
    const sendEmailMockFn = mock.fn(async () => Promise.resolve(true));
    const statsMockFn = mock.fn(async () => [{ total: 10 }]);
    const projectStatsMokcFn = mock.fn(async () => [{ totalSent: 5, successRate: 50 }]);
    const emitStatsMock = mock.fn();
    const redisMock = { hSet: mock.fn(async () => {}), expire: mock.fn(async () => {}), hIncrBy: mock.fn(async () => {}) };

    const { sendNotification } = await esmock("../../../controllers/notification.controller.js", {
      "../../../workers/email.worker.js": { sendEmail: sendEmailMockFn },
      "../../../services/stats.service.js": { getNotificationStats: statsMockFn },
      "../../../services/projectStats.service.js": { getProjectStat: projectStatsMokcFn },
      "../../../config/socket.js": { emitStats: emitStatsMock },
      "../../../config/redis.js": { client: redisMock }
    });

    await sendNotification(fakeNotification);

    assert.strictEqual(sendEmailMockFn.mock.callCount(), 1);
    assert.strictEqual(statsMockFn.mock.callCount(), 1);
  });

  it("should return 500 if internal server error occurs", async () => {
    const sendEmailErrorMock = mock.fn(async () => {
      throw new Error("SMTP Error");
    });

    const notificationStatusUpdateMock = mock.method(Notification, "findByIdAndUpdate", async () => ({}));

    const { sendNotification } = await esmock("../../../controllers/notification.controller.js", {
      "../../../workers/email.worker.js": { sendEmail: sendEmailErrorMock },
      "../../../services/stats.service.js": { getNotificationStats: mock.fn() },
      "../../../services/projectStats.service.js": { getProjectStat: mock.fn() },
      "../../../config/socket.js": { emitStats: mock.fn() },
      "../../../config/redis.js": { client: { hSet: mock.fn(), expire: mock.fn() } }
    });

    try {
      await sendNotification(fakeNotification);
    } catch (error) {
      assert.strictEqual(error.message, "SMTP Error");
    }

    assert.strictEqual(notificationStatusUpdateMock.mock.callCount(), 1);
    
    const callArgs = notificationStatusUpdateMock.mock.calls[0].arguments;
    assert.strictEqual(callArgs[0], fakeNotification._id);
    assert.strictEqual(callArgs[1].status, "failed");
  });
});