// hooks/useAuth.js
import { useAuthStore } from "../store/auth.store";
import { useCartStore } from "../store/cart.store";
import { useUiStore }   from "../store/ui.store";
import { authApi }      from "../api/auth.api";
import { useNavigate }  from "react-router-dom";
import { ROUTES }       from "../constants/routes";

export const useAuth = () => {
  const { user, token, isAuthenticated, setAuth, logout: _logout } = useAuthStore();
  const clearCart = useCartStore((s) => s.clearCart);
  const { toast } = useUiStore();
  const navigate = useNavigate();

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    const { user, token } = res.data.data;
    setAuth(user, token);
    toast.success(`Welcome back, ${user.name}!`);

    // redirect based on role
    if (user.role === "manager") navigate(ROUTES.MANAGER_DASHBOARD);
    else if (user.role === "admin") navigate(ROUTES.ADMIN_DASHBOARD);
    else navigate(ROUTES.HOME);
  };

  const logout = async () => {
    await clearCart();
    _logout();
    toast.success("Logged out successfully");
    navigate(ROUTES.LOGIN);
  };

  const isManager = user?.role === "manager";
  const isAdmin   = user?.role === "admin";
  const isCustomer = user?.role === "customer";

  return { user, token, isAuthenticated, login, logout, isManager, isAdmin, isCustomer };
};