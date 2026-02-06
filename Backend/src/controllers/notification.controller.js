import { sendEmail } from "../workers/email.work.js";
import { Notification } from "../models/notification.model.js";
import { publishToQueue } from "../config/rabbitmq.js";
import { UserPreference } from "../models/userPreference.model.js";
import { emitStats, emitUser } from "../config/socket.js";
import { App } from "../models/app.model.js";
import { sendSMS } from "../workers/sms.worker.js";
import { emitInApp } from "../workers/inapp.worker.js";
import { getChartData } from "./analytics.controller.js";
import { getNotificationStats } from "../services/stats.service.js";
import { getProjectStat } from "../services/projectStats.service.js";

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
      const userPreference = await UserPreference.findOne({ appId });

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
    const { channel, to, subject, message, userId, _id, appId } = notification;

    if (channel === "email") {
      await sendEmail(to, subject, message);

      emitUser(userId, "notification_sent", {
        notificationId: _id,
        userId: userId,
        channel: channel,
        status: "sent",
        message: message,
        createdAt: new Date(),
      });
    } else if (channel === "sms") {
      await sendSMS(to, message);

      emitUser(userId, "notification_sent", {
        notificationId: _id,
        userId: userId,
        channel: channel,
        status: "sent",
        message: message,
        createdAt: new Date(),
      });
    } else if (channel === "inapp") {
      emitInApp(appId, userId, {
        notificationId: _id,
        message,
        timestamp: Date.now(),
      });
    }

    const stats = await getNotificationStats(appId);
    const projectStats = await getProjectStat(appId);

    console.log("Emitting stats for appId:", appId, stats, projectStats);

    emitStats(appId, "stats_updated", {
      notificationStats: stats[0] || {},
      projectStats: projectStats[0] || {},
    });
  } catch (error) {
    await Notification.findByIdAndUpdate(notification._id, {
      status: "failed",
    });
    throw error;
  }
};

export const updateNotificationPreference = async (req, res) => {
  try {
    const { appId, preferences } = req.body;

    if (!appId || !preferences) {
      return res.status(400).json({ message: "Fields are missing." });
    }

    const { quietHours, ...channelPrefs } = preferences;

    await UserPreference.findOneAndUpdate(
      { appId },
      { 
        $set: { 
          preferences: channelPrefs, 
          quietHours: quietHours     
        } 
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({ message: "Updated Preference successfully" });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getNotificationPreference = async (req, res) => {
  try {
    const { appId } = req.params;

    const preference = await UserPreference.findOne({
      appId,
      userId: req.userId,
    });

    if (!preference) {
      return res.status(200).json({
        preferences: {
          email: false,
          sms: false,
          inapp: false,
        },
      });
    }

    return res.status(200).json(preference);
  } catch (error) {
    console.error("Get Preference Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
