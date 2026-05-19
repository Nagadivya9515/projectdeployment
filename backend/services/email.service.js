// services/email.service.js
import nodemailer from "nodemailer";
import { env } from "../configs/env.js";

// Create transporter once — reuse everywhere
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASS,
  },
});

/**
 * Sends an OTP email
 * @param {string} to      - recipient email
 * @param {string} otp     - the OTP code
 * @param {string} subject - email subject line
 * @param {string} heading - heading inside the email body
 */
export const sendOtpEmail = async (to, otp, subject, heading) => {
  await transporter.sendMail({
    from: `${env.APP_NAME} <${env.MAIL_USER}>`,
    to,
    subject,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;">
        <h2>${heading}</h2>
        <p>Your OTP is: <b style="font-size:24px;letter-spacing:4px">${otp}</b></p>
        <p style="color:#888">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
      </div>
    `,
  });
};

// Named exports for each email type — even cleaner to call
export const sendVerificationEmail  = (to, otp) =>
  sendOtpEmail(to, otp, "Verify your email", "Email Verification OTP");

export const sendForgotPasswordEmail = (to, otp) =>
  sendOtpEmail(to, otp, "Password Reset OTP", "Password Reset OTP");