/**
 * utils/ApiResponse.js
Wraps every successful response in a consistent shape

 * ❌ Before — what most beginners write (scattered across controllers)
// in auth.controller.js
res.status(200).json({ message: "Login successful", data: user });

// in booking.controller.js — different shape!
res.status(200).json({ success: true, booking: result });

// in package.controller.js — yet another shape!
res.status(200).json(packages);
 */

// ✅ After — one class, consistent everywhere

class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data      = data;
    this.message   = message;
    this.success   = statusCode < 400;
  }
}

export { ApiResponse };

// Now every controller looks like this — identical shape:
// res.status(200).json(new ApiResponse(200, user, "Login successful"))
// res.status(200).json(new ApiResponse(200, result, "Booking created"))
// res.status(200).json(new ApiResponse(200, packages, "Packages fetched"))