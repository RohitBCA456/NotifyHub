import { User } from "../models/user.model.js";
import { App } from "../models/app.model.js";
import { generateApiKey } from "../utils/generateApiKey.js";

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

    newUser.webToken = await newUser.generateWebToken();

    await newUser.save();

    return res
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

    return res.status(200).json({ message: "User logged out successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

export const createApp = async (req, res) => {
  try {
    const { name, channel } = req.body;
    const userId = req.userId;

    if (name.trim() === "") {
      return res.status(400).json({ message: "App name is required." });
    }

    const newApp = await App.create({ name, userId, channel, apiKey: generateApiKey() });

    return res
      .status(201)
      .json({ message: "App created successfully.", app: newApp });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};
