// api/package.api.js
import api from "./axios";

export const packageApi = {
  getAll:          (params) => api.get("/packages", { params }),
  getBySlug:       (slug)   => api.get(`/packages/${slug}`),
  getTypesBySlug:  (slug)   => api.get(`/packages/${slug}/types`),
  getTypeById:     (id)     => api.get(`/packages/types/${id}`),

  // manager only
  create:          (data)   => api.post("/packages", data),
  update:          (id, data) => api.put(`/packages/${id}`, data),
  remove:          (id)     => api.delete(`/packages/${id}`),
  createType:      (data)   => api.post("/packages/types", data),
  updateType:      (id, data) => api.put(`/packages/types/${id}`, data),
  removeType:      (id)     => api.delete(`/packages/types/${id}`),
};