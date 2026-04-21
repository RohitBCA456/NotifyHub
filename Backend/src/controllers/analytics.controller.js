import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";
import { getNotificationStats } from "../services/stats.service.js";
import { getProjectStat } from "../services/projectStats.service.js";
import { client } from "../config/redis.js";
import mongoose from "mongoose";

export const getGlobalStats = async (req, res) => {
  try {
    const key = `GStats`;

    // 1. Try to get data from Redis
    const cachedStats = await client.hGetAll(key);

    if (
      cachedStats &&
      cachedStats.totalMembers &&
      cachedStats.totalNotifications
    ) {
      return res.status(200).json({
        totalMembers: parseInt(cachedStats.totalMembers),
        totalNotifications: parseInt(cachedStats.totalNotifications),
      });
    }

    // 2. Cache Miss: Fetch from DB
    const [totalMembers, totalNotifications] = await Promise.all([
      User.countDocuments(),
      Notification.countDocuments({ status: "sent" }),
    ]);

    // 3. Update Redis so next request is fast
    await client.hSet(key, {
      totalMembers: totalMembers.toString(),
      totalNotifications: totalNotifications.toString(),
    });

    return res.status(200).json({
      totalMembers,
      totalNotifications,
    });
  } catch (error) {
    console.error("Global Stats Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getProjectStats = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId || projectId === "undefined") {
      return res.status(400).json({ message: "Project ID is required" });
    }

    const stats = await getProjectStat(projectId);

    console.log("Project Stats:", stats);

    const { total = 0, successRate = 0 } = stats[0] || {};

    const key = `PStats:${projectId}`;

    await client.hSet(key, {
      totalSent: total.toLocaleString(),
      successRate: `${successRate.toFixed(1)}%`,
    });

    await client.expire(key, 86400);

    res.status(200).json({
      totalSent: total.toLocaleString(),
      successRate: `${successRate.toFixed(1)}%`,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats" });
  }
};

export const getChartData = async (req, res) => {
  if (!req.params.projectId || req.params.projectId === "undefined") {
    return res.status(400).json({ message: "Project ID is required" });
  }

  try {
    const data = await getNotificationStats(req.params.projectId);

    res.status(200).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCacheProjectStats = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId || projectId === "undefined") {
      return res.status(400).json({
        message: "Project ID is required",
      });
    }

    const key = `PStats:${projectId}`;

    const data = await client.hGetAll(key);

    if (!data || Object.keys(data).length === 0) {
      return res.status(404).json({
        message: "Cache miss",
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
