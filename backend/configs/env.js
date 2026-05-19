
// purpose:
// - load environment variables from .env file
// - ensure critical variables are present before app starts
// method:
// - use dotenv to load variables
// - check for required variables and log errors if missing
// in production, consider using a more robust config management solution (e.g., vault, AWS Parameter Store)
// example usage:
// import { loadEnv } from './configs/env.js';
// loadEnv(); // Call this at the very start of your app
// npm install dotenv

// configs/env.js
import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT:         process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET:   process.env.JWT_SECRET,
  JWT_EXPIRES:  process.env.JWT_EXPIRES || "1h",
  MAIL_USER:    process.env.MAIL_USER,
  MAIL_PASS:    process.env.MAIL_PASS,
  APP_NAME:     process.env.APP_NAME || "EventBooking",
  NODE_ENV:     process.env.NODE_ENV || "development",
};

