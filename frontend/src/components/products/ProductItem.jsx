import { useAuthStore } from "../../store/auth.store";
import { useCartStore } from "../../store/cart.store";
import { useUiStore } from "../../store/ui.store";
import { formatCurrency } from "../../utils/formatCurrency"

const ProductItem = ({item, onDelete}) => {
    const user = useAuthStore((s) => s.user);
    const isAdmin = user?.role === "admin";
    const isManager = user?.role === "manager";
    const cartItems = useCartStore((s) => s.items);
    const addItem = useCartStore((s) => s.addItem);
    const { toast } = useUiStore();

    const isInCart = cartItems.some((c) => c.itemId == item._id);

    const handleAdd = async () => {
        await addItem(item._id, "product");
        toast.success(`${item.name} added to cart!`);
    };

    return (
    <div className="flex gap-4 border-b py-6">
      <img
        src={item.image || "/placeholder.png"}
        className="w-32 h-32 rounded-lg object-cover flex-shrink-0"
        alt={item.name}
      />

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900">{item.name}</h4>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
        <p className="mt-2 font-semibold text-gray-900">{formatCurrency(item.price)}</p>
      </div>

      {/* Admin — delete button */}
      {(isAdmin || isManager) && (
        <button
          onClick={() => onDelete(item._id)}
          className="text-[#B87C4C] px-3 bg-[#F7F1DE] rounded-md h-8 self-start mt-2 text-sm hover:bg-[#eddfc5] transition"
        >
          Delete
        </button>
      )}

      {/* Customer — add to cart */}
      {!isAdmin && !isManager && (
        <div className="self-start mt-2">
          {isInCart ? (
            <span className="px-3 py-1.5 text-sm border border-[#B87C4C] rounded-md text-[#B87C4C] font-medium">
              ✓ Added
            </span>
          ) : (
            <button
              onClick={handleAdd}
              className="px-3 py-1.5 text-sm border border-[#B87C4C] rounded-md text-[#B87C4C] font-medium hover:bg-[#B87C4C] hover:text-white transition"
            >
              Add
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductItem;