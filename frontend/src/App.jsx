// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "./constants/routes";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute      from "./routes/RoleRoute";
import Toast          from "./components/ui/Toast";
import Navbar         from "./components/layout/Navbar";
import ResendOtp from "./pages/auth/ResendOtp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
// pages — lazy loaded for performance
import { lazy, Suspense } from "react";
import Spinner from "./components/ui/Spinner";

const Home           = lazy(() => import("./pages/customer/Home"));
const Login          = lazy(() => import("./pages/auth/Login"));
const Register       = lazy(() => import("./pages/auth/Register"));
const VerifyOtp      = lazy(() => import("./pages/auth/VerifyOtp"));
const Packages       = lazy(() => import("./pages/customer/Packages"));
const PackageDetail  = lazy(() => import("./pages/customer/PackageDetail"));
const Products       = lazy(() => import("./pages/customer/Products"));
const Cart           = lazy(() => import("./pages/customer/Cart"));
const Checkout       = lazy(() => import("./pages/customer/Checkout"));
const MyBookings     = lazy(() => import("./pages/customer/MyBookings"));
const Dashboard      = lazy(() => import("./pages/manager/Dashboard"));
const ManagePackages = lazy(() => import("./pages/manager/ManagePackages"));
const ManageProducts = lazy(() => import("./pages/manager/ManageProducts"));
const ManageBookings = lazy(() => import("./pages/manager/ManageBookings"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));

const App = () => (
  <BrowserRouter>
    <Navbar />
    <Toast />
    <Suspense fallback={<Spinner className="mt-20" size="lg" />}>
      <Routes>
        {/* Public routes */}
        <Route path={ROUTES.HOME}       element={<Home />} />
        <Route path={ROUTES.LOGIN}      element={<Login />} />
        <Route path={ROUTES.REGISTER}   element={<Register />} />
        <Route path={ROUTES.VERIFY_OTP} element={<VerifyOtp />} />
        <Route path={ROUTES.RESEND_OTP} element={<ResendOtp />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
        <Route path={ROUTES.PACKAGES}   element={<Packages />} />
        <Route path={ROUTES.PACKAGE_DETAIL} element={<PackageDetail />} />
        <Route path={ROUTES.PRODUCTS}   element={<Products />} />

        {/* Customer protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.CART}        element={<Cart />} />
          <Route path={ROUTES.CHECKOUT}    element={<Checkout />} />
          <Route path={ROUTES.MY_BOOKINGS} element={<MyBookings />} />
        </Route>

        {/* Manager only routes */}
        <Route element={<RoleRoute allowedRoles={["manager"]} />}>
          <Route path={ROUTES.MANAGER_DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.MANAGER_PACKAGES}  element={<ManagePackages />} />
          <Route path={ROUTES.MANAGER_PRODUCTS}  element={<ManageProducts />} />
          <Route path={ROUTES.MANAGER_BOOKINGS}  element={<ManageBookings />} />
        </Route>

        {/* Admin only routes */}
        <Route element={<RoleRoute allowedRoles={["admin"]} />}>
          <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;