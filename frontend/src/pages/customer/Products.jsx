
import { productApi } from "../../api/product.api";
import { useCartStore } from "../../store/cart.store";
import { useAuthStore } from "../../store/auth.store";
import { useUiStore } from "../../store/ui.store";
import { ROUTES } from "../../constants/routes";
import { useProducts } from "../../hooks/useProducts";
import ProductItem from "../../components/products/ProductItem";
import CategorySidebar from "../../components/products/CategorySidebar";
import Spinner from "../../components/ui/Spinner";
import { useState } from 'react';

const ConfirmToast = ({onConfirm, onCancel}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-blac/40">
    <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4">
      <h3 className="font-semibold text-gray-900 mb-2">Delete Product</h3>
      <p className="text-sm text-gray-500 mb-6">This cannot be undone.</p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 transitions">
            Cancel
        </button>
        <button
          onClick={onConfirm}
          classname = "px-4 py-2 text-sm bg-red-500 text0white rounded-lg hover:bg-red-600 transition">
            Delete
        </button>
      </div>
    </div>
  </div>
);

export default function Products() {

  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";
  const {toast} = useUiStore();

  const { sections, loading, error, reload } = useProducts();

  const [confirmId, setConfirmId] = useState(null);

  const handleDelete = async () => {
    try {
      await productApi.remove(confirmId);
      toast.success("Product deleted");
      reload(); // refresh the list
    } catch (err) {
      toast.error(err.response?.data?.message || "Deletion failed");
    } finally {
      setConfirmId(null);
    }
  };

  const scrollToCategory = (category) => {
    document.getElementById(category)?.scrollIntoView({ behavior: "smooth" });
  };


  if (loading) return <Spinner className="mt-20" size="lg" />;

  if (error) return (
    <div className="flex flex-col items-center justify-center mt-20 gap-4">
      <p className="text-red-500 text-sm">{error}</p>
      <button onClick={reload} className="text-sm text-indigo-600 hover:underline">
        Try again
      </button>
    </div>
  );

  return (
    // ✅ P8 fixed — wrapper div now contains everything
    <div className="bg-[#fffdf7] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {/* ✅ P9 fixed — font-playfair class, not inline style */}
          <h2 className="text-3xl font-bold font-playfair">
            Venora Services
          </h2>

          {/* ✅ P7 fixed — only show for admin/manager */}
          {(isAdmin || isManager) && (
            <Link
              to={ROUTES.PRODUCT_ADD}
              className="bg-[#B87C4C] text-white py-2 px-4 rounded-lg hover:bg-[#9e6a3c] transition text-sm"
            >
              + Add New Product
            </Link>
          )}
        </div>

        {sections.length === 0 ? (
          <p className="text-center text-gray-400 mt-20">No products available yet.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* Category sidebar */}
            <CategorySidebar
              sections={sections}
              onCategoryClick={scrollToCategory}
            />

            {/* Product list */}
            <div className="lg:col-span-3 space-y-14">
              {sections.map((section) => (
                <div key={section.category} id={section.category}>
                  {/* ✅ P9 fixed — font-playfair */}
                  <h2 className="text-2xl font-bold mb-6 uppercase font-playfair">
                    {section.category}
                  </h2>

                  {section.items.map((item) => (
                    <ProductItem
                      key={item._id}
                      item={item}
                      // ✅ P7 fixed — sets ID for modal, not window.confirm
                      onDelete={(id) => setConfirmId(id)}
                    />
                  ))}
                </div>
              ))}
            </div>

          </div>
        )}
      </div>

      {/* ✅ P7 fixed — proper confirm modal, not window.confirm */}
      {confirmId && (
        <ConfirmToast
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  );
}
