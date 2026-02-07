import { Resend } from 'resend';
import dotenv from "dotenv";
import { emitUser } from '../config/socket.js';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, text, meta) => {
  console.log("Using Resend to send email to:", to);

  try {
    const { data, error } = await resend.emails.send({
      from: 'NotifyHub <onboarding@resend.dev>',
      to: [to],
      subject: subject,
      html: `<strong>${text}</strong>`,
    });

    emitUser(meta.userId, "notification_sent", {
      notificationId: meta._id,
      channel: "email",
      status: "sent",
      message: text,
      createdAt: new Date(),
    });

    if (error) {
      console.error("Resend Error:", error);
      throw new Error(error.message);
    }

    console.log("Email sent successfully via Resend:", data.id);
  } catch (error) {
    console.error("Failed to send email:", error.message);
    throw error;
  }
};