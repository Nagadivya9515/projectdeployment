

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { useCartStore } from "../../store/cart.store";
import { ROUTES } from "../../constants/routes";
import Button from "../ui/Button";

const NAV_LINKS = [
  { label: "Home", path: ROUTES.HOME, protected: false },
  { label: "Packages", path: ROUTES.PACKAGES, protected: false },
  { label: "Venora Services", path: ROUTES.PRODUCTS, protected: false },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const cartItems = useCartStore((state) => state.items || []);
  const cartCount = cartItems.reduce((acc, item) => acc + (item.qty || 1), 0);
  

  
  const isManagerOrAdmin = user?.role === "manager" || user?.role === "admin";

  const navStyle = "fixed top-0 left-0 w-full z-50 px-6 md:px-16 py-4 flex items-center justify-between bg-black/30 backdrop-blur-md border-b border-white/10 text-white transition-all";

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  // 👇 If NOT logged in & on home page → show only login
  if (!isAuthenticated && location.pathname === "/") {
    return (
      <nav className={navStyle}>
        <Link to={ROUTES.HOME} className="flex items-center">
          <span className="font-serif text-2xl font-bold tracking-wider text-amber-400">VENORA</span>
        </Link>
        <Link to={ROUTES.LOGIN}>
          <Button variant="inverse" className="px-6 py-2 text-sm font-semibold">
            Login
          </Button>
        </Link>
      </nav>
    );
  }

  return (
    <nav className={navStyle}>
      
      {/* Logo */}
      <Link to={ROUTES.HOME} className="flex items-center">
        <span className="font-serif text-2xl font-bold tracking-wider text-amber-400">VENORA</span>
      </Link>

      {/* Navigation */}
      <div className="flex items-center gap-8">
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-white/90">
          {NAV_LINKS.map((link) => (
            <li key={link.path}>
              <Link to={link.path}
                    className={`hover:text-amber-400 transition-colors ${location.pathname === link.path ? "text-amber-400" : ""}`}
              >
                {link.label}
              </Link>
            </li>
          ))}

          {!isManagerOrAdmin && isAuthenticated && (
            <li>
              <Link
                to={ROUTES.CART}
                className={`hover:text-amber-400 transition-colors ${location.pathname === ROUTES.CART ? "text-amber-400" : ""}`}
              >
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="bg-amber-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center animate-pulse ml-1">
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
          )}

          {isManagerOrAdmin && (
            <li>
              <Link 
                to={user?.role === "admin" ? ROUTES.ADMIN_DASHBOARD : ROUTES.MANAGER_DASHBOARD} 
                className="hover:text-amber-400 transition-colors text-amber-300 font-semibold"
              >
                Dashboard
              </Link>
            </li>
          )}
        </ul>
      
        <div>
        {isAuthenticated ? (
          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-xs border-red-500/30 text-red-300 bg-red-500/10 hover:bg-red-600 hover:text-white px-4 py-2 rounded-xl transition"
          >
            Logout
          </Button>
        ) : (
          <Link to = {ROUTES.LOGIN}>
            <Button variant="inverse" className="text-xs px-5 py-2">
            Login
            </Button>
          </Link>
        )}
      </div>
      </div>
      </nav>
  );
};

export default Navbar;
