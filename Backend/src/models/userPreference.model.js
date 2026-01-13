import mongoose, { Schema } from "mongoose";

const userPreferenceSchema = new Schema(
  {
    appId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    preferences: {
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
      inapp: { type: Boolean, default: false },
    },

    quietHours: {
      start: { type: String, default: "22:00" },
      end: { type: String, default: "07:00" },
      enabled: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export const UserPreference = mongoose.model(
  "UserPreference",
  userPreferenceSchema
);
