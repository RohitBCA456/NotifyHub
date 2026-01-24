import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";
import mongoose from "mongoose";

export const getGlobalStats = async (req, res) => {
  try {
    const activeThreshold = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [totalMembers, totalNotifications, activeChannelsCount] =
      await Promise.all([
        User.countDocuments(),

        Notification.countDocuments(),

        Notification.distinct("appId", {
          createdAt: { $gt: activeThreshold },
        }).then((apps) => apps.length),
      ]);

    return res.status(200).json({
      totalMembers: totalMembers || 0,
      totalNotifications: totalNotifications || 0,
      activeChannels: activeChannelsCount || 0,
    });
  } catch (error) {
    console.error("Global Stats Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getProjectStats = async (req, res) => {
  try {
    const { projectId } = req.params;

    const stats = await Notification.aggregate([
      { $match: { appId: new mongoose.Types.ObjectId(projectId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          sentCount: {
            $sum: { $cond: [{ $eq: ["$status", "sent"] }, 1, 0] },
          },
        },
      },
    ]);

    const result = stats[0] || { total: 0, sentCount: 0 };

    // Calculate percentage
    const successRate =
      result.total > 0
        ? ((result.sentCount / result.total) * 100).toFixed(1)
        : "0.0";

    res.status(200).json({
      totalSent: result.total.toLocaleString(),
      successRate: `${successRate}%`,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats" });
  }
};

export const getChartData = async (req, res) => {
  try {
    const { projectId } = req.params;
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const stats = await Notification.aggregate([
      {
        $match: {
          appId: new mongoose.Types.ObjectId(projectId),
          createdAt: { $gte: dayAgo },
        },
      },
      {
        $facet: {
          // 1. Logic for Bar Chart (Hourly volume)
          hourlyVolume: [
            {
              $group: {
                _id: { $hour: "$createdAt" },
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ],
          // 2. Logic for Pie Chart (Channel mix)
          channelMix: [
            {
              $group: {
                _id: "$channel",
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    res.status(200).json(stats[0]);
  } catch (error) {
    res.status(500).json({ message: "Chart data error", error: error.message });
  }
};
