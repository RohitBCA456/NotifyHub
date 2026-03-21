import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";
import { getNotificationStats } from "../services/stats.service.js";
import { getProjectStat } from "../services/projectStats.service.js";
import { client } from "../config/redis.js";

export const getGlobalStats = async (req, res) => {
  try {
    const activeThreshold = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [totalMembers, totalNotifications, activeChannelsCount] =
      await Promise.all([User.countDocuments(), Notification.countDocuments()]);

    const key = `GStats`;

    await client.hSet(key, {
      totalMembers: totalMembers || 0,
      totalNotifications: totalNotifications || 0,
    });

    await client.expire(key);

    return res.status(200).json({
      totalMembers: totalMembers || 0,
      totalNotifications: totalNotifications || 0,
    });
  } catch (error) {
    console.error("Global Stats Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getProjectStats = async (req, res) => {
  try {
    const { projectId } = req.params;

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

export const getCacheGlobalStats = async (req, res) => {
  try {
    const key = `GStats`;

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
