// api/auth.api.js
import api from "./axios";

export const authApi = {
  register:      (data) => api.post("/auth/register", data),
  login:         (data) => api.post("/auth/login", data),
  verifyOtp:     (data) => api.post("/auth/verify-otp", data),
  resendOtp:     (data) => api.post("/auth/resend-otp", data),
  forgotPassword:(data) => api.post("/auth/forgot-password", data),
  resetPassword: (data) => api.post("/auth/reset-password", data),
  getMe:         ()     => api.get("/auth/me"),
};