// utils/helpers.js

/**
 * Generates a 6-digit OTP string
 */
export const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/**
 * Returns OTP expiry timestamp — 10 minutes from now
 */
export const otpExpiry = () => Date.now() + 10 * 60 * 1000;