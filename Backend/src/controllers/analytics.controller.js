import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";
import { getNotificationStats } from "../services/stats.service.js";
import { getProjectStat } from "../services/projectStats.service.js";

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

    const stats = await getProjectStat(projectId);

    console.log("Project Stats:", stats);
    
   const { total = 0, successRate = 0 } = stats[0] || {};

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