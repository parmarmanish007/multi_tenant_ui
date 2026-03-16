import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// response interceptor: when JWT expires (401) force re-login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const detail = error?.response?.data?.detail;

    if (status === 401) {
      // clear auth info
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userid");

      // notify user (best-effort)
      try {
        alert(detail || "Session expired. Please login again.");
      } catch (e) {
        /* ignore if alert unavailable */
      }

      // redirect to login page
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;
