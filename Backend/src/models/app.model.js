import mongoose, { Schema } from "mongoose";

const appSchema = new Schema({
  name: { type: String, required: true, unique: true },

  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

  channel: [{ type: String, required: true }],

  apiKey: { type: String, required: true, unique: true },

  createdAt: { type: Date, default: Date.now },

  updatedAt: { type: Date, default: Date.now },
});

export const App = mongoose.model("App", appSchema);
