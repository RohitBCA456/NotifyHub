import { User } from "../models/user.model.js";
import { App } from "../models/app.model.js";
import { generateApiKey } from "../utils/generateApiKey.js";
import { UserPreference } from "../models/userPreference.model.js";
import { Notification } from "../models/notification.model.js";
import mongoose from "mongoose";

export const saveCredentials = async (req, res) => {
  try {
    const { username, imageUrl, email, sessionId } = req.body;

    if (!username || !imageUrl || !email || !sessionId) {
      return res
        .status(400)
        .json({ message: "Username, email, and sessionId are required." });
    }

    let newUser = await User.findOne({ email });

    if (newUser) {
      newUser.sessionId = sessionId;
    } else {
      newUser = await User.create({ username, imageUrl, email, sessionId });
    }

    const webToken = await newUser.generateWebToken();

    newUser.webToken = webToken;

    await newUser.save();

    const options = {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "lax",
    };

    return res
      .cookie("webToken", webToken, options)
      .status(201)
      .json({ message: "User credentials saved successfully.", user: newUser });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const userId = req.userId;

    await User.findByIdAndUpdate(userId, { webToken: null, sessionId: null });

    const options = {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "lax",
    };

    return res
      .clearCookie("webToken", options)
      .status(200)
      .json({ message: "User logged out successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

export const createApp = async (req, res) => {
  try {
    const { name, channel, quietHours } = req.body; 
    const userId = req.userId;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "App name is required." });
    }

    const activeChannels = Array.isArray(channel) ? channel : [];

    const newApp = await App.create({
      name,
      userId,
      channel: activeChannels,
      apiKey: generateApiKey(),
    });

    const defaultQuietHours = {
      enabled: false,
      start: "22:00",
      end: "08:00",
    };

    await UserPreference.findOneAndUpdate(
      { appId: newApp._id },
      {
        $set: {
          preferences: {
            email: activeChannels.includes("email"),
            sms: activeChannels.includes("sms"),
            inapp: activeChannels.includes("in-app") || activeChannels.includes("inapp"),
          },
          quietHours: quietHours || defaultQuietHours, 
        },
      },
      { upsert: true, new: true }
    );

    return res
      .status(201)
      .json({ message: "App created successfully.", app: newApp });
  } catch (error) {
    console.error("Create App Error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

export const fetchProjects = async (req, res) => {
  try {
    const userId = req.userId;
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const apps = await App.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },

      {
        $lookup: {
          from: "notifications",
          localField: "_id",
          foreignField: "appId",
          as: "appNotifications",
        },
      },

      {
        $addFields: {
          lastActive: { $max: "$appNotifications.createdAt" },
          totalRequest: { $size: "$appNotifications" },
        },
      },

      {
        $addFields: {
          status: {
            $cond: {
              if: {
                $and: [
                  {
                    $gt: [
                      { $ifNull: ["$lastActive", new Date(0)] },
                      fiveDaysAgo,
                    ],
                  },
                  { $gt: ["$totalRequest", 0] },
                ],
              },
              then: "Active",
              else: "Inactive",
            },
          },
        },
      },

      { $project: { appNotifications: 0 } },
      { $sort: { status: 1, lastActive: -1 } },
    ]);

    return res.status(200).json({
      apps: apps || [],
    });
  } catch (error) {
    console.error("Aggregation Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({ message: "ProjectId is required." });
    }

    const deletedApp = await App.findByIdAndDelete(projectId);

    if (!deletedApp) {
      return res.status(404).json({ message: "Project not found." });
    }

    const deleteResult = await Notification.deleteMany({ appId: projectId });

    await UserPreference.deleteOne({ appId: projectId });

    return res.status(200).json({
      message: "Project and all associated notifications deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
