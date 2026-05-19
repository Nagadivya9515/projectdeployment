
import { useAuth } from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { packageApi } from "../../api/package.api.js";
import {useAuthStore} from "../../store/auth.store";
import { ROUTES } from "../../constants/routes.js";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useUiStore } from "../../store/ui.store";

export default function PackageCard({ pkg, onDelete }) {
  
  const navigate = useNavigate();

  const toast = useUiStore((state) => state.toast);
  const user = useAuthStore((state) => state.user);

  const isManagerOrAdmin = user?.role === "manager" || user?.role === "admin";


  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this package?")) return;

  try {
    await packageApi.deletePackage(pkg._id);
    toast.success("Package deleted");
    onDelete(pkg._id); // 🔥 instant UI update
    } 
  catch (err) {
    toast.error(err.response?.data?.error || "Delete failed");
    }
  };

  const handleClick = () => {
    navigate(ROUTES.PACKAGE_DETAIL.replace(":slug", pkg.slug || pkg._id));
  };

  return (
    <div
      onClick={handleClick}
      className="rounded-xl overflow-hidden shadow bg-white cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-48">
        <img src={pkg.image || '/a.png'} alt={pkg.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-stone-900/10 transition-colors group-hover:bg-stone-900/20" />
        {pkg.eventType && (
          <span className="absolute top-3 left-3 bg-white/80 text-xs px-2 py-1 rounded">
            {pkg.eventType}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-2">
        <h3 className="font-semibold text-lg text-gray-900 font-serif line-clamp-1 group-hover:text-amber-600 transition-colors">
          {pkg.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px] leading-relaxed">
          {pkg.description}
        </p>
      </div>

      {/* Admin actions */}
      {isManagerOrAdmin && (
        <div
          className="flex border-t border-gray-100 divide-x divide-gray-100 bg-gray-50/50"
          onClick={(e) => e.stopPropagation()} // Blocks bubble routing execution triggers
        >
          <Link
            to={`${ROUTES.MANAGER_PACKAGES}/edit/${pkg._id}`}
            className="w-1/2 text-center py-3 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
          >
            Edit Package
          </Link>
          <button
            onClick={handleDelete}
            className="w-1/2 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
