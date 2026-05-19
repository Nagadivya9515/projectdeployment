// // services/auth.service.js
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { env } from "../configs/env.js";
// import { generateOtp, otpExpiry } from "../utils/helpers.js";
// import { sendVerificationEmail, sendForgotPasswordEmail } from "./email.service.js";
// import { ApiError } from "../utils/ApiError.js";
// import prisma from "../configs/db.js"; // your Prisma client

// // ─── register ────────────────────────────────────────────────
// export const registerUser = async ({ name, email, password }) => {
//   // 1. check existing user
//   const existing = await prisma.user.findUnique({ where: { email } });
//   if (existing) throw new ApiError(409, "User already exists");

//   // 2. hash password
//   const hashedPassword = await bcrypt.hash(password, 10);

//   // 3. create user with OTP
//   const otp = generateOtp();
//   const user = await prisma.user.create({
//     data: {
//       name,
//       email,
//       password:   hashedPassword,
//       otp,
//       otpExpires: new Date(otpExpiry()),
//       isVerified: false,
//     },
//   });

//   // 4. send email — OTP never goes in the response
//   await sendVerificationEmail(email, otp);

//   // 5. return only safe fields
//   return { id: user.id, name: user.name, email: user.email };
// };

// // ─── verifyOtp ───────────────────────────────────────────────
// export const verifyUserOtp = async ({ email, otp }) => {
//   const user = await prisma.user.findUnique({ where: { email } });
//   if (!user)              throw new ApiError(404, "Email not found");
//   if (user.otp !== otp)   throw new ApiError(400, "Incorrect OTP");
//   if (user.otpExpires < new Date()) throw new ApiError(400, "OTP has expired");

//   await prisma.user.update({
//     where: { email },
//     data:  { otp: null, otpExpires: null, isVerified: true },
//   });

//   return { email };
// };

// // ─── resendOtp ───────────────────────────────────────────────
// export const resendUserOtp = async ({ email }) => {
//   const user = await prisma.user.findUnique({ where: { email } });
//   if (!user) throw new ApiError(404, "Email not found");

//   const otp = generateOtp();
//   await prisma.user.update({
//     where: { email },
//     data:  { otp, otpExpires: new Date(otpExpiry()) },
//   });

//   await sendVerificationEmail(email, otp);
//   return { email };
// };

// // ─── login ───────────────────────────────────────────────────
// export const loginUser = async ({ email, password }) => {
//   const user = await prisma.user.findUnique({ where: { email } });
//   if (!user) throw new ApiError(404, "Email not found");

//   const isValid = await bcrypt.compare(password, user.password);
//   if (!isValid) throw new ApiError(401, "Incorrect password");

//   if (!user.isVerified) throw new ApiError(401, "Please verify your email first");

//   const token = jwt.sign(
//     { id: user.id, role: user.role },
//     env.JWT_SECRET,
//     { expiresIn: env.JWT_EXPIRES }
//   );

//   return {
//     token,
//     user: {
//       id:         user.id,
//       name:       user.name,
//       email:      user.email,
//       role:       user.role,
//       isVerified: user.isVerified,
//     },
//   };
// };

// // ─── forgotPassword ──────────────────────────────────────────
// export const forgotUserPassword = async ({ email }) => {
//   const user = await prisma.user.findUnique({ where: { email } });
//   if (!user) throw new ApiError(404, "Email not found");

//   const otp = generateOtp();
//   await prisma.user.update({
//     where: { email },
//     data:  { otp, otpExpires: new Date(otpExpiry()) },
//   });

//   await sendForgotPasswordEmail(email, otp);
//   return { email };
// };

// // ─── resetPassword ───────────────────────────────────────────
// export const resetUserPassword = async ({ email, otp, newPassword, confirmPassword }) => {
//   if (newPassword !== confirmPassword)
//     throw new ApiError(400, "Passwords do not match");

//   const user = await prisma.user.findUnique({ where: { email } });
//   if (!user)              throw new ApiError(404, "Email not found");
//   if (user.otp !== otp)   throw new ApiError(400, "Incorrect OTP");
//   if (user.otpExpires < new Date()) throw new ApiError(400, "OTP has expired");

//   const hashedPassword = await bcrypt.hash(newPassword, 10);
//   await prisma.user.update({
//     where: { email },
//     data:  { password: hashedPassword, otp: null, otpExpires: null },
//   });

//   return { email };
// };
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { transporter } from "./email.service.js";

// Helper: Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Helper: Send Mail
const sendOTPMail = async (email, subject, title, otp) => {
    await transporter.sendMail({
        from: `TaskTracker <${process.env.EMAIL_USER}>`,
        to: email,
        subject: subject,
        html: `<h2>${title}</h2><p>Your OTP is: <b>${otp}</b></p><p>Valid for 10 minutes.</p>`
    });
};

export const registerUser = async (userData) => {
    const { name, email, password } = userData;
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new ApiError(409, "User already exists");

    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    const user = await User.create({
        name,
        email,
        password, // Hashing handled by pre-save hook in model
        otp,
        otpExpires,
        isVerified: false
    });

    await sendOTPMail(email, "Verify Registration", "Email Verification OTP", otp);
    return { id: user._id, name: user.name, email: user.email };
};

export const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "Email not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ApiError(401, "Invalid credentials");

    if (!user.isVerified) throw new ApiError(401, "Email not verified");

    const token = jwt.sign(
        { _id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    return { 
        token, 
        user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    };
};

export const verifyUserOtp = async ({ email, otp }) => {
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");

    // Ensure strict string comparison
    if (user.otp !== String(otp)) {
        throw new ApiError(400, "Incorrect OTP");
    }

    if (user.otpExpires < Date.now()) {
        throw new ApiError(400, "OTP expired");
    }

    user.isVerified = true;
    user.otp = undefined; // Clear the OTP after success
    user.otpExpires = undefined;

    // This will now work because isVerified is in the Schema
    await user.save(); 
    
    return { email: user.email, isVerified: user.isVerified };
};

export const resendUserOtp = async ({ email }) => {
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendOTPMail(email, "Resend OTP", "Your New Verification OTP", otp);
    return { email: user.email };
};

export const forgotUserPassword = async ({ email }) => {
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendOTPMail(email, "Password Reset", "Password Reset OTP", otp);
    return { email: user.email };
};

export const resetUserPassword = async ({ email, otp, newPassword, confirmPassword }) => {
    if (newPassword !== confirmPassword) throw new ApiError(400, "Passwords do not match");

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");
    if (user.otp !== otp) throw new ApiError(400, "Incorrect OTP");
    if (user.otpExpires < Date.now()) throw new ApiError(400, "OTP expired");

    user.password = newPassword; // Hashing handled by pre-save hook
    user.otp = null;
    user.otpExpires = null;
    await user.save();
    return { email: user.email };
};