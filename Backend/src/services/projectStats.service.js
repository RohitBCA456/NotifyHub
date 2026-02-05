import { Notification } from "../models/notification.model.js";
import mongoose from "mongoose";
export async function getProjectStat(projectId) {
  return await Notification.aggregate([
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
    {
      $project: {
        _id: 0,
        total: 1,
        sentCount: 1,
        successRate: {
          $cond: [
            { $gt: ["$total", 0] },
            { $multiply: [{ $divide: ["$sentCount", "$total"] }, 100] },
            0
          ]
        }
      }
    }
  ]);
}