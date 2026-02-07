import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  console.log("Preparing to send email to:", to);

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS, 
    },
    tls: {
      rejectUnauthorized: false, 
    },
    connectionTimeout: 10000,
  });

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.MAIL_NAME}" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
      html: `<b>${text}</b>`,
    });

    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Nodemailer Error:", error.message);
    throw error;
  }
};