import twilio from "twilio";
import { emitUser } from "../config/socket.js";

import dotenv from "dotenv";
dotenv.config();


const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendSMS = async (to, message, meta) => {

  console.log(to, message);
  try {
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });

    emitUser(meta.userId, "notification_sent", {
      notificationId: meta._id,
      channel: "sms",
      status: "sent",
      message: message,
      createdAt: new Date(),
    });

    console.log("SMS sent:", response.sid);
    return response;
  } catch (error) {
    console.error("Error sending SMS:", error.message);
    throw error;
  }
};
