import { sendEmail } from "../workers/email.work.js";
import { Notification } from "../models/notification.model.js";
import { publishToQueue } from "../config/rabbitmq.js";
import { UserPreference } from "../models/userPreference.model.js";
import { emitUser } from "../config/socket.js";
import { App } from "../models/app.model.js";
import { sendSMS } from "../workers/sms.worker.js";
import { emitInApp } from "../workers/inapp.worker.js";

export const createNotification = async (req, res) => {
  try {
    const { appId, channels, targets, subject, message } = req.body;
    const apiKey = req.headers["x-api-key"];
    const userId = req.userId;

    const app = await App.findById(appId).select("apiKey");
    if (!app || app.apiKey !== apiKey) {
      return res.status(403).json({ message: "Invalid API key or app ID." });
    }

    for (const channel of channels) {
      const userPreference = await UserPreference.findOne({ userId });

      if (userPreference && !userPreference.preferences[channel]) {
        return res.status(400).json({
          message: `User has opted out of ${channel} notifications.`,
        });
      }

      const quietHours = userPreference ? userPreference.quietHours : null;

      const notification = await Notification.create({
        userId,
        appId,
        channel,
        to: targets[channel] || undefined,
        subject: channel === "email" ? subject : undefined,
        message,
        quietHours,
      });

      await publishToQueue("notification_queue", notification);
    }

    return res.status(201).json({
      message: "Notifications queued successfully",
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    return res.status(500).json({ message: "Failed to create notification." });
  }
};

export const sendNotification = async (notification) => {
  try {
    const { channel, to, subject, message } = notification;

    if (channel === "email") {
      await sendEmail(to, subject, message);
    }

    if (channel === "sms") {
      await sendSMS(to, message);
    }

    if (channel === "inapp") {
      emitInApp(notification.appId, notification.userId, {
        notificationId: notification._id,
        message,
        timestamp: Date.now(),
      });
    }

    emitUser(notification.userId, "notification_sent", {
      notificationId: notification._id,
      channel,
      status: "sent",
      timestamp: Date.now(),
    });
  } catch (error) {
    await Notification.findByIdAndUpdate(notification._id, {
      status: "failed",
    });

    throw error;
  }
};
