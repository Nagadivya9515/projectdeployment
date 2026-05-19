/**
 * middlewares/error.middleware.js
The single place that handles ALL errors thrown anywhere in the app

 */

import { ApiError } from "../utils/ApiError.js";

const errorMiddleware = (err, req, res, next) => {
  
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // if it's our custom ApiError, use its properties
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success    : false,
      message    : err.message,
      errors     : err.errors,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
  }

  // unknown error — don't leak details to client
  console.error("Unhandled error:", err);
  return res.status(500).json({
    success : false,
    message : "Internal server error",
  });
};

export { errorMiddleware };