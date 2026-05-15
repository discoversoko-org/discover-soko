export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/* USER ROLES */
export const ROLES = {
  USER: "user",
  ADMIN: "admin",
};

/* BUSINESS LIMITS (MVP RULES) */
export const BUSINESS_LIMITS = {
  MAX_PER_USER: 1,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

/* BUSINESS STATUS */
export const BUSINESS_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

/* IMAGE FALLBACKS */
export const FALLBACKS = {
  BUSINESS_IMAGE: "/placeholder-business.png",
  AVATAR: "/placeholder-avatar.png",
};

/* ROUTES (optional centralization) */
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  ADMIN: "/admin",
};