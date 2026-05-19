// api/booking.api.js
import api from "./axios";

export const bookingApi = {
  create:       (data) => api.post("/bookings", data),
  getMyBookings:()     => api.get("/bookings/my"),
  getById:      (id)   => api.get(`/bookings/${id}`),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),

  // manager
  getManagerBookings: () => api.get("/bookings/manager"),
};