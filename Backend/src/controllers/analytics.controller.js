import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";

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
