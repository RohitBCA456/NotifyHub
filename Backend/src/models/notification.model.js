import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    appId: { type: Schema.Types.ObjectId, ref: "App", required: true },

    channel: { type: String, enum: ["email", "sms", "push"], required: true },

    to: { type: String },

    message: { type: String },

    subject: { type: String },

    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },

    createdAt: { type: Date, default: Date.now },

    sentAt: { type: Date },
  },

  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
