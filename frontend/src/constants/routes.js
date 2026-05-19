// constants/routes.js
// All route strings defined once — never hardcode "/login" in a component
export const ROUTES = {
  HOME:             "/",
  LOGIN:            "/login",
  REGISTER:         "/register",
  VERIFY_OTP:       "/verify-otp",
  RESEND_OTP:       "/resend-otp",
  FORGOT_PASSWORD:  "/forgot-password",
  RESET_PASSWORD:   "/reset-password",
  PACKAGES:         "/packages",
  PACKAGE_DETAIL:   "/packages/:slug",
  PRODUCTS:         "/products",
  CART:             "/cart",
  CHECKOUT:         "/checkout",
  MY_BOOKINGS:      "/my-bookings",

  MANAGER_DASHBOARD:  "/manager",
  MANAGER_PACKAGES:   "/manager/packages",
  MANAGER_PRODUCTS:   "/manager/products",
  MANAGER_BOOKINGS:   "/manager/bookings",

  ADMIN_DASHBOARD:    "/admin",
  ADMIN_MANAGERS:     "/admin/managers",
};