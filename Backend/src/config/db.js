import mongoose from "mongoose";
import { config } from "../../urlConfig.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      `${config.services.MongoDB_URL}/${process.env.DB_NAME}`,
    );
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export const clearDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
};

export const closeDB = async () => {
  await mongoose.connection.close();
};
