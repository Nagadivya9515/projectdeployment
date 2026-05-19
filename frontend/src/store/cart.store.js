// store/cart.store.js
import { create } from "zustand";
import { cartApi } from "../api/cart.api";

export const useCartStore = create((set, get) => ({
  items:    [],
  loading:  false,
  error:    null,

  // computed value — total item count for navbar badge
  get itemCount() {
    return get().items.reduce((sum, i) => sum + i.qty, 0);
  },

  // computed value — total price
  get totalAmount() {
    return get().items.reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  fetchCart: async () => {
    set({ loading: true });
    try {
      const res = await cartApi.getCart();
      set({ items: res.data.data.items, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  addItem: async (itemId, type) => {
    try {
      const res = await cartApi.addItem({ itemId, type });
      set({ items: res.data.data.items });
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to add item" });
    }
  },

  updateItem: async (itemId, qty) => {
    try {
      const res = await cartApi.updateItem(itemId, qty);
      set({ items: res.data.data.items });
    } catch (err) {
      set({ error: err.response?.data?.message });
    }
  },

  clearCart: async () => {
    try {
      await cartApi.clearCart();
      set({ items: [] });
    } catch (err) {
      set({ error: err.response?.data?.message });
    }
  },
}));