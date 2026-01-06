import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost/api/accuattend",
  headers: {
    "Content-Type": "application/json"
  }
});

// Add Authorization header if access_token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;
