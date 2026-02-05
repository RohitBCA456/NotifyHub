import { Notification } from "../models/notification.model.js";
import mongoose from "mongoose";

export const getNotificationStats = async (appId) => {
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  console.log("Fetching stats for appId:", appId);

  return await Notification.aggregate([
    {
      $match: {
        appId: new mongoose.Types.ObjectId(appId),
        createdAt: { $gte: dayAgo },
      },
    },
    {
      $facet: {
        hourlyVolume: [
          { $group: { _id: { $hour: "$createdAt" }, count: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ],
        channelMix: [{ $group: { _id: "$channel", count: { $sum: 1 } } }],
      },
    },
  ]);
};
