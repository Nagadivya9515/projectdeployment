import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse }  from "../utils/ApiResponse.js";
import * as authService from "../services/auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const data = await authService.registerUser(req.body);
  res.status(201).json(new ApiResponse(201, data, "Registered successfully. Check your email for OTP."));
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const data = await authService.verifyUserOtp(req.body);
  res.status(200).json(new ApiResponse(200, data, "Email verified successfully"));
});

export const resendOtp = asyncHandler(async (req, res) => {
  const data = await authService.resendUserOtp(req.body);
  res.status(200).json(new ApiResponse(200, data, "OTP resent. Check your email."));
});

export const login = asyncHandler(async (req, res) => {
  const data = await authService.loginUser(req.body);
  res.status(200).json(new ApiResponse(200, data, "Login successful"));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const data = await authService.forgotUserPassword(req.body);
  res.status(200).json(new ApiResponse(200, data, "Password reset OTP sent to your email."));
});

export const resetPassword = asyncHandler(async (req, res) => {
  const data = await authService.resetUserPassword(req.body);
  res.status(200).json(new ApiResponse(200, data, "Password reset successful"));
});