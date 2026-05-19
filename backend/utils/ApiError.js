/**
 * utils/ApiError.js
A custom error class so all errors are consistent and informative
 * ❌ Before — errors are inconsistent and lose information
// controller throws plain strings or generic errors
throw new Error("User not found");         // no status code
res.status(404).json({ msg: "Not found" }); // not thrown, just sent
res.status(500).json({ error: err.message }); // exposes internals!
 */

// ✅ After — errors carry status code, message, and stack trace

class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors  = [],
    stack   = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message    = message;
    this.success    = false;
    this.errors     = errors;  // array of field-level errors

    // preserve stack trace in development
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };

// // Usage anywhere in the app:
// throw new ApiError(404, "User not found")
// throw new ApiError(400, "Validation failed", ["email is required"])
// throw new ApiError(401, "Unauthorized")