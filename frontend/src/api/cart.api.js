// api/cart.api.js
import api from "./axios";

export const cartApi = {
  getCart:   ()           => api.get("/cart"),
  addItem:   (data)       => api.post("/cart/add", data),
  updateItem:(itemId, qty) => api.put(`/cart/${itemId}`, { qty }),
  removeItem:(itemId)     => api.delete(`/cart/${itemId}`),
  clearCart: ()           => api.delete("/cart/clear"),
};