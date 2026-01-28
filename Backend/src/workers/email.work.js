import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {

  console.log(to, subject, text)

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"${process.env.MAIL_NAME}" <${process.env.MAIL_USER}>`,
    to,
    subject,
    text,
    html: `<b>${text}</b>`,
  });

  console.log("Email sent:", info.messageId);
};
