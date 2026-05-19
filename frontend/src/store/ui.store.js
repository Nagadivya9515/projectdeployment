// store/ui.store.js
import { create } from "zustand";

export const useUiStore = create((set, get) => ({
  toasts: [],

  toast: {
    success: (message) => get()._addToast(message, "success"),
    error:   (message) => get()._addToast(message, "error"),
    info:    (message) => get()._addToast(message, "info"),
  },

  _addToast: (message, type) => {
    const id = Date.now();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    // auto-remove after 3 seconds
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 3000);
  },
}));