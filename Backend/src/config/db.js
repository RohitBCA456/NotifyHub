import mongoose from "mongoose";
import { config } from "../../urlConfig.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(`${config.services.MongoDB_URL}/${process.env.DB_NAME}`);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};
