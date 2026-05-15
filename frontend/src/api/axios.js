import axios from "axios";

/* =========================
   API BASE URL
========================= */
const baseURL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000/api";

/* =========================
   AXIOS INSTANCE
========================= */
const API = axios.create({
  baseURL,
  withCredentials: true,
});

/* =========================
   REQUEST INTERCEPTOR
   (Attach JWT token)
========================= */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // ALWAYS ensure headers exists first (important fix)
    config.headers = config.headers || {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */
let isRedirecting = false;

API.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    console.error("API ERROR:", status, message);

    /* =========================
       401 - Unauthorized
    ========================== */
    if (status === 401) {
      localStorage.removeItem("token");

      if (!isRedirecting) {
        isRedirecting = true;

        setTimeout(() => {
          window.location.href = "/auth";
        }, 150);
      }
    }

    /* =========================
       403 - Forbidden
    ========================== */
    if (status === 403) {
      console.warn("Access denied (403)");
    }

    /* =========================
       500+ Server errors
    ========================== */
    if (status >= 500) {
      console.error("Server error:", message);
    }

    return Promise.reject(error);
  }
);

export default API;