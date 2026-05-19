// api/axios.js
import axios from "axios";
import { useAuthStore } from "../store/auth.store";

const api = axios.create({
  // 💡 No localhost:5002 protocol text string! Vite proxy routes it automatically!
  baseURL: "/api/v1", 
  withCredentials: true,
});


// REQUEST interceptor — attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// RESPONSE interceptor — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // token expired — log user out automatically
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;