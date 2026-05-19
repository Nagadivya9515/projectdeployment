import { Router } from "express";
import * as bookingController from "../controllers/booking.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = Router();
router.use(authMiddleware);

router.get("/my-bookings", bookingController.getMyBookings);
router.post("/create", roleMiddleware("user"), bookingController.createBooking); // Fixes P1: Admin check in middleware
router.patch("/status/:id", bookingController.updateBookingStatus);

export default router;