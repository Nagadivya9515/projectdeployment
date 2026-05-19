// routes/RoleRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { ROUTES } from "../constants/routes";

const RoleRoute = ({ allowedRoles }) => {
  const user = useAuthStore((s) => s.user);

  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to={ROUTES.HOME} replace />;

  return <Outlet />;
};

export default RoleRoute;