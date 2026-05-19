import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as bookingService from "../services/booking.service.js";

export const createBooking = asyncHandler(async (req, res) => {
    const booking = await bookingService.processBooking(req.user.id, req.body);
    res.status(201).json(new ApiResponse(201, booking, "Booking created successfully"));
});

export const getMyBookings = asyncHandler(async (req, res) => {
    const bookings = await bookingService.getUserBookings(req.user.id);
    res.status(200).json(new ApiResponse(200, bookings, "Bookings fetched"));
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const booking = await bookingService.updateStatus(id, status, req.user);
    res.status(200).json(new ApiResponse(200, booking, "Status updated"));
});