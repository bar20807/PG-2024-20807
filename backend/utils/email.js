import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "hotmail", // Servidor SMTP de Outlook
  port: 587, // Puerto de Outlook
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = (to, token) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: "Email Verification",
    text: `Please verify your email by clicking the link: ${process.env.CLIENT_URL_PROD}/api/players/verify-email?token=${token}`,
  };

  return transporter.sendMail(mailOptions);
};
