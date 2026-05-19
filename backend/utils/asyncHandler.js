/**
 * utils/asyncHandler.js
Eliminates try/catch from every single controller function

❌ Before — try/catch repeated in every controller (10+ times)
// auth.controller.js
const login = async (req, res) => {
  try {
    const user = await authService.login(req.body);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// booking.controller.js — SAME try/catch again
const createBooking = async (req, res) => {
  try {
    const booking = await bookingService.create(req.body);
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 */

// ✅ After — one wrapper, zero try/catch in any controller
// utils/asyncHandler.js — write once
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    next(err); // sends error to global error middleware
  }
};

export { asyncHandler };

/**
 * // auth.controller.js — clean, no try/catch
const login = asyncHandler(async (req, res) => {
  const user = await authService.login(req.body);
  res.status(200).json(new ApiResponse(200, user, "Login successful"));
});
 */