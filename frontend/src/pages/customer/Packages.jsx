import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { packageApi } from "../../api/package.api";
import PackageCard from "../../components/packages/PackageCard";
import { useAuthStore } from "../../store/auth.store";
import { ROUTES } from "../../constants/routes.js";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useUiStore } from "../../store/ui.store";

export default function Packages() {

  const [packages, setPackages] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const toast = useUiStore((state) => state.toast);
  const user = useAuthStore((state) => state.user);

  const isManagerOrAdmin = user?.role === "manager" || user?.role === "admin";

  // 🔹 FETCH PACKAGES (single source of truth)
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await packageApi.getPackages();
        const payload = res?.data?.data || res?.data || res;
        
        setPackages(Array.isArray(payload) ? payload : []);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load event packages.");
      }
    };

    fetchPackages();
  }, []);

  // 🔹 FILTER LOGIC
  const filteredPackages = packages.filter((pkg) => {
    const matchSearch =
      pkg.name?.toLowerCase().includes(search.toLowerCase()) ||
      pkg.description?.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      category === "All" || pkg.eventType === category;

    return matchSearch && matchCategory;
  });

  const categories = [
    "All",
    ...new Set(packages.map((p) => p.eventType).filter(Boolean)),
  ];

  return (
    <div className="min-h-screen bg-[#F9F8F6] p-6">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 py-8 bg-[#fffdf7]">
        <h2
          className="text-3xl font-bold text-center mb-6"
          style={{ fontFamily: "Playfair Display" }}
        >
          Event Packages
        </h2>

        {isManagerOrAdmin && (
          <div className="mb-6 text-right">
          <Link to={ROUTES.MANAGER_PACKAGES}>
            <button className="bg-[#B87C4C] text-white py-2 px-4 rounded-lg transition">
              + Manage Package
            </button>
          </Link>
          </div>
        )}
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded shadow mb-6 grid md:grid-cols-2 gap-4">
        <input
          placeholder="Search packages"
          className="border p-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* PACKAGES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredPackages.map((pkg) => (
          <PackageCard
            key={pkg._id}
            pkg={pkg}
            onDelete={(id) =>
              setPackages((prev) => prev.filter((p) => p._id !== id))
            }
          />
        ))}
      </div>

      {filteredPackages.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 font-medium">No packages found matching your filter criteria.</p>
        </div>
      )}
    </div>
  );
}
