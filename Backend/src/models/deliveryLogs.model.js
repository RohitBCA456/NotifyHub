import mongoose, { Schema } from "mongoose";

const deliveryLogSchema = new Schema(
  {
    notificationId: {
      type: Schema.Types.ObjectId,
      ref: "Notification",
      required: true,
    },

    channel: { type: String, enum: ["email", "sms", "push"], required: true },

    deliveryStatus: {
      type: String,
      enum: ["delivered", "failed"],
      required: true,
    },

    error: { type: String },

    deliveredAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const DeliveryLog = mongoose.model("DeliveryLog", deliveryLogSchema);
