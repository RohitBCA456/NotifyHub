import { describe, it, mock } from "node:test";
import assert from "assert";
import esmock from "esmock";

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
    const hIncrByMock = mock.fn(async () => {});

    const { sendNotification } = await esmock(
      "../../../controllers/notification.controller.js",
      {
        "../../../workers/email.worker.js": { sendEmail: sendEmailMockFn },
        "../../../config/redis.js": {
          client: {
            hIncrBy: hIncrByMock,
          },
        },
      }
    );

    await sendNotification(fakeNotification);

    // sendEmail should be called once with correct args
    assert.strictEqual(sendEmailMockFn.mock.callCount(), 1);
    assert.strictEqual(
      sendEmailMockFn.mock.calls[0].arguments[0],
      fakeNotification.to
    );

    // hIncrBy should be called once to increment global stats
    assert.strictEqual(hIncrByMock.mock.callCount(), 1);
  });

  it("should throw error and update notification status to failed", async () => {
    const sendEmailErrorMock = mock.fn(async () => {
      throw new Error("SMTP Error");
    });

    const findByIdAndUpdateMock = mock.fn(async () => ({}));

    const { sendNotification } = await esmock(
      "../../../controllers/notification.controller.js",
      {
        "../../../workers/email.worker.js": { sendEmail: sendEmailErrorMock },
        "../../../config/redis.js": {
          client: {
            hIncrBy: mock.fn(async () => {}),
          },
        },
        // Mock Notification inside the controller's module scope
        "../../../models/notification.model.js": {
          Notification: {
            findByIdAndUpdate: findByIdAndUpdateMock,
          },
        },
      }
    );

    try {
      await sendNotification(fakeNotification);
      assert.fail("Should have thrown an error");
    } catch (error) {
      assert.strictEqual(error.message, "SMTP Error");
    }

    // Notification status should be updated to failed
    assert.strictEqual(findByIdAndUpdateMock.mock.callCount(), 1);
    const callArgs = findByIdAndUpdateMock.mock.calls[0].arguments;
    assert.strictEqual(callArgs[0], fakeNotification._id);
    assert.strictEqual(callArgs[1].status, "failed");
  });
});
