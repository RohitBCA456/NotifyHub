import { sendEmail } from "../workers/email.worker.js";
import { Notification } from "../models/notification.model.js";
import { publishToQueue } from "../config/rabbitmq.js";
import { UserPreference } from "../models/userPreference.model.js";
import { emitStats } from "../config/socket.js";
import { App } from "../models/app.model.js";
import { sendSMS } from "../workers/sms.worker.js";
import { emitInApp } from "../workers/inapp.worker.js";
import { getNotificationStats } from "../services/stats.service.js";
import { getProjectStat } from "../services/projectStats.service.js";
import { client } from "../config/redis.js";
import mongoose from "mongoose";

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
    return res.status(500).json({
      message: "Failed to create notification.",
      error: error.message,
    });
  }
};

export const sendNotification = async (notification) => {
  try {
    const { channel, to, subject, message, userId, _id, appId } = notification;

    if (channel === "email") {
      await sendEmail(to, subject, message, notification);
    } else if (channel === "sms") {
      await sendSMS(to, message, notification);
    } else if (channel === "inapp") {
      emitInApp(appId, userId, {
        notificationId: _id,
        message,
        timestamp: Date.now(),
      });
    }

    await client.hIncrBy(`GStats`, "totalNotifications", 1);

    const stats = await getNotificationStats(appId);
    const projectStats = await getProjectStat(appId);

    console.log("Emitting stats for appId:", appId, stats, projectStats);

    emitStats(appId, "stats_updated", {
      notificationStats: stats[0] || {},
      projectStats: projectStats[0] || {},
    });

    const key = `PStats:${appId}`;

    await client.hSet(key, {
      totalSent: projectStats[0]?.total,
      successRate: projectStats[0]?.successRate,
    });

    await client.expire(key, 86400);
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
          quietHours: quietHours,
        },
      },
      { upsert: true, new: true },
    );

    const key = `pref:${appId}`;

    await client.hSet(key, {
      preferences: JSON.stringify(channelPrefs),
      quietHours: JSON.stringify(quietHours),
    });

    await client.expire(key, 86400);

    return res.status(200).json({ message: "Updated Preference successfully" });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getNotificationPreference = async (req, res) => {
  try {
    const { appId } = req.params;

    if (!appId || !mongoose.Types.ObjectId.isValid(appId)) {
      return res.status(400).json({
        message: "AppId is required",
      });
    }

    const preference = await UserPreference.findOne({
      appId,
    });

    if (!preference) {
      return res.status(404).json({
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

export const getCacheNotificationPreference = async (req, res) => {
  try {
    const { appId } = req.body;

    if (!appId || !mongoose.Types.ObjectId.isValid(appId)) {
      return res.status(400).json({
        message: "appId is required",
      });
    }

    const key = `pref:${appId}`;

    const preference = await client.hGetAll(key);

    if (!preference || Object.keys(preference).length === 0) {
      return res.status(404).json({
        message: "Preference not found on cache",
      });
    }

    return res.status(200).json(preference);
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      err: error.message,
    });
  }
};
